<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { EmbeddableMediaType } from '../types'
import { getMediaId, mediaSource } from '../media'

const props = defineProps<{ src: string }>()

const type = computed<EmbeddableMediaType | Error>(() => mediaSource(props.src))
const mediaId = computed<string | undefined>(() => getMediaId(props.src))

onMounted(() => {
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

<template>
	<blockquote
		v-if="type === EmbeddableMediaType.Instagram"
		class="instagram-media"
		:data-instgrm-permalink="`https://www.instagram.com/p/${mediaId}`"
	></blockquote>

	<iframe
		v-if="type === EmbeddableMediaType.YouTube"
		:src="`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=1&mute=1&loop=1`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		style="width: 100%; aspect-ratio: 16/9"
	></iframe>

	<iframe
		v-if="type === EmbeddableMediaType.YouTubeShorts"
		:src="`https://www.youtube.com/embed/${mediaId}?playlist=${mediaId}&autoplay=1&mute=1&loop=1`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		style="width: 100%; aspect-ratio: 9/16"
	></iframe>

	<iframe
		v-if="type === EmbeddableMediaType.TikTok"
		:src="`https://www.tiktok.com/player/v1/${mediaId}?autoplay=1&controls=0&play_button=0&loop=1&timestamp=0`"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		frameborder="0"
		style="width: 100%; aspect-ratio: 9/16"
	></iframe>

	<blockquote
		v-if="type === EmbeddableMediaType.X"
		class="twitter-tweet"
		data-media-max-width="560"
	>
		<a :href="`https://twitter.com/milkynoe/status/${mediaId}`"></a>
	</blockquote>
</template>
