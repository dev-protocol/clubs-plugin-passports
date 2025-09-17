import type { PassportItemDocument } from '../types'
import { ClubsI18nLocale } from '@devprotocol/clubs-core'

export const toI18NDict = (
	data: PassportItemDocument['itemAssetValue:i18n'] = [],
): ClubsI18nLocale => {
	return data.reduce((acc, cur) => {
		return { ...acc, [cur.locale]: cur.value }
	}, {} as ClubsI18nLocale)
}
