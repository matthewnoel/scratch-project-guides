<script>
    import Markdown from "./Markdown.svelte";
    import ScratchBlock from "./ScratchBlock.svelte";
    import ScratchBlockSteps from "./ScratchBlockSteps.svelte";
    export let source = '';
    const code = '```'
    const sections = source.split(code);

    const isSectionScratchBlock = (section) => {
        return section.startsWith('scratchblocks');
    };
    const getStepRange = (section) => {
        const str = section.slice(0, section.indexOf('\n'));
        const token = str.slice(str.indexOf('[') + 1, str.indexOf(']'));
        return (token === '*') ? 0 : parseInt(token, 10);
    };
    const hasSteps = (section) => {
        const range = getStepRange(section);
        return !isNaN(parseInt(range, 10));
    };
    const transformScratchBlockSection = (section) => {
        return section.slice(section.indexOf('\n'));
    };
    const transformStepSection = (section) => {
        // TODO: how does this handle nests with 'end'?
        return section.slice(section.indexOf('\n')).split('\n').filter(x => x.length !== 0).map((element, index, array) => array.slice(0, index + 1).join('\n'));
    };
</script>

{#each sections as section}
    {#if isSectionScratchBlock(section)}
        {#if hasSteps(section)}
            <ScratchBlockSteps blocks={transformStepSection(section)} start={getStepRange(section)} />
        {:else}
            <ScratchBlock text={transformScratchBlockSection(section)} />
        {/if}
    {:else}
        <Markdown source={section} />
    {/if}
{/each}