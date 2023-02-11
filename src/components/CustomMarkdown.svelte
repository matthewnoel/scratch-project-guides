<script>
    import Markdown from "./Markdown.svelte";
    import ScratchBlock from "./ScratchBlock.svelte";
    export let source = '';
    const code = '```'
    const sections = source.split(code);

    const isSectionScratchBlock = (section) => {
        return section.startsWith('scratchblocks');
    };
    const transformScratchBlockSection = (section) => {
        return section.slice(section.indexOf('\n'));
    };
</script>

{#each sections as section}
    {#if isSectionScratchBlock(section)}
        <ScratchBlock text={transformScratchBlockSection(section)} />
    {:else}
        <Markdown source={section} />
    {/if}
{/each}