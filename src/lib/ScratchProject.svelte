<script>
    let { id } = $props();
</script>

<h4>Demo The Project 👇</h4>
<div>
    <iframe title="Project Demo" src={`https://scratch.mit.edu/projects/${id}/embed`} allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>
    <a href={`https://scratch.mit.edu/projects/${id}`} target="_blank" rel="noreferrer">View on scratch.mit.edu </a>
</div>

<style>
    h4 {
        text-align: center;
    }
    div {
        width: fit-content;
        margin: auto;
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 0.25em;
        padding: 0.25em;
    }

    a {
        display: block;
        text-align: center;
        font-size: 1rem;
    }
</style>
