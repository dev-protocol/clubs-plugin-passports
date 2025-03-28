import { getDefaultProvider } from 'ethers'
import {
	authenticate,
	type ClubsConfiguration,
	encode,
} from '@devprotocol/clubs-core'
import {
	isNotError,
	whenDefinedAll,
	whenNotError,
	whenNotErrorAll,
} from '@devprotocol/util-ts'

import { getDefaultClient } from '../db/redis'
import { withCheckingIndex } from '../db/reindex'
import { addPassportItemSetter } from '../utils/passportItem'
import { ERROR, type CreatePassportItemReq } from '../types'

export const handler =
	(conf: ClubsConfiguration) =>
	async ({ request }: { request: Request }) => {
		// 1. Get the data.
		const reqBody = await whenNotErrorAll(
			[request, conf],
			([r]) =>
				whenDefinedAll([r, conf], ([_r]) =>
					_r
						.json()
						.then((res) => res as CreatePassportItemReq)
						.catch((err: Error) => err),
				) ?? new Error(ERROR.$400.INVALIDREQ),
		)

		const props = whenNotError(
			reqBody,
			(_r) =>
				whenDefinedAll(
					[_r.site, _r.message, _r.signature, _r.passportItem],
					([site, message, signature, passportItem]) => ({
						site,
						message,
						signature,
						passportItem,
					}),
				) ?? new Error(ERROR.$400.MISSINGDATA),
		)

		// 2. Get client and validate client.
		const client = await whenNotError(props, () =>
			withCheckingIndex(getDefaultClient).catch((err: Error) => err),
		)

		// 3. Authenticate for only admin's allowed to add achievements.
		const config = encode(conf)
		const authenticationRes = await whenNotErrorAll(
			[props, conf, config, client],
			([{ message, signature }, _conf, previousConfiguration]) =>
				authenticate({
					message,
					signature,
					previousConfiguration,
					provider: getDefaultProvider(_conf.rpcUrl),
				}).catch((err: Error) => err),
		)
		const authenticated = whenNotError(authenticationRes, (r) =>
			r ? true : new Error(ERROR.$401.INVALIDACCESS),
		)

		const setterRes = await whenNotErrorAll(
			[authenticated, client, props, conf],
			([set, redis, data, conf]) => {
				return !set
					? new Error(ERROR.$500.DBERROR)
					: addPassportItemSetter({ client: redis, data, url: conf.url })
			},
		)

		// eslint-disable-next-line functional/no-expression-statements
		await whenNotError(client, (redis) => redis.quit())

		return new Response(
			isNotError(setterRes)
				? JSON.stringify({ created: true })
				: JSON.stringify({ created: false, error: setterRes.message }),
			{
				status: isNotError(setterRes)
					? 200
					: Object.values(ERROR.$400).some((x) => x === setterRes.message)
						? 400
						: Object.values(ERROR.$401).some((x) => x === setterRes.message)
							? 401
							: 500,
			},
		)
	}

export default handler
