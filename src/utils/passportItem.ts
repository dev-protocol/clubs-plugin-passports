import { whenNotError, whenNotErrorAll } from '@devprotocol/util-ts'
import { always } from 'ramda'
import { createClient } from 'redis'
import { nanoid } from 'nanoid'

import {
	CreatePassportItemReq,
	Index,
	PassportItemDocument,
	PatchPassportItemValueReq,
} from '../types'
import {
	passportItemDocument,
	sTokenPayload as sTokenPayloadSchema,
} from '../db/schema'
import { generatePassportItemKey, getDefaultClient } from '../db/redis'

const { REDIS_URL, REDIS_USERNAME, REDIS_PASSWORD } = import.meta.env

export const addPassportItemSetter = async ({
	client,
	data,
	url,
}: {
	client: Awaited<ReturnType<typeof getDefaultClient>>
	data: CreatePassportItemReq
	url: string
}) => {
	// 1. Create passport skin document.
	const passportSkinDoc = passportItemDocument({
		id: nanoid(),
		clubsUrl: url,
		...data.passportItem,
	})

	const passportSkinCreationStatus = await whenNotErrorAll(
		[passportSkinDoc, client],
		([info, redis]) =>
			redis.json
				.set(generatePassportItemKey(info.sTokenPayload), '$', info)
				.catch((err: Error) => err),
	)

	return passportSkinCreationStatus
}

export const patchPassportItemValue = async ({
	client,
	data,
}: {
	client: Awaited<ReturnType<typeof getDefaultClient>>
	data: PatchPassportItemValueReq
}) => {
	const source = await client.json
		.get(generatePassportItemKey(data.sTokenPayload))
		.catch((err: Error) => err)

	const passportItemDoc = whenNotErrorAll([source, data], ([origin, info]) =>
		passportItemDocument({
			...(origin as PassportItemDocument),
			itemAssetValue: info.passportItemValue,
		}),
	)

	const status = await whenNotErrorAll(
		[passportItemDoc, client],
		([info, redis]) =>
			redis.json
				.set(generatePassportItemKey(info.sTokenPayload), '$', info)
				.catch((err: Error) => err),
	)

	return status
}

export const getPassportItemForPayload = async (props: {
	sTokenPayload: string
	client?: Awaited<ReturnType<typeof getDefaultClient>>
}) => {
	const redis = props.client
		? props.client
		: await whenNotError(
				createClient({
					url: REDIS_URL,
					username: REDIS_USERNAME ?? '',
					password: REDIS_PASSWORD ?? '',
				}),
				(db) =>
					db
						.connect()
						.then(always(db))
						.catch((err) => new Error(err)),
			)

	const passportItem = await whenNotErrorAll(
		[props, redis],
		([{ sTokenPayload }, client]) =>
			client.ft
				.search(
					Index.PassportItem,
					`@${sTokenPayloadSchema['$.sTokenPayload'].AS}:{${sTokenPayload}}`,
					{
						LIMIT: {
							from: 0,
							size: 1,
						},
					},
				)
				.then((res) =>
					res.total && res.documents.length
						? (res.documents[0].value as PassportItemDocument)
						: undefined,
				)
				.catch((err) => new Error(err)),
	)

	const result = await whenNotErrorAll(
		[passportItem, redis],
		([res, client]) => {
			return props.client === undefined
				? client
						.quit()
						.then(always(res))
						.catch((err) => new Error(err))
				: res
		},
	)

	return result
}
