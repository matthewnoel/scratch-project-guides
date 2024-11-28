<script>
    // @ts-nocheck
    import MarkdownIt from 'markdown-it';
    /**
     * @typedef {Object} Props
     * @property {string} [source]
     */

    /** @type {Props} */
    let { source = '' } = $props();
    const getHtml = (source) => {
        const markdownIt = new MarkdownIt();
        return markdownIt.render(source);
    };
    let html = $derived(getHtml(source));
</script>

<div>
    {@html html}
</div>