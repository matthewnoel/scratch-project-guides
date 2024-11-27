<script>
    import CustomMarkdown from "$lib/CustomMarkdown.svelte";
    // @ts-ignore
    import FibonacciSequence from '$lib/projects/fibonacci-sequence.md?raw';
</script>

<div class="l0">
    <CustomMarkdown source={FibonacciSequence} />
</div>
