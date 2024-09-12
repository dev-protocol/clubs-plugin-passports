export type Option =
	| Readonly<{ key: 'slug'; value?: string }>
	| Readonly<{ key: 'rpc'; value?: string }>
	| Readonly<{ key: 'maxpage'; value?: number }>

export type TokenURIWithId = Readonly<{
	id: number
	image: string
}>

export const ERROR = {
	$400: {
		DBNOTFOUND: 'DB not found.',
		MISSINGDATA: 'Missing data.',
		INVALIDREQ: 'Invalid request.',
		CLUBSNOTFOUND: 'Clubs not found.',
	},
	$401: {
		INVALIDACCESS: 'Invalid access.',
	},
	$500: {
		DBERROR: 'Passport item db error',
	},
}
