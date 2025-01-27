import type { PassportItemAssetType, Price } from '../types'
import { PassportCurrency } from '../types'

const tiers = {
	t_static_clip: {
		[PassportCurrency.Yen]: 150,
		[PassportCurrency.Usdc]: 0.99,
	},
	t_playable_clip: {
		[PassportCurrency.Yen]: 300,
		[PassportCurrency.Usdc]: 1.99,
	},
	t2: {
		[PassportCurrency.Yen]: 500,
		[PassportCurrency.Usdc]: 3.29,
	},
	t3: {
		[PassportCurrency.Yen]: 800,
		[PassportCurrency.Usdc]: 5.2,
	},
	t4: {
		[PassportCurrency.Yen]: 2900,
		[PassportCurrency.Usdc]: 18.8,
	},
} satisfies Record<string, Price>

export const Prices: Record<PassportItemAssetType, Price> = {
	image: tiers.t_static_clip,
	'image-link': tiers.t_static_clip,
	'image-playable': tiers.t_playable_clip,
	'image-playable-link': tiers.t_playable_clip,
	'short-video': tiers.t_playable_clip,
	'short-video-link': tiers.t_playable_clip,
	css: tiers.t4,
	'stylesheet-link': tiers.t4,
	video: tiers.t2,
	'video-link': tiers.t2,
	bgm: tiers.t2,
	'bgm-link': tiers.t2,
	'short-video-controlled': tiers.t_playable_clip,
	'short-video-controlled-link': tiers.t_playable_clip,
}
