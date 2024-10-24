<script>
    import { preventDefault } from 'svelte/legacy';

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
            <a onclick={preventDefault(() => handleInternalProjectLink(null, 'project', 'hello-world'))} onkeydown={(e) => handleInternalProjectLink(e, 'project', 'hello-world')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=hello-world">Hello World 👋</a>
        </li>
    </ul>
    <h3>Educational</h3>
    <ul>
        <li>
            <a onclick={preventDefault(() => handleInternalProjectLink(null, 'project', 'math-quiz'))} onkeydown={(e) => handleInternalProjectLink(e, 'project', 'math-quiz')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=math-quiz">Math Quiz 🧮</a>
        </li>
        <li>
            <a onclick={preventDefault(() => handleInternalProjectLink(null, 'project', 'fibonacci-sequence'))} onkeydown={(e) => handleInternalProjectLink(e, 'project', 'fibonacci-sequence')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=fibonacci-sequence">Fibonacci Sequence 🐚</a>
        </li>
    </ul>
    <h3>Games</h3>
    <ul>
        <li>
            <a onclick={preventDefault(() => handleInternalProjectLink(null, 'project', 'pong'))} onkeydown={(e) => handleInternalProjectLink(e, 'project', 'pong')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=pong">Pong 🏓 <i>~ In Progress</i></a>
        </li>
        <li>
            <a onclick={preventDefault(() => handleInternalProjectLink(null, 'project', 'tic-tac-toe'))} onkeydown={(e) => handleInternalProjectLink(e, 'project', 'tic-tac-toe')} href="https://matthewnoel.github.io/scratch-lesson-plans/?page=project&name=tic-tac-toe">Tic-Tac-Toe #️⃣ <i>~ Coming Soon</i></a>
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

    i {
        color: gray;
    }
</style>