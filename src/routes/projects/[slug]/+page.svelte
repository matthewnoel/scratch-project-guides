<script lang="ts">
	import CustomMarkdown from '$lib/CustomMarkdown.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={`Guide for a "${data.title}" project in Scratch.`} />
</svelte:head>

<div class="l0">
	<CustomMarkdown source={data.markdown} />
</div>
