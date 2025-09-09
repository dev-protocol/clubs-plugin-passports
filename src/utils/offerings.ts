import { bytes32Hex, ClubsOffering } from '@devprotocol/clubs-core'
import { PassportOffering } from '../types'
import { PLUGIN_ID } from '../constants/plugin'

export const isPassportOffering = (
	offering: ClubsOffering,
): offering is PassportOffering => {
	return offering.managedBy === PLUGIN_ID
}

export const isPassportOfferingOf =
	(payload: ClubsOffering['payload']) =>
	(offering: ClubsOffering): offering is PassportOffering => {
		return (
			isPassportOffering(offering) &&
			bytes32Hex(offering.payload) === bytes32Hex(payload)
		)
	}
