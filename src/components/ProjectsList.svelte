<script>
    import { updatePage } from "../router";
</script>

<ul>
    <li>
        <span on:click={() => updatePage('project')} on:keydown={() => updatePage('project')}>Hello World</span>
    </li>
</ul>
