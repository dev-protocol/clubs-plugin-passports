import {
	isNotError,
	UndefinedOr,
	whenDefinedAll,
	whenNotError,
	whenNotErrorAll,
} from '@devprotocol/util-ts'
import { always } from 'ramda'
import { createClient } from 'redis'
import { nanoid } from 'nanoid'

import {
	AwaitedDefaultClient,
	CreatePassportItemReq,
	Index,
	PassportItemDocument,
	PassportOffering,
	PatchPassportItemValueReq,
} from '../types'
import {
	passportItemDocument,
	sTokenPayload as sTokenPayloadSchema,
} from '../db/schema'
import { generatePassportItemKey, getDefaultClient } from '../db/redis'
import { bytes32Hex, type ClubsOffering } from '@devprotocol/clubs-core'
import { PLUGIN_ID } from '../utils'

const { REDIS_URL, REDIS_USERNAME, REDIS_PASSWORD } = import.meta.env

export const addPassportItemSetter = async ({
	client,
	data,
	url,
}: {
	client: AwaitedDefaultClient
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
	client: AwaitedDefaultClient
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
	offerings?: ClubsOffering[]
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

	const offering: UndefinedOr<PassportOffering> = whenDefinedAll(
		[props.offerings, isNotError(passportItem) ? passportItem : undefined],
		([offerings, item]) =>
			offerings.find(
				(offering) =>
					offering.managedBy === PLUGIN_ID &&
					bytes32Hex(offering.payload) === bytes32Hex(item.sTokenPayload),
			) as UndefinedOr<PassportOffering>,
	)

	const data = whenNotError(passportItem, (item) => ({ ...item, offering }))

	const result = await whenNotErrorAll([data, redis], ([res, client]) => {
		return props.client === undefined
			? client
					.quit()
					.then(always(res))
					.catch((err) => new Error(err))
			: res
	})

	return result
}
