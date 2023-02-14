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
    const validateKeydown = (e) => e?.code !== 'Enter' && e?.code != null;
    const onNextStep = (e) => {
        if (validateKeydown(e)) {
            return;
        }
        tryUpdateBlock(1);
    };
    const onPreviousStep = (e) => {
        if (validateKeydown(e)) {
            return;
        }
        tryUpdateBlock(-1);
    };
</script>

<ScratchBlock {text} />
<div>
    <span class="pointer">👈</span>
    {#if blocks[index] == null}
        <span class="step">No Steps</span>
    {:else}
        <span class="step">Step {index + 1}/{blocks.length}</span>
    {/if}
    {#if blocks[index - 1] != null}
        <input type="button" value="⏮️ Back" disabled={blocks[index - 1] == null} on:click={onPreviousStep} on:keydown={(e) => onPreviousStep(e)}>
    {/if}
    {#if blocks[index + 1] != null}
        <input type="button" value="Next ⏭️" disabled={blocks[index + 1] == null} on:click={onNextStep} on:keydown={(e) => onNextStep(e)}>
    {/if}
</div>

<style>
    div {
        display: inline-block;
        margin-left: 1em;
    }

    input {
        background-color: white;
        color: black;
        border-radius: 1em;
        border: 1px solid rgba(0, 0, 0, 0.2);
        font-size: 1.5rem;
        padding: 0px 0.5em;
    }

    input:active {
        background-color: #ffbf00;
        color: white;
    }

    .pointer {
        font-size: 2rem;
    }

    .step {
        text-decoration: underline;
    }
</style>