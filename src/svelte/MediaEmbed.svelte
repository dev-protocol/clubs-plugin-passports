<script lang="ts">
	import { onMount } from 'svelte'
	import { EmbeddableMediaType } from '../types'
	import { getMediaId, mediaSource } from '../media'
	import type { UndefinedOr } from '@devprotocol/util-ts'

	export let src: string
	export let className: UndefinedOr<string> = undefined
	export let autoplay = true
	export let lock = false

	let type: EmbeddableMediaType | Error
	let mediaId: string | undefined
	let mounted = false
	let elmX: HTMLQuoteElement

	$: {
		type = mediaSource(src)
		mediaId = getMediaId(src)
		mounted && load(src)
	}

	const load = (src: string) => {
		const type = mediaSource(src)
		if (type === EmbeddableMediaType.Instagram) {
			window.instagram?.Embeds.process()
		}
		if (type === EmbeddableMediaType.X && elmX) {
			window.twttr?.widgets.load(elmX)
		}
	}
	onMount(() => {
		mounted = true
		const sdks = [
			'//www.instagram.com/embed.js',
			'//platform.twitter.com/widgets.js',
		]
		sdks.forEach((sdk) => {
			if (document.querySelector(`script[src*='${sdk}']`) === null) {
				const script = document.createElement('script')
				script.setAttribute('src', sdk)
				script.setAttribute('async', 'async')
				document.body.append(script)
			}
		})
		load(src)
	})
</script>

{#if type === EmbeddableMediaType.Instagram}
	<blockquote
		class={`instagram-media ${lock ? 'pointer-events-none' : ''} ${className}`}
		data-instgrm-permalink={`https://www.instagram.com/p/${mediaId}`}
	></blockquote>
{/if}

{#if type === EmbeddableMediaType.YouTube}
	<iframe
		src={`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=${autoplay ? 1 : 0}&mute=1&loop=1`}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		title=""
		class={`aspect-[1/1] w-full ${lock ? 'pointer-events-none' : ''} ${className}`}
	></iframe>
{/if}

{#if type === EmbeddableMediaType.YouTubeShorts}
	<iframe
		src={`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=${autoplay ? 1 : 0}&&mute=1&loop=1`}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		title=""
		class={`aspect-[1/1.391] w-full ${lock ? 'pointer-events-none' : ''} ${className}`}
	></iframe>
{/if}

{#if type === EmbeddableMediaType.TikTok}
	<iframe
		src={`https://www.tiktok.com/player/v1/${mediaId}?autoplay=${autoplay ? 1 : 0}&&controls=0&play_button=0&loop=1&timestamp=0`}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class={`aspect-[1/1.391] w-full ${lock ? 'pointer-events-none' : ''} ${className}`}
		title=""
	></iframe>
{/if}

{#if type === EmbeddableMediaType.X}
	<div
		class={`flex aspect-[1/1.391] items-end justify-center overflow-hidden bg-black/2 backdrop-blur-md *:!mt-1 *:mt-1! *:!-mb-[119px] *:-mb-[119px]! *:!flex *:flex! *:!min-w-auto *:min-w-auto! *:!justify-center *:justify-center! ${lock ? 'pointer-events-none' : ''} ${className}`}
	>
		<blockquote class="twitter-tweet" bind:this={elmX}>
			<a
				href={`https://twitter.com/milkynoe/status/${mediaId}`}
				aria-label="from X"
			></a>
		</blockquote>
	</div>
{/if}

{#if type === EmbeddableMediaType.Pinterest}
	<iframe
		src={`https://assets.pinterest.com/ext/embed.html?id=${mediaId}`}
		frameborder="0"
		scrolling="no"
		class={`aspect-[1/1.391] w-full ${lock ? 'pointer-events-none' : ''} ${className}`}
		title=""
	></iframe>
{/if}

{#if type === EmbeddableMediaType.Image}
	<img
		{src}
		alt=""
		class={`aspect-[1/1] w-full object-contain ${lock ? 'pointer-events-none' : ''} ${className}`}
	/>
{/if}
