<script>
    import scratchblocks from 'scratchblocks';
    export let text = '';
    const getSvg = (text) => {
        const doc = scratchblocks.parse(text, {
            languages: ['en'],
        });
        const view = scratchblocks.newView(doc, {
            style: 'scratch3',
            scale: 0.675,
        });
        return view.render().outerHTML;
    };
    $: svg = getSvg(text);
</script>

{@html svg}