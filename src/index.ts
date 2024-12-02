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
	addPassportItemSrcSetter,
	addPassportItemSetter,
	getPassportItemForPayload as getPassportItemFromPayload,
	PLUGIN_ID,
	checkoutPassportItems,
} from './utils'

import {
	ComposedCheckoutOptions,
	CreatePassportItemSrcReq,
	Index,
	Prefix,
	SchemaKey,
	type CreatePassportItemReq,
	type PassportItemAssetType,
	type PassportItemDocument,
	type PassportItemSrcDocument,
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
	type CreatePassportItemReq,
	type CreatePassportItemSrcReq,
	sTokenPayload,
	type PassportItemAssetType,
	type PassportItemDocument,
	type PassportItemSrcDocument,
	generatePassportItemKey,
	getPassportItemFromPayload,
	addPassportItemSetter,
	addPassportItemSrcSetter,
	Prices,
	type CheckoutFromPassportOffering,
	type ComposedCheckoutOptions,
	type PassportItemData,
}

export default {
	meta,
	getApiPaths,
	getPagePaths,
	getAdminPaths,
} satisfies ClubsFunctionPlugin
