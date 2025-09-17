import { keccak256, toUtf8Bytes } from 'ethers'
import { encode } from '@devprotocol/clubs-core'
import { SchemaFieldTypes, type RediSearchSchema } from 'redis'

import type { PassportItemAssetType, PassportItemDocument } from '../types'

export const id = {
	'$.id': {
		type: SchemaFieldTypes.TAG,
		AS: 'id',
	},
} satisfies RediSearchSchema

export const sTokenId = {
	'$.sTokenId': {
		type: SchemaFieldTypes.TAG,
		AS: 'sTokenId',
	},
} satisfies RediSearchSchema

export const sTokenPayload = {
	'$.sTokenPayload': {
		type: SchemaFieldTypes.TAG,
		AS: 'sTokenPayload',
	},
} satisfies RediSearchSchema

export const clubsUrl = {
	'$.clubsUrl': {
		type: SchemaFieldTypes.TAG,
		AS: 'clubsUrl',
	},
} satisfies RediSearchSchema

export const itemAssetType = {
	'$.itemAssetType': {
		type: SchemaFieldTypes.TEXT,
		AS: 'itemAssetType',
	},
} satisfies RediSearchSchema

export const itemAssetValue = {
	'$.itemAssetValue': {
		type: SchemaFieldTypes.TEXT,
		AS: 'itemAssetValue',
	},
} satisfies RediSearchSchema

export const itemAssetValueAudio = {
	'$.itemAssetValue:audio': {
		type: SchemaFieldTypes.TEXT,
		AS: 'itemAssetValueAudio',
	},
} satisfies RediSearchSchema

export const itemAssetValueVideo = {
	'$.itemAssetValue:video': {
		type: SchemaFieldTypes.TEXT,
		AS: 'itemAssetValueVideo',
	},
} satisfies RediSearchSchema

export const itemAssetValueI18NLocale = {
	'$.itemAssetValue:i18n[*].locale': {
		type: SchemaFieldTypes.TAG,
		AS: 'itemAssetValueI18NLocale',
	},
} satisfies RediSearchSchema

export const itemAssetValueI18NValue = {
	'$.itemAssetValue:i18n[*].value': {
		type: SchemaFieldTypes.TEXT,
		AS: 'itemAssetValueI18NValue',
	},
} satisfies RediSearchSchema

export const itemAssetValueAudioI18NLocale = {
	'$.itemAssetValue:audio:i18n[*].locale': {
		type: SchemaFieldTypes.TAG,
		AS: 'itemAssetValueAudioI18NLocale',
	},
} satisfies RediSearchSchema

export const itemAssetValueAudioI18NValue = {
	'$.itemAssetValue:audio:i18n[*].value': {
		type: SchemaFieldTypes.TEXT,
		AS: 'itemAssetValueAudioI18NValue',
	},
} satisfies RediSearchSchema

export const itemAssetValueVideoI18NLocale = {
	'$.itemAssetValue:video:i18n[*].locale': {
		type: SchemaFieldTypes.TAG,
		AS: 'itemAssetValueVideoI18NLocale',
	},
} satisfies RediSearchSchema

export const itemAssetValueVideoI18NValue = {
	'$.itemAssetValue:video:i18n[*].value': {
		type: SchemaFieldTypes.TEXT,
		AS: 'itemAssetValueVideoI18NValue',
	},
} satisfies RediSearchSchema

export const appearanceGridWidth = {
	'$.appearance.grid.w': {
		type: SchemaFieldTypes.NUMERIC,
		AS: 'appearanceGridWidth',
	},
} satisfies RediSearchSchema

export const appearanceGridHeight = {
	'$.appearance.grid.h': {
		type: SchemaFieldTypes.NUMERIC,
		AS: 'appearanceGridHeight',
	},
} satisfies RediSearchSchema

export const passportItemDocument = (doc: {
	readonly id: string | bigint | number
	readonly sTokenId?: string | bigint | number
	readonly sTokenPayload: string
	readonly clubsUrl: string
	readonly itemAssetType: PassportItemAssetType
	readonly itemAssetValue: string
	readonly 'itemAssetValue:audio'?: string
	readonly 'itemAssetValue:video'?: string
	readonly 'itemAssetValue:i18n'?: ReadonlyArray<{
		locale: string
		value: string
	}>
	readonly 'itemAssetValue:audio:i18n'?: ReadonlyArray<{
		locale: string
		value: string
	}>
	readonly 'itemAssetValue:video:i18n'?: ReadonlyArray<{
		locale: string
		value: string
	}>
	readonly appearance?: {
		grid?: {
			w: 1 | 2 | 3
			h: 1 | 2 | 3
		}
	}
}): PassportItemDocument => ({
	id: doc.id.toString(),
	sTokenId: doc.sTokenId?.toString() ?? undefined,
	sTokenPayload: doc.sTokenPayload,
	clubsUrl: doc.clubsUrl,
	itemAssetType: doc.itemAssetType,
	itemAssetValue: doc.itemAssetValue,
	'itemAssetValue:audio': doc['itemAssetValue:audio'],
	'itemAssetValue:video': doc['itemAssetValue:video'],
	'itemAssetValue:i18n': doc['itemAssetValue:i18n'],
	'itemAssetValue:audio:i18n': doc['itemAssetValue:audio:i18n'],
	'itemAssetValue:video:i18n': doc['itemAssetValue:video:i18n'],
	appearance: doc.appearance,
})

export const PASSPORTITEM_SCHEMA = {
	...id,
	...sTokenId,
	...sTokenPayload,
	...clubsUrl,
	...itemAssetType,
	...itemAssetValue,
	...itemAssetValueAudio,
	...itemAssetValueVideo,
	...itemAssetValueI18NLocale,
	...itemAssetValueI18NValue,
	...itemAssetValueAudioI18NLocale,
	...itemAssetValueAudioI18NValue,
	...itemAssetValueVideoI18NLocale,
	...itemAssetValueVideoI18NValue,
	...appearanceGridWidth,
	...appearanceGridHeight,
}

export const PASSPORTITEM_SCHEMA_ID = keccak256(
	toUtf8Bytes(encode(PASSPORTITEM_SCHEMA)),
)
