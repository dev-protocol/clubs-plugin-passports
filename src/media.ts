import { whenDefined } from '@devprotocol/util-ts'
import { EmbeddableMediaType } from './types'

export const mediaSource = (url?: string): EmbeddableMediaType | Error =>
	whenDefined(url, (src) =>
		src.includes('instagram.com')
			? EmbeddableMediaType.Instagram
			: src.includes('youtu.be') || src.includes('youtube.com/watch')
				? EmbeddableMediaType.YouTube
				: src.includes('youtube.com/shorts')
					? EmbeddableMediaType.YouTubeShorts
					: src.includes('tiktok.com')
						? EmbeddableMediaType.TikTok
						: src.includes('x.com') || src.includes('twitter.com')
							? EmbeddableMediaType.X
							: undefined,
	) ?? new Error('Unexpected URL is passed.')

/**
 *
 * @param url this can be ...
 * https://www.instagram.com/p/DEVM0XEyRsZ
 * https://www.youtube.com/watch?v=lJ2Ao1suBSw
 * https://youtu.be/lJ2Ao1suBSw
 * https://youtube.com/shorts/23-ljiG3uyo
 * https://www.tiktok.com/@theamirhanio/video/7297335518293953810
 * https://x.com/milkynoe/status/1879830201900872035
 * https://twitter.com/milkynoe/status/1879830201900872035
 * @returns ID string
 */
export const getMediaId = (url: string): string | undefined => {
	const type = mediaSource(url)
	const _url = new URL(url)
	const pathnames = _url.pathname.split('/')
	const id =
		type === EmbeddableMediaType.Instagram
			? pathnames.at(2)
			: type === EmbeddableMediaType.TikTok
				? pathnames.at(3)
				: type === EmbeddableMediaType.X
					? pathnames.at(3)
					: type === EmbeddableMediaType.YouTube
						? _url.host.includes('youtu.be')
							? pathnames.at(1)
							: _url.pathname.includes('/watch')
								? _url.searchParams.get('v')
								: _url.pathname.includes('/shorts')
									? pathnames.at(2)
									: undefined
						: undefined
	return typeof id === 'string' ? id : undefined
}
