import { aperture } from 'ramda'

import headers from './headers'
import {
	getPassportItemForPayload,
	addPassportItemSetter,
	patchPassportItemValue,
} from './passportItem'
import { toSize } from './variants'

import {
	checkoutPassportItems,
	checkoutPassportItemForPayload,
} from './checkoutPassportItems'

import { PLUGIN_ID as _PLUGIN_ID } from '../constants'
import { isPassportOffering, isPassportOfferingOf } from './offerings'

export const PLUGIN_ID = _PLUGIN_ID

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
	toSize,
	isPassportOffering,
	isPassportOfferingOf,
}

export default {
	headers,
	getPassportItemForPayload,
}
