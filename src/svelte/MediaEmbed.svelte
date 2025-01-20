<script lang="ts">
	import { onMount } from 'svelte'
	import { EmbeddableMediaType } from '../types'
	import { getMediaId, mediaSource } from '../media'

	export let src: string

	let type: EmbeddableMediaType | Error
	let mediaId: string | undefined

	$: {
		type = mediaSource(src)
		mediaId = getMediaId(src)
	}

	onMount(() => {
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
	})
</script>

{#if type === EmbeddableMediaType.Instagram}
	<blockquote
		class="instagram-media"
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
		style="width: 100%; aspect-ratio: 16/9"
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
		style="width: 100%; aspect-ratio: 9/16"
	></iframe>
{/if}

{#if type === EmbeddableMediaType.TikTok}
	<iframe
		src={`https://www.tiktok.com/player/v1/${mediaId}?autoplay=1&controls=0&play_button=0&loop=1&timestamp=0`}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		style="width: 100%; aspect-ratio: 9/16"
		title=""
	></iframe>
{/if}

{#if type === EmbeddableMediaType.X}
	<blockquote class="twitter-tweet" data-media-max-width="560">
		<a
			href={`https://twitter.com/milkynoe/status/${mediaId}`}
			aria-label="from X"
		></a>
	</blockquote>
{/if}
