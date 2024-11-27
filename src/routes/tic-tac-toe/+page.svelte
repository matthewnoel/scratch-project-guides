<script>
    import CustomMarkdown from "$lib/CustomMarkdown.svelte";
    // @ts-ignore
    import TicTacToe from '$lib/projects/tic-tac-toe.md?raw';
</script>

<div class="l0">
    <CustomMarkdown source={TicTacToe} />
</div>
