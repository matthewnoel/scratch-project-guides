<script>
    import CustomMarkdown from "$lib/CustomMarkdown.svelte";
    // @ts-ignore
    import MathQuiz from '$lib/projects/math-quiz.md?raw';
</script>

<div class="l0">
    <CustomMarkdown source={MathQuiz} />
</div>
