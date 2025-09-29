<script setup lang="ts">
import { useTemplateRef, computed, watch, onMounted, ref } from 'vue'
import { VideoFetch } from '@devprotocol/clubs-core/ui/vue'
import type { MediaProps } from '../types'
import { CSSTypes, ImageTypes, VideoTypes } from '../utils/passportTypes'
import { whenDefined } from '@devprotocol/util-ts'
import MediaEmbed from './MediaEmbed.vue'
import { i18nFactory } from '@devprotocol/clubs-core'
import { toI18NDict } from '../utils/i18n'
import { ImageCache } from '../cache'

const {
	item,
	class: className,
	embedOptions,
	embedClass,
	imageClass,
	videoClass,
	langs: _langs,
} = defineProps<MediaProps>()

const imageRef = useTemplateRef(`imageRef`)
const imageLoaded = ref(false)
const langs = ref(_langs ?? ['en'])

const image = computed(() => {
	return whenDefined(item?.itemAssetType, (type) =>
		ImageTypes.includes(type)
			? (whenDefined(item?.['itemAssetValue:i18n'], (i18n) =>
					i18nFactory({ i: toI18NDict(i18n) })(langs.value)('i'),
				) ?? item?.itemAssetValue)
			: CSSTypes.includes(type)
				? item?.previewImageSrc
				: undefined,
	)
})

const video = computed(() => {
	return whenDefined(item?.itemAssetType, (type) =>
		VideoTypes.includes(type)
			? item?.itemAssetValue
			: type === 'image-media-controlled-link' && item?.['itemAssetValue:video']
				? item['itemAssetValue:video']
				: undefined,
	)
})

const aspect = computed(() =>
	whenDefined(item?.appearance?.grid, (grid) => `${grid.w} / ${grid.h}`),
)

onMounted(() => {
	langs.value = [...navigator.languages]
	updateImageIfNeeded()
})

watch(image, async (newVal, oldVal) => {
	if (newVal !== oldVal) {
		await updateImageIfNeeded()
	}
})

async function updateImageIfNeeded() {
	if (image.value) {
		try {
			const cachedBlob = ImageCache.get(image.value)
			const blob =
				whenDefined(cachedBlob, (cache) => cache) ??
				(await fetch(image.value).then((res) => res.blob()))
			if (!cachedBlob && blob) ImageCache.set(image.value, blob)
			const blobDataUrl = whenDefined(blob, (b) => URL.createObjectURL(b))
			if (imageRef.value) {
				imageRef.value.src = blobDataUrl ?? ''
				imageLoaded.value = true
			}
		} catch (error) {
			console.error('Error loading video:', error)
		}
	}
}
</script>

<template>
	<div
		class="touchCallout contents select-none"
		oncontextmenu="return false"
		onselectstart="return false"
		onmousedown="return false"
		:style="aspect ? { '--itemAspect': aspect } : undefined"
	>
		<div
			v-if="item?.itemAssetType === 'image-media-controlled-link'"
			class="relative aspect-[var(--itemAspect)]"
			:class="className"
		>
			<img
				ref="imageRef"
				alt="Clip"
				class="aspect-[var(--itemAspect)] w-full object-contain [&:not([src])]:hidden"
				:class="imageClass"
			/>
			<VideoFetch
				v-if="video"
				videoClass="!hidden"
				:url="video"
				alt="Clip"
				:is-controlled="true"
				:muted="false"
			/>
			<div
				v-if="image && !imageLoaded"
				class="aspect-[var(--itemAspect)] h-full animate-pulse rounded bg-gray-500/50"
			/>
		</div>
		<template v-else>
			<img
				v-if="image"
				ref="imageRef"
				alt="Clip"
				class="aspect-[var(--itemAspect)] w-full object-contain [&:not([src])]:hidden"
				:class="[className, imageClass]"
			/>
			<VideoFetch
				v-if="video"
				:videoClass="`aspect-[var(--itemAspect)] ${className ? className : ''} ${videoClass ? videoClass : ''}`"
				:url="video"
				alt="Clip"
				:is-controlled="
					item?.itemAssetType === 'short-video-controlled' ||
					item?.itemAssetType === 'short-video-controlled-link'
				"
			/>
			<MediaEmbed
				v-if="typeof item?.link === 'string'"
				:src="item.link"
				:class="`${className ? className : ''} ${embedClass ? embedClass : ''}`"
				:autoplay="embedOptions?.autoplay"
				:lock="embedOptions?.lock"
				:mute="embedOptions?.mute"
			/>
			<div
				v-if="image && !imageLoaded"
				class="aspect-[var(--itemAspect)] h-full animate-pulse rounded bg-gray-500/50"
			/>
		</template>
	</div>
</template>

<style scoped>
.touchCallout {
	-webkit-touch-callout: none;
	touch-callout: none;
}
</style>
