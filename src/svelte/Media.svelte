<script lang="ts">
	import { VideoFetch } from '@devprotocol/clubs-core/ui/svelte'
	import type { MediaProps } from '../types'
	import { CSSTypes, ImageTypes, VideoTypes } from '../utils/passportTypes'
	import { whenDefined } from '@devprotocol/util-ts'
	import MediaEmbed from './MediaEmbed.svelte'

	let {
		item,
		class: className,
		embedOptions,
		embedClass,
		imageClass,
		videoClass,
	}: MediaProps = $props()

	let imageRef = $state<HTMLImageElement>()
	let imageLoaded = $state(false)

	let image = $derived(
		whenDefined(item?.itemAssetType, (type) =>
			ImageTypes.includes(type)
				? item?.itemAssetValue
				: CSSTypes.includes(type)
					? item?.previewImageSrc
					: undefined,
		),
	)

	let video = $derived(
		whenDefined(item?.itemAssetType, (type) =>
			VideoTypes.includes(type) ? item?.itemAssetValue : undefined,
		),
	)

	$effect(() => {
		updateImageIfNeeded()
	})

	async function updateImageIfNeeded() {
		if (image && imageRef && imageRef.src !== image) {
			try {
				const response = await fetch(image)
				const blob = await response.blob()
				const blobDataUrl = URL.createObjectURL(blob)
				if (imageRef) {
					imageRef.src = blobDataUrl
					imageLoaded = true
				}
			} catch (error) {
				console.error('Error loading video:', error)
			}
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="touchCallout contents select-none"
	on:contextmenu|preventDefault={() => false}
	on:selectstart|preventDefault={() => false}
	on:mousedown|preventDefault={() => false}
>
	{#if image}
		<img
			bind:this={imageRef}
			alt="Clip"
			class={`w-full object-cover [&:not([src])]:hidden ${className} ${imageClass}`}
		/>
	{/if}
	{#if video}
		<VideoFetch
			videoClass={`${className ? className : ''} ${
				videoClass ? videoClass : ''
			}`}
			url={video}
			alt="Clip"
			is-controlled={item?.itemAssetType === 'short-video-controlled' ||
				item?.itemAssetType === 'short-video-controlled-link'}
		/>
	{/if}
	{#if typeof item?.link === 'string'}
		<MediaEmbed
			src={item.link}
			className={`${className ? className : ''} ${embedClass ? embedClass : ''}`}
			autoplay={embedOptions?.autoplay}
			lock={embedOptions?.lock}
		/>
	{/if}
	{#if image && !imageLoaded}
		<div class="aspect-square h-full animate-pulse rounded bg-gray-500/50" />
	{/if}
</div>

<style scoped>
	.touchCallout {
		-webkit-touch-callout: none;
		touch-callout: none;
	}
</style>
