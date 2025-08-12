<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { EmbeddableMediaType } from '../types'
import { getMediaId, mediaSource } from '../media'

const {
	src,
	class: className,
	autoplay = true,
	lock = false,
	mute = true,
} = defineProps<{
	src: string
	class?: string
	autoplay?: boolean
	lock?: boolean
	mute?: boolean
}>()

const type = computed<EmbeddableMediaType | Error>(() => mediaSource(src))
const mediaId = computed<string | undefined>(() => getMediaId(src))
const mounted = ref(false)
const elmX = useTemplateRef('twttr')
const tiktokRef = useTemplateRef<HTMLIFrameElement>('tiktok-player')
const _src = computed(() => src)

const load = (src: string) => {
	const type = mediaSource(src)
	if (type === EmbeddableMediaType.Instagram) {
		window.instagram?.Embeds.process()
	}
	if (type === EmbeddableMediaType.X && elmX.value) {
		window.twttr?.widgets.load(elmX.value)
	}
}

onMounted(() => {
	mounted.value = true
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

	window.addEventListener('message', (event) => {
		if (
			event.data &&
			event.data['x-tiktok-player'] &&
			event.data.type === 'onPlayerReady' &&
			!mute &&
			type.value === EmbeddableMediaType.TikTok
		) {
			tiktokRef.value?.contentWindow?.postMessage(
				{ type: 'unMute', 'x-tiktok-player': true },
				'*',
			)
		}
	})
})

watch(_src, (__src) => {
	mounted.value && load(__src)
})
</script>

<template>
	<blockquote
		v-if="type === EmbeddableMediaType.Instagram"
		class="instagram-media"
		:class="[className, { 'pointer-events-none': lock }]"
		:data-instgrm-permalink="`https://www.instagram.com/p/${mediaId}`"
	></blockquote>

	<iframe
		v-if="type === EmbeddableMediaType.YouTube"
		:src="`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=${autoplay ? 1 : 0}&mute=${mute ? 1 : 0}&loop=1`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class="aspect-[1/1] w-full"
		:class="[className, { 'pointer-events-none': lock }]"
	></iframe>

	<iframe
		v-if="type === EmbeddableMediaType.YouTubeShorts"
		:src="`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=${autoplay ? 1 : 0}&mute=${mute ? 1 : 0}&loop=1`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class="aspect-[1/1.391] w-full"
		:class="[className, { 'pointer-events-none': lock }]"
	></iframe>

	<iframe
		v-if="type === EmbeddableMediaType.TikTok"
		ref="tiktok-player"
		:src="`https://www.tiktok.com/player/v1/${mediaId}?autoplay=${autoplay ? 1 : 0}&controls=0&play_button=0&loop=1&timestamp=0`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class="aspect-[1/1.391] w-full"
		:class="[className, { 'pointer-events-none': lock }]"
	></iframe>

	<div
		v-if="type === EmbeddableMediaType.X"
		class="flex aspect-[1/1.391] items-end justify-center overflow-hidden bg-black/2 backdrop-blur-md *:!mt-1 *:mt-1! *:!-mb-[119px] *:-mb-[119px]! *:!flex *:flex! *:!min-w-auto *:min-w-auto! *:!justify-center *:justify-center!"
		:class="[className, { 'pointer-events-none': lock }]"
	>
		<blockquote ref="twttr" class="twitter-tweet">
			<a :href="`https://twitter.com/milkynoe/status/${mediaId}`"></a>
		</blockquote>
	</div>

	<iframe
		v-if="type === EmbeddableMediaType.Pinterest"
		:src="`https://assets.pinterest.com/ext/embed.html?id=${mediaId}`"
		frameborder="0"
		scrolling="no"
		class="aspect-[1/1.391] w-full"
		:class="[className, { 'pointer-events-none': lock }]"
	></iframe>

	<img
		v-if="type === EmbeddableMediaType.Image"
		:src="src"
		alt=""
		class="aspect-[1/1] w-full object-contain"
		:class="[className, { 'pointer-events-none': lock }]"
	/>
</template>
