<script>
    import { updatePage } from "../router";
</script>

<div class="l0">
    <ul>
        <li>
            <span on:click={() => updatePage('project')} on:keydown={() => updatePage('project')}>Hello World</span>
        </li>
    </ul>
</div>
