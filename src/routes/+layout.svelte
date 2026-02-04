<script lang="ts">
	import { resolve } from '$app/paths';
	import GitLinks from '$lib/GitLinks.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<nav>
	<div>
		<h6><a href={resolve('/')}>Open Scratch Guides </a>📓</h6>
	</div>
	<ul>
		<li><a href={resolve('/')}>All Projects</a></li>
		<li><a href={resolve('/about')}>About</a></li>
		<li>
			<a target="_blank" rel="noreferrer" href="https://github.com/matthewnoel/scratch-project-guides"
				>GitHub</a
			>
		</li>
	</ul>
</nav>
<main>
	{@render children()}
	<GitLinks page={data.page} />
</main>

<style>
	main {
		max-width: 600px;
		margin: auto;
		padding: 0px 0.25em;
		margin-bottom: 1em;
	}

	nav {
		color: black;
		background-color: #ffbf00;
		border-bottom: 1px solid rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}

	ul {
		list-style: none;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	li,
	h6 {
		padding: 1em;
	}

	li {
		white-space: nowrap;
	}

	a,
	a:visited {
		color: inherit;
		text-decoration: none;
	}

	a:hover,
	a:focus {
		color: white;
		cursor: pointer;
		text-decoration: underline;
	}

	@media (max-width: 1000px) {
		div,
		ul {
			margin: auto;
			text-align: center;
		}

		ul {
			padding: 0;
			width: 100%;
			justify-content: center;
		}
	}
</style>
