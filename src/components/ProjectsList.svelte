<script>
    import { updatePage } from "../router";

    const handleInternalProjectLink = (event, page, name) => {
        if (event?.code !== 'Enter' && event?.code != null) {
            return;
        }
        updatePage(page, name);
    };
</script>

<h1>All Projects</h1>
<div class="l0">
    <h3>Getting Started</h3>
    <ul>
        <li>
            <a on:click|preventDefault={() => handleInternalProjectLink(null, 'project', 'hello-world')} on:keydown={(e) => handleInternalProjectLink(e, 'project', 'hello-world')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=hello-world">Hello World 👋</a>
        </li>
    </ul>
    <h3>Classic Games</h3>
    <ul>
        <li>
            <a on:click|preventDefault={() => handleInternalProjectLink(null, 'project', 'pong')} on:keydown={(e) => handleInternalProjectLink(e, 'project', 'pong')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=pong">Pong 🏓</a>
        </li>
        <li>
            <a on:click|preventDefault={() => handleInternalProjectLink(null, 'project', 'tic-tac-toe')} on:keydown={(e) => handleInternalProjectLink(e, 'project', 'tic-tac-toe')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=tic-tac-toe">Tic-Tac-Toe #️⃣</a>
        </li>
    </ul>
</div>

<style>
    h1 {
        text-decoration: underline;
    }

    a {
        text-decoration: none;
    }
</style>