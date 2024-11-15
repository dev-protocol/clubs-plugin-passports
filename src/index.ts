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
	getPassportItemForPayload as getPassportItemFromPayload,
	PLUGIN_ID,
	checkoutPassportItems,
} from './utils'

import {
	Index,
	Prefix,
	SchemaKey,
	type CreatePassportItemReq,
	type PassportItemAssetType,
	type PassportItemDocument,
} from './types'

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
	displayName: 'Passport',
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
	sTokenPayload,
	type PassportItemAssetType,
	type PassportItemDocument,
	generatePassportItemKey,
	getPassportItemFromPayload,
	addPassportItemSetter,
	Prices,
}

export default {
	meta,
	getApiPaths,
	getPagePaths,
	getAdminPaths,
} satisfies ClubsFunctionPlugin
