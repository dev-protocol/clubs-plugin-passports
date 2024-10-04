import { whenDefined, whenNotError } from '@devprotocol/util-ts'

import {
	headers,
	getPassportItemForPayload,
	getPayloadFromURL,
} from '../utils/index'

export const handler =
	() =>
	async ({ request }: { request: Request }) => {
		const props =
			whenDefined(request.url, (url) => ({
				sTokenPayload: getPayloadFromURL(new URL(url)),
			})) ?? new Error('sTokenPayload is required')

		const result = await whenNotError(props, (params) =>
			getPassportItemForPayload(params)
				.then((item) => item)
				.catch((err) => new Error(err)),
		)

		return result instanceof Error
			? new Response(
					JSON.stringify({ content: null, message: result.message }),
					{
						status: 400,
						headers,
					},
				)
			: new Response(JSON.stringify({ content: result, message: 'success' }), {
					status: 200,
					headers,
				})
	}

export default handler
