<script>
    // @ts-nocheck
    import scratchblocks from 'scratchblocks';
    /**
     * @typedef {Object} Props
     * @property {string} [text]
     */

    /** @type {Props} */
    let { text = '' } = $props();
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
    let svg = $derived(getSvg(text));
</script>

{@html svg}