<script>
    import GitLinks from "../components/GitLinks.svelte";
    import CustomMarkdown from '../components/CustomMarkdown.svelte';
    import HelloWorld from '../projects/hello-world.md';
    import Pong from '../projects/pong.md';
    import TicTacToe from '../projects/tic-tac-toe.md'
    import MathQuiz from '../projects/math-quiz.md';
    import FibonacciSequence from '../projects/fibonacci-sequence.md';
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
