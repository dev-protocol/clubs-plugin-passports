import type { ReadonlyDeep } from 'type-fest'

import type { getDefaultClient } from './db/redis'
import { CheckoutOptions } from '@devprotocol/clubs-core/ui/components'
import { Override } from '@devprotocol/clubs-plugin-payments'

export enum Index {
	PassportItem = 'idx::clubs:passportitem',
}

export enum Prefix {
	PassportItem = 'doc::clubs:passportitem',
}

export enum SchemaKey {
	PassportItem = 'scm::clubs:passportitem',
}

export type Option =
	| Readonly<{ key: 'slug'; value?: string }>
	| Readonly<{ key: 'rpc'; value?: string }>
	| Readonly<{ key: 'maxpage'; value?: number }>

export type TokenURIWithId = Readonly<{
	id: number
	image: string
}>

export type DefaultClient = Readonly<ReturnType<typeof getDefaultClient>>
export type AwaitedDefaultClient = ReadonlyDeep<Awaited<DefaultClient>>

export const ERROR = {
	$400: {
		DBNOTFOUND: 'DB not found.',
		MISSINGDATA: 'Missing data.',
		INVALIDREQ: 'Invalid request.',
		CLUBSNOTFOUND: 'Clubs not found.',
	},
	$401: {
		INVALIDACCESS: 'Invalid access.',
	},
	$500: {
		DBERROR: 'Passport item db error',
	},
}

export type PassportItemAssetType =
	| 'css'
	| 'stylesheet-link'
	| 'short-video'
	| 'short-video-link'
	| 'image'
	| 'image-link'
	| 'video'
	| 'video-link'
	| 'bgm'
	| 'bgm-link'

export type PassportItemDocument = Readonly<{
	id: string
	sTokenId?: string
	sTokenPayload: string
	clubsUrl: string
	itemAssetType: PassportItemAssetType
	itemAssetValue: string
}>

export type CreatePassportItemReq = ReadonlyDeep<{
	site: string
	message: string
	signature: string
	passportItem: Omit<PassportItemDocument, 'id' | 'clubsUrl'>
}>

// eslint-disable-next-line functional/type-declaration-immutability
export type ComposedCheckoutOptions = CheckoutOptions &
	Readonly<{
		passportItem: PassportItemDocument
		override: Override
	}>
