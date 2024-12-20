import type { ClubsConfiguration } from '@devprotocol/clubs-core'
import { bytes32Hex } from '@devprotocol/clubs-core'
import { PLUGIN_ID } from './index'
import { getPassportItemForPayload as getPassportItemFromPayload } from './passportItem'
import type { PassportItemDocument } from '../types'
import type {
	ComposedCheckoutOptions,
	PassportOffering,
	PassportOptionsDiscounts,
} from '../types'
import { Prices } from '../constants/price'
import { whenDefined } from '@devprotocol/util-ts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getDefaultClient } from '../db/redis'
import { isNil } from 'ramda'

// eslint-disable-next-line functional/no-expression-statements
dayjs.extend(utc)

export type PassportItemData = PassportOffering &
	Readonly<{
		passportItem: PassportItemDocument
	}>

export type CheckoutFromPassportOffering = Readonly<
	{
		payload: string
		props: ComposedCheckoutOptions
	}[]
>

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
		config?.offerings ?? ([] as PassportOffering[])
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

	const discounts = (config.plugins
		.find((p) => p.id === PLUGIN_ID)
		?.options.find(({ key }) => key === 'discounts')?.value ??
		[]) as PassportOptionsDiscounts
	const now = currentTime ? currentTime : dayjs().utc().toDate().getTime()

	const returnObject = whenDefined(passportOfferingWithItemData, (offering) => {
		const price = Prices[offering.passportItem.itemAssetType]
		const discount = discounts.find(
			({ payload }) => bytes32Hex(payload) === bytes32Hex(offering.payload),
		)
		const underDiscount =
			whenDefined(discount, (dis) => {
				return now >= dis.start_utc && now <= dis.end_utc
			}) ?? false

		return {
			payload: offering.payload,
			props: {
				offering,
				passportItem: offering.passportItem,
				fiat: {
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
				itemImageSrc: offering.previewImageSrc ?? offering.imageSrc,
				itemName: offering.name,
				feePercentage: offering.fee?.percentage,
				feeBeneficiary: offering.fee?.beneficiary,
				accessControlUrl: offering.accessControl?.url,
				accessControlDescription: offering.accessControl?.description,
				chainId: config.chainId,
				discount: underDiscount && discount ? discount : undefined,
				debugMode: paymentsDebugMode,
			} satisfies ComposedCheckoutOptions,
		}
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
