<script>
    import { groupedProjects } from "$lib/projects";
</script>
<h1>All Projects</h1>
<div class="l0">    
    {#each groupedProjects as group}
        <h3>{group.folder}</h3>
        <ul>
            {#each group.projects as project}
                <li>
                    <a href={`/projects/${project.slug}`}>{project.title}</a>
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
