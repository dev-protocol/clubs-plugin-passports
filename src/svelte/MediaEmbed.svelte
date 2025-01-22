<script lang="ts">
	import { onMount } from 'svelte'
	import { EmbeddableMediaType } from '../types'
	import { getMediaId, mediaSource } from '../media'
	import type { UndefinedOr } from '@devprotocol/util-ts'

	export let src: string
	export let className: UndefinedOr<string>

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
		class={`instagram-media ${className}`}
		data-instgrm-permalink={`https://www.instagram.com/p/${mediaId}`}
	></blockquote>
{/if}

{#if type === EmbeddableMediaType.YouTube}
	<iframe
		src={`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=1&mute=1&loop=1`}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		title=""
		class={`aspect-[16/9] w-full ${className}`}
	></iframe>
{/if}

{#if type === EmbeddableMediaType.YouTubeShorts}
	<iframe
		src={`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=1&mute=1&loop=1`}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		title=""
		class={`aspect-[9/16] w-full ${className}`}
	></iframe>
{/if}

{#if type === EmbeddableMediaType.TikTok}
	<iframe
		src={`https://www.tiktok.com/player/v1/${mediaId}?autoplay=1&controls=0&play_button=0&loop=1&timestamp=0`}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class={`aspect-[9/16] w-full ${className}`}
		title=""
	></iframe>
{/if}

{#if type === EmbeddableMediaType.X}
	<blockquote
		class={`twitter-tweet ${className}`}
		bind:this={elmX}
		data-media-max-width="560"
	>
		<a
			href={`https://twitter.com/milkynoe/status/${mediaId}`}
			aria-label="from X"
		></a>
	</blockquote>
{/if}
