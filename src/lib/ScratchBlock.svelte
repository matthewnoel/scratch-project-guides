<script>
    /**
     * @typedef {Object} Props
     * @property {string} [text]
     */

    /** @type {Props} */
    let { text = '' } = $props();
    let svg = $state(null);
    export async function onMount() {
        // @ts-ignore
        const scratchblocks = await import('scratchblocks');
        const doc = scratchblocks.parse(text, {
            languages: ['en'],
        });
        const view = scratchblocks.newView(doc, {
            style: 'scratch3',
            scale: 0.675,
        });
        svg = view.render().outerHTML;
    }
</script>

{@html svg}