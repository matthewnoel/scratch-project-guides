<script>
    import { updatePage } from "../router";
</script>

<h1>All Projects</h1>
<div class="l0">
    <h3>Getting Started</h3>
    <ul>
        <li>
            <span on:click={() => updatePage('project')} on:keydown={() => updatePage('project')}>Hello World 👋</span>
        </li>
    </ul>
    <h3>Classic Games</h3>
    <ul>
        <li>
            <span on:click={() => updatePage('project')} on:keydown={() => updatePage('project')}>Pong 🏓</span>
        </li>
        <li>
            <span on:click={() => updatePage('project')} on:keydown={() => updatePage('project')}>Tic-Tac-Toe #️⃣</span>
        </li>
    </ul>
</div>

<style>
    h1 {
        text-decoration: underline;
    }
</style>