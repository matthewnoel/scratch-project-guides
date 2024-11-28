<script>
    import { onMount } from 'svelte';
    /**
     * @typedef {Object} Props
     * @property {string} [text]
     */

    /** @type {Props} */
    let { text = '' } = $props();
    let svg = $state(null);
    onMount(async () => {
        // @ts-ignore
        const module = await import('scratchblocks');
        const scratchblocks = module.default;
        const doc = scratchblocks.parse(text, {
            languages: ['en'],
        });
        const view = scratchblocks.newView(doc, {
            style: 'scratch3',
            scale: 0.675,
        });
        svg = view.render().outerHTML;
    });
</script>

{@html svg}
