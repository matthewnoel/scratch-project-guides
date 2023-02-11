<script>
    import ScratchBlock from "./ScratchBlock.svelte";
    import ScratchBlockSteps from "./ScratchBlockSteps.svelte";
    export let config;
</script>

{#each config as { type, data }}
    {#if type === 0}
        <p>{data}</p>
    {:else if type === 1}
        <ScratchBlock text={data} />
    {:else if type === 2}
        <ScratchBlockSteps blocks={data} />
    {/if}
{/each}