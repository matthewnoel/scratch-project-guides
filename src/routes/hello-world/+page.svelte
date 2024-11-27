<script>
    import CustomMarkdown from "$lib/CustomMarkdown.svelte";
    // @ts-ignore
    import HelloWorld from '$lib/projects/hello-world.md?raw';
</script>

<div class="l0">
    <CustomMarkdown source={HelloWorld} />
</div>
