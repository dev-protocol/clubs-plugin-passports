import type { ClubsConfiguration } from '@devprotocol/clubs-core'
import { bytes32Hex } from '@devprotocol/clubs-core'
import { PLUGIN_ID } from './index'
import { getPassportItemForPayload as getPassportItemFromPayload } from './passportItem'
import { Payments, type Option, type PassportItemDocument } from '../types'
import type {
	ComposedCheckoutOptions,
	PassportOffering,
	PassportOptionsDiscounts,
	PassportOptionsOverrides,
} from '../types'
import { Prices } from '../constants/price'
import { UndefinedOr, whenDefined } from '@devprotocol/util-ts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getDefaultClient } from '../db/redis'
import { isNil } from 'ramda'
import { toSize } from './variants'
import { Reason } from '../constants/reasons'

// eslint-disable-next-line functional/no-expression-statements
dayjs.extend(utc)

export type PassportItemData = PassportOffering &
	Readonly<{
		passportItem: PassportItemDocument
	}>

export type CheckoutItemPassportOffering = Readonly<{
	payload: string
	props: ComposedCheckoutOptions
}>

export type CheckoutFromPassportOffering = CheckoutItemPassportOffering[]

export const checkoutPassportItemForPayload = async (
	payload: Uint8Array | string,
	{
		config,
		client,
		currentTime,
	}: {
		config: ClubsConfiguration
		client?: Awaited<ReturnType<typeof getDefaultClient>>
		currentTime?: number
	},
) => {
	const _passportOfferings = (
		(config?.offerings as UndefinedOr<PassportOffering[]>) ??
		([] as PassportOffering[])
	)?.find(
		(offering) =>
			offering.managedBy === PLUGIN_ID &&
			bytes32Hex(payload) === bytes32Hex(offering.payload),
	)
	const redis = client
		? client.isOpen
			? client
			: await client.connect()
		: await getDefaultClient()

	const passportOfferingWithItemData = await whenDefined(
		_passportOfferings,
		(offering) =>
			getPassportItemFromPayload({
				sTokenPayload: bytes32Hex(offering.payload ?? '') ?? '',
				client: redis,
			})
				.then((item) =>
					item instanceof Error || !item
						? undefined
						: ({
								...offering,
								passportItem: item,
							} as PassportItemData),
				)
				.catch(undefined),
	)

	// eslint-disable-next-line functional/no-expression-statements, functional/no-conditional-statements
	if (isNil(client) && redis.isOpen) redis.quit()

	const paymentsDebugMode = Boolean(
		config.plugins
			.find((p) => p.id === 'devprotocol:clubs:plugin:clubs-payments')
			?.options?.find((o) => o.key === 'debug')?.value,
	)

	const acceptablePayments: Option['value'] = (
		config.plugins
			.find((p) => p.id === PLUGIN_ID)
			?.options?.find(
				(o) => o.key === 'acceptable-payments',
			) as UndefinedOr<Option>
	)?.value ?? [Payments.CreditCard, Payments.Crypto]

	const discounts = (config.plugins
		.find((p) => p.id === PLUGIN_ID)
		?.options.find(({ key }) => key === 'discounts')?.value ??
		[]) as PassportOptionsDiscounts
	const overrides = (config.plugins
		.find((p) => p.id === PLUGIN_ID)
		?.options.find(({ key }) => key === 'overrides')?.value ??
		[]) as PassportOptionsOverrides
	const now = currentTime ? currentTime : dayjs().utc().toDate().getTime()

	const returnObject = whenDefined(passportOfferingWithItemData, (offering) => {
		const stringifiedPayload = bytes32Hex(offering.payload)
		const priceTable = Prices[offering.passportItem.itemAssetType]
		const predefinedPrice =
			'usdc' in priceTable
				? priceTable
				: priceTable[toSize(offering.passportItem.appearance?.grid)]
		const discount = discounts.find(
			({ payload }) => bytes32Hex(payload) === stringifiedPayload,
		)
		const override = overrides.find(
			({ payload }) => bytes32Hex(payload) === stringifiedPayload,
		)
		const price = override ? override.price : predefinedPrice
		const notForSale = price === 'not-for-sale'
		const underDiscount =
			whenDefined(discount, (dis) => {
				return now >= dis.start_utc && now <= dis.end_utc
			}) ?? false
		const type = offering.passportItem.itemAssetType
		const video =
			type === 'short-video' ||
			type === 'short-video-link' ||
			type === 'video' ||
			type === 'video-link'
				? offering.passportItem.itemAssetValue
				: undefined
		const available = offering.availability
			? now >= offering.availability.start_utc &&
				(offering.availability.end_utc
					? now <= offering.availability.end_utc
					: true)
			: true
		const reason =
			override?.reason ?? (available ? Reason.Available : Reason.Unreleased)

		return {
			payload: stringifiedPayload,
			props: {
				offering,
				passportItem: offering.passportItem,
				notForSale,
				available,
				reason,
				fiat: notForSale
					? undefined
					: {
							price: {
								yen: price.yen,
							},
						},
				fiatCurrency: 'YEN',
				amount: offering.price,
				propertyAddress: config.propertyAddress,
				destination: config.propertyAddress,
				currency: offering.currency,
				rpcUrl: config.rpcUrl,
				payload: offering.payload,
				description: offering.description,
				itemImageSrc: video
					? undefined
					: (offering.previewImageSrc ?? offering.passportItem.itemAssetValue),
				itemVideoSrc: video,
				itemName: offering.name,
				feePercentage: offering.fee?.percentage,
				feeBeneficiary: offering.fee?.beneficiary,
				accessControlUrl: offering.accessControl?.url,
				accessControlDescription: offering.accessControl?.description,
				chainId: config.chainId,
				discount: underDiscount && discount ? discount : undefined,
				debugMode: paymentsDebugMode,
				acceptablePayments,
				base: config.url,
			} satisfies ComposedCheckoutOptions,
		} satisfies CheckoutItemPassportOffering
	})

	return returnObject
}

export const checkoutPassportItems = async (
	config: ClubsConfiguration,
	client?: Awaited<ReturnType<typeof getDefaultClient>>,
) => {
	const _passportOfferings = (
		config?.offerings ?? ([] as PassportOffering[])
	)?.filter((offering) => offering.managedBy === PLUGIN_ID)
	const redis = client
		? client.isOpen
			? client
			: await client.connect()
		: await getDefaultClient()

	const now = dayjs().utc().toDate().getTime()

	const returnObject = (await Promise.all(
		_passportOfferings.map((p) =>
			checkoutPassportItemForPayload(p.payload, {
				config,
				client: redis,
				currentTime: now,
			}),
		),
	)) as CheckoutFromPassportOffering

	// eslint-disable-next-line functional/no-expression-statements, functional/no-conditional-statements
	if (isNil(client) && redis.isOpen) redis.quit()

	return returnObject
}
