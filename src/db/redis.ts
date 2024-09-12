import { createClient } from 'redis'

export enum Index {
	PassportItem = 'idx::clubs:passportitem',
}

export enum Prefix {
	PassportItem = 'doc::clubs:passportitem',
}

export enum SchemaKey {
	PassportItem = 'scm::clubs:passportitem',
}

export const generatePassportItemKey = (sTokenPayload: string) =>
	`${Prefix.PassportItem}::${sTokenPayload}`

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
	return redis.isOpen ? await redis.connect() : redis
}
