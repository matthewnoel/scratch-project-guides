<script>
    import ScratchBlock from './components/ScratchBlock.svelte';

    const text = `
        when green flag clicked
        move (16) steps
    `;
</script>

<h1>App</h1>
<h2>Guide</h2>
<ScratchBlock {text} />

<style>
    h2 {
        color: red;
    }
</style>