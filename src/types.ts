import type { ReadonlyDeep } from 'type-fest'

import type { getDefaultClient } from './db/redis'
import type { CheckoutOptions } from '@devprotocol/clubs-core/ui/components'
import type { Override } from '@devprotocol/clubs-plugin-payments'

import type {
	ClubsConfiguration,
	ClubsI18nLocale,
	ClubsOffering,
	Membership,
} from '@devprotocol/clubs-core'

export enum Index {
	PassportItem = 'idx::clubs:passportitem',
}

export enum Prefix {
	PassportItem = 'doc::clubs:passportitem',
}

export enum SchemaKey {
	PassportItem = 'scm::clubs:passportitem',
}

export enum Payments {
	CreditCard = 'credit-card',
	Crypto = 'crypto',
}

export type Option = Readonly<{
	key: 'acceptable-payments'
	value: Payments[]
}>

export type TokenURIWithId = Readonly<{
	id: number
	image: string
}>

export type DefaultClient = Readonly<ReturnType<typeof getDefaultClient>>
export type AwaitedDefaultClient = ReadonlyDeep<Awaited<DefaultClient>>

export const ERROR = {
	$400: {
		DBNOTFOUND: 'DB not found.',
		MISSINGDATA: 'Missing data.',
		INVALIDREQ: 'Invalid request.',
		CLUBSNOTFOUND: 'Clubs not found.',
	},
	$401: {
		INVALIDACCESS: 'Invalid access.',
	},
	$500: {
		DBERROR: 'Passport item db error',
	},
}

export type PassportItemAssetType =
	| 'css'
	| 'stylesheet-link'
	| 'short-video'
	| 'short-video-link'
	| 'image'
	| 'image-link'
	| 'image-playable'
	| 'image-playable-link'
	| 'video'
	| 'video-link'
	| 'bgm'
	| 'bgm-link'
	| 'short-video-controlled'
	| 'short-video-controlled-link'

export type PassportItemDocument = Readonly<{
	id: string
	sTokenId?: string
	sTokenPayload: string
	clubsUrl: string
	itemAssetType: PassportItemAssetType
	itemAssetValue: string
	appearance?: {
		grid?: {
			w: 1 | 2 | 3
			h: 1 | 2 | 3
		}
	}
}>

export type CreatePassportItemReq = ReadonlyDeep<{
	site: string
	message: string
	signature: string
	passportItem: Omit<PassportItemDocument, 'id' | 'clubsUrl'>
}>

export type PatchPassportItemValueReq = ReadonlyDeep<{
	site: string
	message: string
	signature: string
	sTokenPayload: string
	passportItemValue: string
}>

export type ComposedCheckoutOptions = CheckoutOptions &
	Readonly<{
		offering: PassportOffering
		destination: string
		passportItem: PassportItemDocument
		fiat?: Omit<Override, 'id' | 'importFrom' | 'key' | 'payload'>
		notForSale: boolean
		discount?: Omit<PassportOptionsDiscount, 'payload'>
		chainId: ClubsConfiguration['chainId']
		debugMode?: boolean
		acceptablePayments: Option['value']
		base: string
	}>

export type PassportOptionsOverride = {
	payload: string | Uint8Array
	price: Record<PassportCurrency.Yen, number> | 'not-for-sale'
}

export type PassportOptionsOverrides = ReadonlyArray<PassportOptionsOverride>

export type PassportOptionsDiscount = {
	payload: string | Uint8Array
	start_utc: number
	end_utc: number
	price: Record<PassportCurrency.Yen, number>
}

export type PassportOptionsDiscounts = ReadonlyArray<PassportOptionsDiscount>

export type PassportOffering = ClubsOffering<
	Membership & {
		bundle?: ReadonlyArray<ClubsOffering['payload']>
		previewImageSrc?: string
		previewImages?: ReadonlyArray<string>
		i18n: {
			name: ClubsI18nLocale
			description: ClubsI18nLocale
			groupVar?: ClubsI18nLocale
		}
		groupOf?: string
	}
>

export type MediaProps = {
	item?: {
		link?: string
		itemAssetType?: PassportItemDocument['itemAssetType']
		itemAssetValue?: PassportItemDocument['itemAssetValue']
		previewImageSrc?: PassportOffering['previewImageSrc']
		appearance?: PassportItemDocument['appearance']
	}
	embedOptions?: {
		autoplay?: boolean
		lock?: boolean
		mute?: boolean
	}
	class?: string
	imageClass?: string
	videoClass?: string
	embedClass?: string
}

export enum PassportCurrency {
	Yen = 'yen',
	Usdc = 'usdc',
}

export type Price = Record<PassportCurrency, number>

export enum EmbeddableMediaType {
	Instagram = 'instagram',
	YouTube = 'youtube',
	YouTubeShorts = 'youtube-shorts',
	X = 'x',
	TikTok = 'tiktok',
	Pinterest = 'pinterest',
	Image = 'image',
}

declare global {
	// eslint-disable-next-line functional/no-mixed-types
	interface Window {
		instagram?: {
			Embeds: {
				process: () => null
			}
		}
		twttr?: {
			widgets: {
				load: (arg: HTMLElement) => null
			}
		}
		doBuild?: (arg: HTMLElement) => null
	}
}
