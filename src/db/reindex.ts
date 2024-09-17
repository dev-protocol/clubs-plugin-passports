/* eslint-disable functional/no-expression-statements */
import type { AsyncReturnType } from 'type-fest'
import { whenDefined, whenNotError } from '@devprotocol/util-ts'

import { getDefaultClient } from '../db/redis'
import { ERROR, Index, Prefix, SchemaKey } from '../types'
import { PASSPORTITEM_SCHEMA, PASSPORTITEM_SCHEMA_ID } from '../db/schema'

export const reindex = async (
	defaultClient?: AsyncReturnType<typeof getDefaultClient>,
) => {
	const client = defaultClient ? defaultClient : await getDefaultClient()

	const PassportItemScm = await whenNotError(
		client,
		(c) =>
			whenDefined(c, (_c) =>
				_c
					.get(SchemaKey.PassportItem)
					.then((res) => (res ? res : new Error(ERROR.$500.DBERROR)))
					.catch((err: Error) => err),
			) ?? new Error(ERROR.$500.DBERROR),
	)

	const index = whenNotError(PassportItemScm, (schemaId) =>
		schemaId === PASSPORTITEM_SCHEMA_ID ? true : new Error(ERROR.$500.DBERROR),
	)

	console.log({ PassportItemScm, index })

	await whenNotError(index, () =>
		Promise.all([
			PassportItemScm === PASSPORTITEM_SCHEMA_ID
				? Promise.resolve()
				: client.ft
						.dropIndex(Index.PassportItem)
						.catch(() => null)
						.then(() =>
							client.ft
								.create(Index.PassportItem, PASSPORTITEM_SCHEMA, {
									ON: 'JSON',
									PREFIX: Prefix.PassportItem,
								})
								.then(() =>
									client.set(SchemaKey.PassportItem, PASSPORTITEM_SCHEMA_ID),
								)
								.then(() => {
									console.log('###')
									return null
								}),
						)
						.then(() =>
							Promise.all([
								client.set(SchemaKey.PassportItem, PASSPORTITEM_SCHEMA_ID),
							]),
						),
		]),
	)

	// If default client is not present then
	// we are connecting and using client in reindex() function.
	// hence we close it since it was initialized and connected in the function itself.
	await whenDefined(
		defaultClient,
		async (defaultClient) => !defaultClient && (await client.quit()),
	)

	return index ? true : false
}

/**
 * Returns a redis client from the given async function with checking the current schema is indexed.
 * @param getClient - a function that returns redis client
 * @returns the redis client
 */
export const withCheckingIndex = async <
	T extends typeof getDefaultClient = typeof getDefaultClient,
>(
	getClient: T,
): Promise<AsyncReturnType<T>> => {
	const client = (await getClient()) as AsyncReturnType<T>
	await reindex(client).catch(() => {
		console.log('Error while reindexing')
		return null
	})
	return client
}

export default reindex
