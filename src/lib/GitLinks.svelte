<script>
	let { page } = $props();
</script>

<div class="outer">
	<div class="inner">
		<span
			><a
				target="_blank"
				rel="noreferrer"
				href="https://github.com/matthewnoel/scratch-project-guides/issues/new">Give Feedback</a
			> ✏️</span
		>
	</div>
	<div class="inner">
		{#if page == null}
			<span
				><a
					target="_blank"
					rel="noreferrer"
					href="https://github.com/matthewnoel/scratch-project-guides">Edit on GitHub</a
				> 🐙</span
			>
		{:else}
			<span
				><a
					target="_blank"
					rel="noreferrer"
					href={`https://github.com/matthewnoel/scratch-project-guides/blob/main/src/routes${page === '/' ? '' : page}/+page.svelte`}
					>Edit this page on GitHub</a
				> 🐙</span
			>
		{/if}
	</div>
</div>

<style>
	.outer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.inner {
		font-size: 0.9rem;
		background-color: white;
		border: var(--border);
		border-radius: 1em;
		padding: 0.25em 1em;
	}

	@media (max-width: 500px) {
		.outer {
			margin-top: -0.5em;
		}

		.inner {
			width: 100%;
			margin-bottom: 0.5em;
			text-align: center;
		}
	}

	a {
		vertical-align: middle;
	}

	span {
		vertical-align: middle;
	}
</style>
