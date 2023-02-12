<script>
    import About from "./pages/About.svelte";
    import Index from "./pages/Index.svelte";
    import Project from "./pages/Project.svelte";
    import { page, initPage, updatePage } from "./router";
    initPage();
</script>

<nav>
    <h6>Open Scratch Lesson Plans 📓</h6>
    <ul>
        <li><a on:click|preventDefault={() => updatePage('')} on:keydown={() => updatePage('')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=">All Projects</a></li>
        <li><a on:click|preventDefault={() => updatePage('about')} on:keydown={() => updatePage('about')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=about">About</a></li>
        <li><a target="_blank" rel="noreferrer" href="https://github.com/matthewnoel/scratch-lesson-plans">GitHub</a></li>
    </ul>
</nav>
<main>
    {#if $page === 'about'}
        <About />
    {:else if $page === 'project'}
        <Project />
    {:else}
        <Index />
    {/if}
</main>

<style>
    main {
        max-width: 600px;
        margin: auto;
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
    }

    li, h6 {
        padding: 1em;
    }

    a, a:visited {
        color: inherit;
        text-decoration: none;
    }

    a:hover, a:focus {
        color: white;
        cursor: pointer;
        text-decoration: underline;
    }
</style>