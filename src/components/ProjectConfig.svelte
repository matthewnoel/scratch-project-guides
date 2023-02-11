<script>
    import CustomMarkdown from './CustomMarkdown.svelte';
    import source from '../projects/hello-world.md';
    import ScratchBlockSteps from './ScratchBlockSteps.svelte';
    import Markdown from './Markdown.svelte';

    const md = `### Recap`;
    const blocks = [
        'when green flag clicked',
        `when green flag clicked
        say [Hello World!]`
    ];
</script>

<CustomMarkdown {source} />
<Markdown source={md} />
<ScratchBlockSteps {blocks} />