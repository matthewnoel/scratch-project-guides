<script>
    import ProjectConfig from "./components/ProjectConfig.svelte";
    import config from "./projects/hello-world";
</script>

<h1>App</h1>
<h2>Guide</h2>
<ProjectConfig {config} />

<style>
    h2 {
        color: red;
    }
</style>