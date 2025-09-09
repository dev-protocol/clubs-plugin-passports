import { aperture } from 'ramda'

/**
 * Returns sToken payload from the url
 * @param payload - the url of the request
 * @parma prepath- the path after which we want the payload.
 * @returns string
 */
export const getPayloadFromURL = (url: URL, prepath: string = 'payload') => {
	const [, payload] =
		aperture(2, url.pathname.split('/')).find(
			([p]: string[]) => p === prepath,
		) ?? []
	return payload ?? ''
}
