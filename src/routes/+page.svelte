<script>
    import { projects } from "$lib/projects";
</script>
<h1>All Projects</h1>
<div class="l0">
    <h3>Auto Generated</h3>
    <ul>
        {#each Object.entries(projects) as [key, value]}
            <li>
                <a href={`/projects/${key}`}>{value.title}</a>
            </li>
        {/each}
    </ul>
</div>

<style>
    h1 {
        text-decoration: underline;
    }

    a {
        text-decoration: none;
    }

    i {
        color: gray;
    }
</style>
