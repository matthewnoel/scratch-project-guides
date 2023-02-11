<script>
    import scratchblocks from 'scratchblocks';
    const script = `
        when green flag clicked
        move (4) steps
    `;
    const doc = scratchblocks.parse(script, {
        languages: ['en'],
    });
    const view = scratchblocks.newView(doc, {
        style: 'scratch3',
        scale: 0.675,
    });
    const svg = view.render();
</script>

<h1>App</h1>
<h2>Guide</h2>
{@html svg.outerHTML}

<style>
    h2 {
        color: red;
    }
</style>