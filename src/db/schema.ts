import { keccak256, toUtf8Bytes } from 'ethers'
import { encode } from '@devprotocol/clubs-core'
import { SchemaFieldTypes, type RediSearchSchema } from 'redis'

export const id = {
  '$.id': {
    type: SchemaFieldTypes.TAG,
    AS: 'id',
  },
} satisfies RediSearchSchema

export const itemId = {
  '$.itemId': {
    type: SchemaFieldTypes.TAG,
    AS: 'itemId',
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

export type PassportItemAssetType = 'css' | 'stylesheet-link' | 'image' | 'image-link' | 'video' | 'video-link' | 'bgm' | 'bgm-link'

export type PassportItemDocument = Readonly<{
  id: string
  itemId: string
  sTokenPayload: string
  clubsUrl: string
  itemAssetType: PassportItemAssetType
  itemAssetValue: string
}>

export const passportItemDocument = (doc: {
  id: string | bigint | number
  itemId: string | bigint | number
  sTokenPayload: string
  clubsUrl: string
  itemAssetType: PassportItemAssetType
  itemAssetValue: string
}): PassportItemDocument => ({
  id: doc.id.toString(),
  itemId: doc.itemId.toString(),
  sTokenPayload: doc.sTokenPayload,
  clubsUrl: doc.clubsUrl,
  itemAssetType: doc.itemAssetType,
  itemAssetValue: doc.itemAssetValue,
})

export const PASSPORTITEM_SCHEMA = {
  ...id,
  ...itemId,
  ...sTokenPayload,
  ...clubsUrl,
  ...itemAssetType,
  ...itemAssetValue
}

export const PASSPORTITEM_SCHEMA_ID = keccak256(
  toUtf8Bytes(encode(PASSPORTITEM_SCHEMA)),
)
