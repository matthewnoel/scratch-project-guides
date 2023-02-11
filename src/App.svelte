<script>
    import About from "./pages/About.svelte";
    import Index from "./pages/Index.svelte";
    import Project from "./pages/Project.svelte";
    import { page, initPage, updatePage } from "./router";
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
    <Project />
{:else}
    <Index />
{/if}

<style>
    div {
        color: white;
        background-color: black;
    }
</style>