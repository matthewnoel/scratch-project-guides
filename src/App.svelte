<script>
    import About from "./pages/About.svelte";
    import Index from "./pages/Index.svelte";
    import Project from "./pages/Project.svelte";
    import { page, initPage, updatePage } from "./router";
    import config from "./projects/hello-world"; // TODO: parse './projects/hello-world.md' instead
    initPage();
</script>

<div>
    <ul>
        <li on:click={() => updatePage('')} on:keydown={() => updatePage('')}>Projects</li>
        <li on:click={() => updatePage('about')} on:keydown={() => updatePage('about')}>About</li>
    </ul>
</div>
{#if $page === 'about'}
    <About />
{:else if $page === 'project'}
    <Project {config} />
{:else}
    <Index />
{/if}

<style>
    div {
        color: white;
        background-color: black;
    }
</style>