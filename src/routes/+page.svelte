<script>
	import { base } from '$app/paths';
	import { groupedProjects } from '$lib/projects';
</script>

<svelte:head>
	<title>Scratch Project Guides</title>
	<meta name="description" content="Guides for Scratch projects" />
</svelte:head>

<h1>All Projects</h1>
<div class="l0">
	{#each groupedProjects as group (group)}
		<h3>{group.folder}</h3>
		<ul>
			{#each group.projects as project (project)}}
				<li>
					<a href={`${base}/projects/${project.slug}`}>{project.title}</a>
				</li>
			{/each}
		</ul>
	{/each}
</div>

<style>
	h1 {
		text-decoration: underline;
	}

	a {
		text-decoration: none;
	}
</style>
