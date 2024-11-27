<script>
    import CustomMarkdown from "$lib/CustomMarkdown.svelte";
	import GitLinks from "$lib/GitLinks.svelte";
    // @ts-ignore
    import MathQuiz from '$lib/projects/math-quiz.md';
</script>

<div class="l0">
    <CustomMarkdown source={MathQuiz} />
</div>
<GitLinks page={"blob/main/src/pages/Project.svelte"} />
