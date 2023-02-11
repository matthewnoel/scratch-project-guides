<script>
    import { updatePage } from "../router";
</script>

<ul>
    <li>
        <span on:click={() => updatePage('project')} on:keydown={() => updatePage('project')}>Hello World</span>
    </li>
</ul>

<style>
    ul {
        margin: 1em;
    }

    li {
        font-size: 1.5em;
    }
</style>