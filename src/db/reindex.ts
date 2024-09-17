/* eslint-disable functional/no-expression-statements */
import type { AsyncReturnType } from 'type-fest'
import {
	isNotError,
	whenDefined,
	whenNotError,
	whenNotErrorAll,
} from '@devprotocol/util-ts'

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
					.then((res) => res)
					.catch((err: Error) => err),
			) ?? new Error(ERROR.$500.DBERROR),
	)

	const shouldIndex = whenNotError(PassportItemScm, (schemaId) =>
		schemaId === PASSPORTITEM_SCHEMA_ID ? false : true,
	)

	console.log({ PassportItemScm, shouldIndex })

	const droppedIndex = await whenNotErrorAll(
		[shouldIndex, client, PassportItemScm],
		([_shouldIndex, _client, _isSchemaPresentEvenifOutdated]) => {
			return _shouldIndex && _isSchemaPresentEvenifOutdated
				? _client.ft
						.dropIndex(Index.PassportItem)
						.then(() => {
							console.log(`### Dropped old index: ${Index.PassportItem}`)
							return true
						})
						.catch((err: Error) => {
							console.log(
								`### Error dropping old index: ${Index.PassportItem}`,
								err,
							)
							return err
						})
				: _shouldIndex && !_isSchemaPresentEvenifOutdated
					? true
					: false
		},
	)

	const createdUpdatedIndex = await whenNotErrorAll(
		[droppedIndex, client],
		([_droppedIndex, _client]) => {
			return _droppedIndex
				? _client.ft
						.create(Index.PassportItem, PASSPORTITEM_SCHEMA, {
							ON: 'JSON',
							PREFIX: Prefix.PassportItem,
						})
						.then(() => {
							console.log(`### Created new index: ${Index.PassportItem}`)
							return true
						})
						.catch((err: Error) => {
							console.log(
								`!!! Error creating new index: ${Index.PassportItem}`,
								err,
							)
							return err
						})
				: false
		},
	)

	const setNewSchemaKey = await whenNotErrorAll(
		[createdUpdatedIndex, client],
		([_createdUpdatedIndex, _client]) => {
			return _createdUpdatedIndex
				? _client
						.set(SchemaKey.PassportItem, PASSPORTITEM_SCHEMA_ID)
						.then(() => {
							console.log(`### Set new schema key: ${SchemaKey.PassportItem}`)
							return true
						})
						.catch((err: Error) => {
							console.log(
								`!!! Error setting new schema key: ${SchemaKey.PassportItem}`,
								err,
							)
							return err
						})
				: false
		},
	)

	// If default client is not present then
	// we are connecting and using client in reindex() function.
	// hence we close it since it was initialized and connected in the function itself.
	await whenDefined(
		defaultClient,
		async (defaultClient) => !defaultClient && (await client.quit()),
	)

	return setNewSchemaKey
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
): Promise<AsyncReturnType<T> | Error> => {
	const client = (await getClient()) as AsyncReturnType<T>
	const reIndexed = await reindex(client)
	return isNotError(reIndexed) ? client : reIndexed
}

export default reindex
