<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { EmbeddableMediaType } from '../types'
import { getMediaId, mediaSource } from '../media'

const props = defineProps<{ src: string; class?: string }>()

const type = computed<EmbeddableMediaType | Error>(() => mediaSource(props.src))
const mediaId = computed<string | undefined>(() => getMediaId(props.src))
const mounted = ref(false)
const elmX = useTemplateRef('twttr')

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
	load(props.src)
})

watch(props, ({ src }) => {
	mounted.value && load(src)
})
</script>

<template>
	<blockquote
		v-if="type === EmbeddableMediaType.Instagram"
		class="instagram-media"
		:class="props.class"
		:data-instgrm-permalink="`https://www.instagram.com/p/${mediaId}`"
	></blockquote>

	<iframe
		v-if="type === EmbeddableMediaType.YouTube"
		:src="`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=1&mute=1&loop=1`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class="aspect-[1/1] w-full"
		:class="props.class"
	></iframe>

	<iframe
		v-if="type === EmbeddableMediaType.YouTubeShorts"
		:src="`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=1&mute=1&loop=1`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class="aspect-[1/1.391] w-full"
		:class="props.class"
	></iframe>

	<iframe
		v-if="type === EmbeddableMediaType.TikTok"
		:src="`https://www.tiktok.com/player/v1/${mediaId}?autoplay=1&controls=0&play_button=0&loop=1&timestamp=0`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		class="aspect-[1/1.391] w-full"
		:class="props.class"
	></iframe>

	<blockquote
		v-if="type === EmbeddableMediaType.X"
		ref="twttr"
		class="twitter-tweet"
		:class="props.class"
		data-media-max-width="560"
	>
		<a :href="`https://twitter.com/milkynoe/status/${mediaId}`"></a>
	</blockquote>

	<img
		v-if="type === EmbeddableMediaType.Image"
		:src="props.src"
		alt=""
		class="aspect-[1/1] w-full object-contain"
		:class="props.class"
	/>
</template>
