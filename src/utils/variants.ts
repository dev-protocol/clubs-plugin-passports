import { PassportItemDocument } from '../types'

export const toSize = (
	grid: NonNullable<PassportItemDocument['appearance']>['grid'] = {
		w: 1,
		h: 1,
	},
): 's' | 'm' | 'l' => {
	const { w, h } = grid
	const area = w * h
	return area === 1 ? 's' : area <= 4 ? 'm' : 'l'
}
