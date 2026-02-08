<script lang="ts">
	import { resolve } from '$app/paths';
	import GitLinks from '$lib/GitLinks.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>
<header>
	<nav aria-label="Main">
		<div>
			<span class="site-title"><a href={resolve('/')}>Open Scratch Guides </a>📓</span>
		</div>
		<ul>
			<li><a href={resolve('/')}>All Projects</a></li>
			<li><a href={resolve('/about')}>About</a></li>
			<li>
				<a
					target="_blank"
					rel="noreferrer"
					href="https://github.com/matthewnoel/scratch-project-guides">Source Code</a
				>
			</li>
			<li><a href={resolve('/submit-project')}>New Guide</a></li>
		</ul>
	</nav>
</header>
{#if data.page === '/submit-project'}
	<main id="main-content">
		{@render children()}
	</main>
{:else}
	<main id="main-content">
		{@render children()}
		<GitLinks page={data.page} />
	</main>
{/if}

<style>
	.skip-link {
		position: absolute;
		left: -9999px;
		top: 0;
		z-index: 100;
		margin: 1em;
		padding: 0.5em 1em;
		background-color: white;
		border: var(--border);
		border-radius: var(--radius-medium);
		box-shadow: var(--shadow-primary);
		color: black !important;
		font-weight: bold;
		text-decoration: none;
	}

	.skip-link:focus {
		left: 0;
	}

	main {
		max-width: 600px;
		margin: auto;
		padding: 0px 0.25em;
		margin-bottom: 1em;
	}

	header {
		color: black;
		background-color: var(--color-primary);
	}

	nav {
		border-bottom: var(--border);
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
	.site-title {
		padding: 1em;
	}

	.site-title {
		font-size: 2rem;
		font-weight: bold;
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

	@media (max-width: 1200px) {
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

		header {
			padding-top: 1em;
		}

		.site-title {
			font-size: 1.5rem;
			margin-bottom: -1em;
		}
	}
</style>
