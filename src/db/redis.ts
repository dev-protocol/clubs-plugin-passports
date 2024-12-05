import { createClient } from 'redis'

import { Prefix } from '../types'

export const generatePassportItemKey = (sTokenPayload: string) =>
	`${Prefix.PassportItem}::${sTokenPayload}`

export const generatePassportItemSrcKey = (sTokenPayload: string) =>
	`${Prefix.PassportItemSrc}::${sTokenPayload}`

export const defaultClient = () =>
	createClient({
		url: import.meta.env.REDIS_URL,
		username: import.meta.env.REDIS_USERNAME ?? '',
		password: import.meta.env.REDIS_PASSWORD ?? '',
		socket: {
			keepAlive: 1,
			reconnectStrategy: 1,
		},
	})

export const getDefaultClient = async () => {
	const redis = defaultClient()
	return !redis.isOpen ? await redis.connect() : redis
}
