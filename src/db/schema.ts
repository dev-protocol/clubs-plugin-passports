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
	appearance: doc.appearance,
})

export const PASSPORTITEM_SCHEMA = {
	...id,
	...sTokenId,
	...sTokenPayload,
	...clubsUrl,
	...itemAssetType,
	...itemAssetValue,
	...appearanceGridWidth,
	...appearanceGridHeight,
}

export const PASSPORTITEM_SCHEMA_ID = keccak256(
	toUtf8Bytes(encode(PASSPORTITEM_SCHEMA)),
)
