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
import { getPassportItemForPayload as getPassportItemFromPayload } from './utils'

import {
	Index,
	Prefix,
	SchemaKey,
	type CreatePassportItemReq,
	type PassportItemAssetType,
	type PassportItemDocument,
} from './types'

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
	id: 'devprotocol:clubs:plugin:passport',
	category: ClubsPluginCategory.Uncategorized,
} satisfies ClubsPluginMeta

export {
	Index,
	Prefix,
	SchemaKey,
	type CreatePassportItemReq,
	sTokenPayload,
	type PassportItemAssetType,
	type PassportItemDocument,
	generatePassportItemKey,
	getPassportItemFromPayload,
}

export default {
	meta,
	getApiPaths,
	getPagePaths,
	getAdminPaths,
} satisfies ClubsFunctionPlugin
