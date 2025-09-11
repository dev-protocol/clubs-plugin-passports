import type { PassportItemAssetType, Price } from '../types'
import { PassportCurrency } from '../types'

const $1 = 130
const toUSD = (yen: number) =>
	((factor) => Math.round((yen / $1) * factor) / factor)(Math.pow(10, 2))

const tiers = {
	t_static_clip_S: {
		[PassportCurrency.Yen]: 200,
		[PassportCurrency.Usdc]: toUSD(200),
	},
	t_static_clip_M: {
		[PassportCurrency.Yen]: 400,
		[PassportCurrency.Usdc]: toUSD(400),
	},
	t_static_clip_L: {
		[PassportCurrency.Yen]: 600,
		[PassportCurrency.Usdc]: toUSD(600),
	},
	t_playable_clip_S: {
		[PassportCurrency.Yen]: 400,
		[PassportCurrency.Usdc]: toUSD(400),
	},
	t_playable_clip_M: {
		[PassportCurrency.Yen]: 600,
		[PassportCurrency.Usdc]: toUSD(600),
	},
	t_playable_clip_L: {
		[PassportCurrency.Yen]: 800,
		[PassportCurrency.Usdc]: toUSD(800),
	},
	t_controllable_clip_S: {
		[PassportCurrency.Yen]: 600,
		[PassportCurrency.Usdc]: toUSD(600),
	},
	t_controllable_clip_M: {
		[PassportCurrency.Yen]: 800,
		[PassportCurrency.Usdc]: toUSD(800),
	},
	t_controllable_clip_L: {
		[PassportCurrency.Yen]: 1000,
		[PassportCurrency.Usdc]: toUSD(1000),
	},
	t2: {
		[PassportCurrency.Yen]: 500,
		[PassportCurrency.Usdc]: toUSD(500),
	},
	t3: {
		[PassportCurrency.Yen]: 800,
		[PassportCurrency.Usdc]: toUSD(800),
	},
	t4: {
		[PassportCurrency.Yen]: 2900,
		[PassportCurrency.Usdc]: toUSD(2900),
	},
} satisfies Record<string, Price>

export const Prices = {
	image: {
		s: tiers.t_static_clip_S,
		m: tiers.t_static_clip_M,
		l: tiers.t_static_clip_L,
	},
	'image-link': {
		s: tiers.t_static_clip_S,
		m: tiers.t_static_clip_M,
		l: tiers.t_static_clip_L,
	},
	'image-playable': {
		s: tiers.t_playable_clip_S,
		m: tiers.t_playable_clip_M,
		l: tiers.t_playable_clip_L,
	},
	'image-playable-link': {
		s: tiers.t_playable_clip_S,
		m: tiers.t_playable_clip_M,
		l: tiers.t_playable_clip_L,
	},
	'short-video': tiers.t_playable_clip_S,
	'short-video-link': tiers.t_playable_clip_S,
	css: tiers.t4,
	'stylesheet-link': tiers.t4,
	video: tiers.t2,
	'video-link': tiers.t2,
	bgm: tiers.t2,
	'bgm-link': tiers.t2,
	'short-video-controlled': {
		s: tiers.t_controllable_clip_S,
		m: tiers.t_controllable_clip_M,
		l: tiers.t_controllable_clip_L,
	},
	'short-video-controlled-link': {
		s: tiers.t_controllable_clip_S,
		m: tiers.t_controllable_clip_M,
		l: tiers.t_controllable_clip_L,
	},
	'image-media-controlled-link': {
		s: tiers.t_controllable_clip_S,
		m: tiers.t_controllable_clip_M,
		l: tiers.t_controllable_clip_L,
	},
} satisfies Record<
	PassportItemAssetType,
	Price | Record<'s' | 'm' | 'l', Price>
>
