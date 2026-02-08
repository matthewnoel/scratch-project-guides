<script lang="ts">
	import CustomMarkdown from '$lib/CustomMarkdown.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={`Guide for a "${data.title}" project in Scratch.`} />
</svelte:head>

<article class="level-1">
	<CustomMarkdown source={data.markdown} />
</article>
