import { whenDefined } from '@devprotocol/util-ts'
import { EmbeddableMediaType } from './types'
import { tryCatch } from 'ramda'

export const mediaSource = (url?: string): EmbeddableMediaType | Error =>
	whenDefined(
		tryCatch(
			(val?: string) => (val ? new URL(val) : undefined),
			() => undefined,
		)(url),
		(src) =>
			src.host.includes('instagram.com')
				? EmbeddableMediaType.Instagram
				: src.host.includes('youtu.be') ||
					  src.href.includes('youtube.com/watch')
					? EmbeddableMediaType.YouTube
					: src.href.includes('youtube.com/shorts')
						? EmbeddableMediaType.YouTubeShorts
						: src.host.includes('tiktok.com')
							? EmbeddableMediaType.TikTok
							: src.host.includes('x.com') || src.host.includes('twitter.com')
								? EmbeddableMediaType.X
								: src.host.includes('pinterest.com')
									? EmbeddableMediaType.Pinterest
									: src.pathname.endsWith('.jpg') ||
										  src.pathname.endsWith('.jpeg') ||
										  src.pathname.endsWith('.png') ||
										  src.pathname.endsWith('.webp') ||
										  src.pathname.endsWith('.avif') ||
										  src.pathname.endsWith('.gif') ||
										  src.pathname.endsWith('.gifv')
										? EmbeddableMediaType.Image
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
								? _url.searchParams.get('v')!.replace(/\//g, '')
								: undefined
						: type === EmbeddableMediaType.YouTubeShorts
							? pathnames.at(2)
							: type === EmbeddableMediaType.Pinterest
								? pathnames.at(2)
								: undefined
	return typeof id === 'string' ? id : undefined
}
