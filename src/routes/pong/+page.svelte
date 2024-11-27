<script>
    import CustomMarkdown from "$lib/CustomMarkdown.svelte";
    // @ts-ignore
    import Pong from '$lib/projects/pong.md?raw';
</script>

<div class="l0">
    <CustomMarkdown source={Pong} />
</div>
