<script>
	import { resolve } from '$app/paths';
	import { groupedProjects } from '$lib/projects';
</script>

<svelte:head>
	<title>Scratch Project Guides</title>
	<meta name="description" content="Guides for Scratch projects" />
</svelte:head>

<h1>All Projects</h1>
<div class="l0">
	{#each groupedProjects as group (group)}
		<h2>{group.folder}</h2>
		<ul>
			{#each group.projects as project (project)}
				<li>
					<a href={resolve(`/projects/${project.slug}`)}>{project.title}</a>
				</li>
			{/each}
		</ul>
	{/each}
</div>

<style>
	h1 {
		text-decoration: underline;
	}

	h2 {
		font-style: normal;
		color: inherit;
	}

	a {
		text-decoration: none;
	}
</style>
