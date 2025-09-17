<script lang="ts">
	import { VideoFetch } from '@devprotocol/clubs-core/ui/svelte'
	import type { MediaProps } from '../types'
	import { CSSTypes, ImageTypes, VideoTypes } from '../utils/passportTypes'
	import { whenDefined } from '@devprotocol/util-ts'
	import MediaEmbed from './MediaEmbed.svelte'
	import { onMount } from 'svelte'
	import { i18nFactory } from '@devprotocol/clubs-core'
	import { toI18NDict } from '../utils/i18n'

	let {
		item,
		class: className,
		embedOptions,
		embedClass,
		imageClass,
		videoClass,
		langs: _langs,
	}: MediaProps = $props()

	let imageRef = $state<HTMLImageElement>()
	let imageLoaded = $state(false)
	let langs = $state<string[]>(_langs ?? ['en'])

	let image = $derived(
		whenDefined(item?.itemAssetType, (type) =>
			ImageTypes.includes(type)
				? (whenDefined(item?.['itemAssetValue:i18n'], (i18n) =>
						i18nFactory({ i: toI18NDict(i18n) })(langs)('i'),
					) ?? item?.itemAssetValue)
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

	onMount(() => {
		langs = [...navigator.languages]
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
	{#if item?.itemAssetType === 'image-media-controlled-link'}
		<div class={`relative aspect-[var(--itemAspect)] ${className}`}>
			<img
				bind:this={imageRef}
				alt="Clip"
				class={`aspect-[var(--itemAspect)] w-full object-contain [&:not([src])]:hidden ${imageClass}`}
			/>
			{#if video}
				<VideoFetch
					videoClass="!hidden"
					url={video}
					alt="Clip"
					is-controlled={true}
					muted={false}
				/>
			{/if}
			{#if image && !imageLoaded}
				<div
					class="aspect-[var(--itemAspect)] h-full animate-pulse rounded bg-gray-500/50"
				/>
			{/if}
		</div>
	{:else}
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
	{/if}
</div>

<style scoped>
	.touchCallout {
		-webkit-touch-callout: none;
		touch-callout: none;
	}
</style>
