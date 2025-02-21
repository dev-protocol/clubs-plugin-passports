import type {
	ClubsPluginMeta,
	ClubsFunctionPlugin,
	ClubsFunctionGetApiPaths,
	ClubsFunctionGetAdminPaths,
	ClubsFunctionGetPagePaths,
} from '@devprotocol/clubs-core'
import { ClubsPluginCategory, SinglePath } from '@devprotocol/clubs-core'

import Readme from './readme.astro'
import { sTokenPayload } from './db/schema'
import { generatePassportItemKey } from './db/redis'
import addPassportItem from './handlers/addPassportItem'
import getPassportItemForPayload from './handlers/getPassportItemForPayload'
import {
	addPassportItemSetter,
	patchPassportItemValue,
	getPassportItemForPayload as getPassportItemFromPayload,
	PLUGIN_ID,
	checkoutPassportItems,
	checkoutPassportItemForPayload,
} from './utils'

import {
	ComposedCheckoutOptions,
	Index,
	Prefix,
	SchemaKey,
	type CreatePassportItemReq,
	type PassportItemAssetType,
	type PassportItemDocument,
	type PatchPassportItemValueReq,
	type MediaProps,
} from './types'
import type {
	PassportItemData,
	CheckoutFromPassportOffering,
} from './utils/checkoutPassportItems'

import { Prices } from './constants/price'

export const getPagePaths = (async () => {
	return []
}) satisfies ClubsFunctionGetPagePaths

export const getApiPaths = (async (_options, config) => {
	return [
		{
			paths: ['passport', 'payload', SinglePath],
			method: 'GET',
			handler: getPassportItemForPayload(),
		},
		{
			paths: ['passport', 'add'],
			method: 'POST',
			handler: addPassportItem(config),
		},
	]
}) satisfies ClubsFunctionGetApiPaths

export const getAdminPaths = (async () => {
	return []
}) satisfies ClubsFunctionGetAdminPaths

export const meta = {
	readme: Readme,
	displayName: 'Passports',
	id: PLUGIN_ID,
	category: ClubsPluginCategory.Uncategorized,
} satisfies ClubsPluginMeta

export {
	Index,
	Prefix,
	SchemaKey,
	PLUGIN_ID,
	checkoutPassportItems,
	checkoutPassportItemForPayload,
	type CreatePassportItemReq,
	sTokenPayload,
	type PassportItemAssetType,
	type PassportItemDocument,
	generatePassportItemKey,
	getPassportItemFromPayload,
	addPassportItemSetter,
	patchPassportItemValue,
	Prices,
	type CheckoutFromPassportOffering,
	type ComposedCheckoutOptions,
	type PassportItemData,
	type PatchPassportItemValueReq,
	type MediaProps,
}

export default {
	meta,
	getApiPaths,
	getPagePaths,
	getAdminPaths,
} satisfies ClubsFunctionPlugin
