import { aperture } from 'ramda'

import headers from './headers'
import {
	getPassportItemForPayload,
	addPassportItemSetter,
	patchPassportItemValue,
} from './passportItem'

import {
	checkoutPassportItems,
	checkoutPassportItemForPayload,
} from './checkoutPassportItems'

export const PLUGIN_ID = 'devprotocol:clubs:plugin:passports'

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

export {
	headers,
	getPassportItemForPayload,
	addPassportItemSetter,
	patchPassportItemValue,
	checkoutPassportItems,
	checkoutPassportItemForPayload,
}

export default {
	headers,
	getPassportItemForPayload,
}
