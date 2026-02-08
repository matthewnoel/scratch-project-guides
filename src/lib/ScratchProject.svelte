<script>
	let { id } = $props();
</script>

<figure>
	<figcaption>Demo The Project 👇</figcaption>
	<iframe
		title="Project Demo"
		src={`https://scratch.mit.edu/projects/${id}/embed`}
		allowtransparency={true}
		width="485"
		height="402"
		frameborder="0"
		scrolling="no"
		allowfullscreen
	></iframe>
	<a href={`https://scratch.mit.edu/projects/${id}`} target="_blank" rel="noreferrer"
		>View on scratch.mit.edu
	</a>
</figure>

<style>
	figcaption {
		text-align: center;
		font-size: 1.6rem;
		font-weight: bold;
		margin: 0.2em 0px;
	}

	figure {
		width: fit-content;
		margin: auto;
		border: var(--border);
		border-radius: var(--radius-medium);
		padding: 0.25em;
	}

	a {
		display: block;
		text-align: center;
		font-size: 1rem;
	}
</style>
