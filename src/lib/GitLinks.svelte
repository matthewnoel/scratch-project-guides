<script>
    let { page } = $props();
</script>

<div class="outer">
    <div class="inner">
        <span><a target="_blank" rel="noreferrer" href="https://github.com/matthewnoel/scratch-lesson-plans/issues/new">Give Feedback</a> ✏️</span>
    </div>
    <div class="inner">
        {#if page == null}
            <span><a target="_blank" rel="noreferrer" href="https://github.com/matthewnoel/scratch-lesson-plans">Edit on GitHub</a> 🐙</span>
        {:else}
            <span><a target="_blank" rel="noreferrer" href={`https://github.com/matthewnoel/scratch-lesson-plans/${page}`}>Edit this page on GitHub</a> 🐙</span>
        {/if}
    </div>
</div>

<style>
    .outer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;

    }

    .inner {
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 0.4em;
        padding: 0.25em 0.5em;
    }

    @media (max-width: 500px) {
        .inner {
            margin: auto;
        }
    }

    a {
        font-size: 0.9rem;
        vertical-align: middle;
    }

    span {
        vertical-align: middle;
    }
</style>