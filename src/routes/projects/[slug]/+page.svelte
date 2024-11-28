<script lang="ts">
	import CustomMarkdown from "$lib/CustomMarkdown.svelte";
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="l0">
    <CustomMarkdown source={data.markdown} />
</div>
