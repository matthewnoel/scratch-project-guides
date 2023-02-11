<script>
    import About from "./pages/About.svelte";
    import Index from "./pages/Index.svelte";
    import Project from "./pages/Project.svelte";
    import { page, initPage, updatePage } from "./router";
    initPage();
</script>

<nav>
    <ul>
        <li on:click={() => updatePage('')} on:keydown={() => updatePage('')}>Projects</li>
        <li on:click={() => updatePage('about')} on:keydown={() => updatePage('about')}>About</li>
    </ul>
</nav>
{#if $page === 'about'}
    <About />
{:else if $page === 'project'}
    <Project />
{:else}
    <Index />
{/if}

<style>
    nav {
        color: black;
        background-color: #ffbf00;
    }

    ul {
        list-style: none;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    li {
        font-size: 1.5em;
        padding: 1em;
    }
</style>