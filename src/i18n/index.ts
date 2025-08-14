import type { ClubsI18nParts } from '@devprotocol/clubs-core'
import { markdownToHtml } from '@devprotocol/clubs-core'

export const Strings = {
	Copyrights: {
		en: markdownToHtml(
			`Images, text, audio, video, and other data sold on this site are protected by copyright law.<br/>Reproduction, reprinting, distribution, or similar acts are prohibited and may be punishable by law.`,
		),
		ja: markdownToHtml(
			`当サイトで販売されている画像・テキスト・音声・動画などのデータは著作権法により保護されています。<br/>データの複製、転載、配布、それに準ずる行為は禁止されており、法律により罰せられる場合があります`,
		),
	},
	SignInRequest: {
		en: `Sign in or Register to continue your shopping.`,
		ja: `購入を続けるためにログインまたは会員登録をお願いします。`,
	},
	GuideLink: {
		en: `Open a guide in a new tab (Japanese)`,
		ja: `使い方ガイドを新しいタブで開く`,
	},
	GuideLinkHref: {
		en: `https://www.youtube.com/watch?v=fVjIUc0WV8c`,
		ja: `https://www.youtube.com/watch?v=fVjIUc0WV8c`,
	},
	NotForSale: {
		en: 'Not For Sale',
		ja: '非売品',
	},
	NotForSaleDetail: {
		en: 'This item is not for sale. Read the description for more information.',
		ja: 'このアイテムは非売品です。詳しくは概要欄をお読みください。',
	},
	Cart: {
		en: 'Go to Cart',
		ja: 'カートに進む',
	},
	ContinueShopping: {
		en: 'Continue Shopping',
		ja: 'ショッピングを続ける',
	},
} satisfies ClubsI18nParts
