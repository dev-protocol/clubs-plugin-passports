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
import { getPayloadFromURL } from './routes'
import { toI18NDict } from './i18n'

export const PLUGIN_ID = _PLUGIN_ID

export {
	headers,
	getPassportItemForPayload,
	addPassportItemSetter,
	patchPassportItemValue,
	checkoutPassportItems,
	checkoutPassportItemForPayload,
	getPayloadFromURL,
	toSize,
	isPassportOffering,
	isPassportOfferingOf,
	toI18NDict,
}

export default {
	headers,
	getPassportItemForPayload,
}
