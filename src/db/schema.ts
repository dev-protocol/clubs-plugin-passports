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

export const appearanceGridW = {
	'$.appearance.grid.w': {
		type: SchemaFieldTypes.NUMERIC,
		AS: 'appearanceGridW',
	},
} satisfies RediSearchSchema

export const appearanceGridH = {
	'$.appearance.grid.h': {
		type: SchemaFieldTypes.NUMERIC,
		AS: 'appearanceGridH',
	},
} satisfies RediSearchSchema

export const passportItemDocument = (doc: {
	id: string | bigint | number
	sTokenId?: string | bigint | number
	sTokenPayload: string
	clubsUrl: string
	itemAssetType: PassportItemAssetType
	itemAssetValue: string
	appearance?: {
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
	appearance: doc.appearance,
})

export const PASSPORTITEM_SCHEMA = {
	...id,
	...sTokenId,
	...sTokenPayload,
	...clubsUrl,
	...itemAssetType,
	...itemAssetValue,
	...appearanceGridW,
	...appearanceGridH,
}

export const PASSPORTITEM_SCHEMA_ID = keccak256(
	toUtf8Bytes(encode(PASSPORTITEM_SCHEMA)),
)
