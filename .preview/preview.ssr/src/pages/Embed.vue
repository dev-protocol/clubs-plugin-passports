<script setup lang="ts">
import { ref } from 'vue'
import MediaEmbed from '../../../../src/vue/MediaEmbed.vue'

const url = ref<string>()
</script>

<template>
	<input type="text" v-model="url" />

	<h2>Dynamic Content</h2>
	<MediaEmbed v-if="url" :src="url" />

	<h2>SSR Content</h2>
	<MediaEmbed src="https://www.youtube.com/watch?v=lJ2Ao1suBSw" />
</template>
