<script>
// @ts-nocheck

    import GitLinks from "$lib/components/GitLinks.svelte";
    import CustomMarkdown from '$lib/components/CustomMarkdown.svelte';
    import HelloWorld from '$lib/projects/hello-world.md';
    import Pong from '$lib/projects/pong.md';
    import TicTacToe from '$lib/projects/tic-tac-toe.md'
    import MathQuiz from '$lib/projects/math-quiz.md';
    import FibonacciSequence from '$lib/projects/fibonacci-sequence.md';
    import { projectName } from "../router";
    let source = $derived(() => {
        switch ($projectName) {
            case 'hello-world':
                return HelloWorld;
            case 'pong':
                return Pong;
            case 'tic-tac-toe':
                return TicTacToe;
            case 'math-quiz':
                return MathQuiz;
            case 'fibonacci-sequence':
                return FibonacciSequence;
            default:
                return '';
        }
    })
</script>

<div class="l0">
    {#if source() === ''}
        <h1>Oh no!</h1>
        <p>This project does not exist.</p>
    {:else}
        <CustomMarkdown source={source()} />
    {/if}
</div>
<GitLinks page={"blob/main/src/pages/Project.svelte"} />
