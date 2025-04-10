<script setup lang="ts">
import { useTemplateRef, computed, watch, onMounted, ref } from 'vue'
import { VideoFetch } from '@devprotocol/clubs-core/ui/vue'
import type { MediaProps } from '../types'
import { CSSTypes, ImageTypes, VideoTypes } from '../utils/passportTypes'
import { whenDefined } from '@devprotocol/util-ts'
import MediaEmbed from './MediaEmbed.vue'

const {
	item,
	class: className,
	embedOptions,
	embedClass,
	imageClass,
	videoClass,
} = defineProps<MediaProps>()

const imageRef = useTemplateRef(`imageRef`)
const imageLoaded = ref(false)

const image = computed(() => {
	return whenDefined(item?.itemAssetType, (type) =>
		ImageTypes.includes(type)
			? item?.itemAssetValue
			: CSSTypes.includes(type)
				? item?.previewImageSrc
				: undefined,
	)
})

const video = computed(() => {
	return whenDefined(item?.itemAssetType, (type) =>
		VideoTypes.includes(type) ? item?.itemAssetValue : undefined,
	)
})

onMounted(() => {
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
			const response = await fetch(image.value)
			const blob = await response.blob()
			const blobDataUrl = URL.createObjectURL(blob)
			if (imageRef.value) {
				imageRef.value.src = blobDataUrl
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
	>
		<img
			v-if="image"
			ref="imageRef"
			alt="Clip"
			class="w-full object-cover [&:not([src])]:hidden"
			:class="[className, imageClass]"
		/>
		<VideoFetch
			v-if="video"
			:videoClass="`${className ? className : ''} ${videoClass ? videoClass : ''}`"
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
			class="aspect-square h-full animate-pulse rounded bg-gray-500/50"
		/>
	</div>
</template>

<style scoped>
.touchCallout {
	-webkit-touch-callout: none;
	touch-callout: none;
}
</style>
