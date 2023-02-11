<script>
    import scratchblocks from 'scratchblocks';
    export let text = '';
    const doc = scratchblocks.parse(text, {
        languages: ['en'],
    });
    const view = scratchblocks.newView(doc, {
        style: 'scratch3',
        scale: 0.675,
    });
    const svg = view.render();
</script>

{@html svg.outerHTML}