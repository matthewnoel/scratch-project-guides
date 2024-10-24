<script>
    import { preventDefault } from 'svelte/legacy';

    import About from "./pages/About.svelte";
    import Index from "./pages/Index.svelte";
    import Project from "./pages/Project.svelte";
    import { page, initPage, updatePage } from "./router";
    initPage();
    const handleInternalHeaderLink = (event, page) => {
        if (event?.code !== 'Enter' && event?.code != null) {
            return;
        }
        updatePage(page);
    };
</script>

<nav>
    <div>
        <h6><a onclick={preventDefault(() => handleInternalHeaderLink(null, ''))} onkeydown={(e) => handleInternalHeaderLink(e, '')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=">Open Scratch Guides </a>📓</h6>
    </div>
    <ul>
        <li><a onclick={preventDefault(() => handleInternalHeaderLink(null, ''))} onkeydown={(e) => handleInternalHeaderLink(e, '')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=">All Projects</a></li>
        <li><a onclick={preventDefault(() => handleInternalHeaderLink(null, 'about'))} onkeydown={(e) => handleInternalHeaderLink(e, 'about')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=about">About</a></li>
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

    li, h6 {
        padding: 1em;
    }

    li {
        white-space: nowrap;
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

    @media (max-width: 1000px) {
        div, ul {
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