import type {
	ClubsConfiguration,
	ClubsPluginOptions,
} from '@devprotocol/clubs-core'
import { bytes32Hex } from '@devprotocol/clubs-core'
import passportPlugin, { getPassportItemFromPayload } from '../index'
import type { PassportItemDocument } from '../index'
import {
	ComposedCheckoutOptions,
	PassportOffering,
	PassportOptionsDiscounts,
} from '../types'
import { prices } from '../constants/price'
import { whenDefined } from '@devprotocol/util-ts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

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
export const checkoutPassportItems = async (
	config: ClubsConfiguration,

	options: ClubsPluginOptions,
) => {
	const _passportOfferings = (
		config?.offerings ?? ([] as PassportOffering[])
	)?.filter((offering) => offering.managedBy === passportPlugin.meta.id)
	const passportOfferingWithItemData = await Promise.all(
		_passportOfferings?.map((offering) =>
			getPassportItemFromPayload({
				sTokenPayload: bytes32Hex(offering.payload ?? '') ?? '',
			})
				.then((item) =>
					item instanceof Error || !item
						? undefined
						: ({ ...offering, passportItem: item } as PassportItemData),
				)
				.catch(undefined),
		) ?? ([] as Array<PassportItemData | undefined>),
	)
		.then((items) => items.filter((items) => !!items))
		.then((items) => (items.length ? items : undefined))
		.catch(() => undefined)

	// {
	// 	payload: '...',
	// 	component: Checkout, // the composed Checkout vue component
	// 	props: {...}
	//   }

	const discounts = (options.find(({ key }) => key === 'discounts')?.value ??
		[]) as PassportOptionsDiscounts
	const now = dayjs().utc().toDate().getTime()

	const returnObject = (passportOfferingWithItemData?.map((offering) => {
		const price = prices[offering.passportItem.itemAssetType]
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
				passportItem: offering.passportItem,
				fiat: {
					price: {
						yen: price.yen,
					},
				},
				amount: offering.price,
				propertyAddress: config.propertyAddress,
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
			},
		}
	}) ?? []) as CheckoutFromPassportOffering

	return returnObject
}
