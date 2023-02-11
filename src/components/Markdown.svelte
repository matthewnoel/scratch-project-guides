<script>
    import MarkdownIt from 'markdown-it';
    export let source = '';
    const getHtml = (source) => {
        const markdownIt = new MarkdownIt();
        return markdownIt.render(source);
    };
    $: html = getHtml(source);
</script>

<div>
    {@html html}
</div>