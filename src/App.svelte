<script>
    import ScratchBlockSteps from "./components/ScratchBlockSteps.svelte";

    const blocks = [`
        when green flag clicked
        move (16) steps
    `,
    `
        when green flag clicked
        move (32) steps
    `,
    `
        when green flag clicked
        move (64) steps
    `];
</script>

<h1>App</h1>
<h2>Guide</h2>
<ScratchBlockSteps {blocks} />

<style>
    h2 {
        color: red;
    }
</style>