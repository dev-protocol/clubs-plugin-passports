<script lang="ts">
	import MediaEmbed from '../../../../src/svelte/MediaEmbed.svelte'

	let url: string
</script>

<input type="text" bind:value={url} />

<h2>Dynamic Content</h2>
{#if url}
	<MediaEmbed src={url} />
{/if}

<h2>SSR Content</h2>
<MediaEmbed src="https://www.youtube.com/watch?v=lJ2Ao1suBSw" />
