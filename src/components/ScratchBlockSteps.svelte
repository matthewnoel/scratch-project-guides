<script>
    import ScratchBlock from "./ScratchBlock.svelte";
    export let blocks = [];
    export let start = 0;
    let index = start;
    $: text = blocks[index] ?? '';
    const tryUpdateBlock = (offset) => {
        if (blocks[index + offset] == null) {
            return;
        }
        index = index + offset;
    };
    const onNextStep = () => tryUpdateBlock(1);
    const onPreviousStep = () => tryUpdateBlock(-1);
</script>

<ScratchBlock {text} />
<div>
    <input type="button" value="Back" disabled={blocks[index - 1] == null} on:click={onPreviousStep} on:keydown={onPreviousStep}>
    {#if blocks[index] == null}
        <span>No Steps</span>
    {:else}
        <span>Step {index + 1}/{blocks.length}</span>
    {/if}
    <input type="button" value="Next" disabled={blocks[index + 1] == null} on:click={onNextStep} on:keydown={onNextStep}>
</div>