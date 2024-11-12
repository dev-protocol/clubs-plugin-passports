import ComponentCheckout from '../components/Checkout/ComposedCheckout.vue'
import type {
	ClubsConfiguration,
	ClubsOffering,
	ClubsPluginOptions,
	Membership,
} from '@devprotocol/clubs-core'
import { bytes32Hex } from '@devprotocol/clubs-core'
import passportPlugin, { getPassportItemFromPayload } from '../index'
import type { PassportItemDocument } from '../index'
import { ComposedCheckoutOptions } from '../types'
export type PassportItemData = ClubsOffering<Membership> &
	Readonly<{
		passportItem: PassportItemDocument
	}>

export type CheckoutFromPassportOffering = Readonly<
	{
		payload: string
		component: typeof ComponentCheckout
		props: ComposedCheckoutOptions
	}[]
>
export const checkoutPassportItems = async (
	config: ClubsConfiguration,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	options: ClubsPluginOptions,
) => {
	const _passportOfferings = (
		config?.offerings ?? ([] as ClubsOffering<Membership>[])
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

	const returnObject = (passportOfferingWithItemData?.map((offering) => ({
		payload: offering.payload,
		component: ComponentCheckout,
		props: {
			passportItem: offering.passportItem,
			fiat: {
				price: {
					yen: 1,
				},
			},
			amount: offering.price,
			propertyAddress: config.propertyAddress,
			currency: offering.currency,
			rpcUrl: config.rpcUrl,
			payload: offering.payload,
			description: offering.description,
			itemImageSrc: offering.imageSrc,
			itemName: offering.name,
			feePercentage: offering.fee?.percentage,
			feeBeneficiary: offering.fee?.beneficiary,
			accessControlUrl: offering.accessControl?.url,
			accessControlDescription: offering.accessControl?.description,
			chainId: config.chainId,
		},
	})) ?? []) as CheckoutFromPassportOffering

	return returnObject
}
