<script lang="ts">
	import CustomMarkdown from '$lib/CustomMarkdown.svelte';
	import SubmitProjectModal from '$lib/SubmitProjectModal.svelte';
	import Button from '$lib/Button.svelte';

	const defaultMarkdown = `# New Scratch Project

Write a short description of your project here.

## Materials
- Scratch (scratch.mit.edu)
- A computer with a keyboard and mouse

## Steps
1. Open Scratch and click Create.
2. Add your first sprite.
3. Drag blocks to build your project.

## Scratch Project Link
https://scratch.mit.edu/projects/123456789/

## Scratch Blocks
\`\`\`scratchblocks
when green flag clicked
move (10) steps
\`\`\`
`;

	let markdown = $state(defaultMarkdown);
	let isModalOpen = $state(false);

	const previewSource = $derived(markdown);

	const openModal = () => {
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};
</script>

<section class="editor">
	<header class="editor__header">
		<div>
			<h1>Submit a Guide</h1>
			<p>Draft your guide on the left. Preview the final layout on the right.</p>
		</div>
		<div class="editor__actions">
			<Button variant="emphasis" size="large" onclick={openModal}>Submit My Project</Button>
		</div>
	</header>

	<div class="editor__panes">
		<div class="pane pane--input">
			<div class="pane__title">Markdown</div>
			<textarea
				bind:value={markdown}
				spellcheck="true"
				class="editor__textarea"
				aria-label="Markdown editor"
			></textarea>
		</div>
		<div class="pane pane--preview">
			<div class="pane__title">Preview</div>
			<div class="editor__preview" aria-label="Markdown preview">
				<CustomMarkdown source={previewSource} />
			</div>
		</div>
	</div>
</section>

<SubmitProjectModal open={isModalOpen} {markdown} onClose={closeModal} />

<style>
	.editor {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		height: 100%;
		box-sizing: border-box;
	}

	.editor__header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.editor__header h1 {
		margin: 0 0 0.25rem;
	}

	.editor__header p {
		margin: 0;
		color: #444;
	}

	.editor__actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.editor__panes {
		display: grid;
		grid-template-columns: minmax(300px, 1fr) minmax(320px, 1.1fr);
		gap: 1.5rem;
		flex: 1;
	}

	.pane {
		display: flex;
		flex-direction: column;
		min-height: 0;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 12px;
		background: white;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.pane__title {
		padding: 0.75rem 1rem;
		font-weight: 600;
		background: #f8f8f8;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}

	.editor__textarea {
		flex: 1;
		min-height: 400px;
		padding: 1rem;
		border: 0;
		resize: none;
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 0.95rem;
		line-height: 1.5;
		outline: none;
	}

	.editor__preview {
		flex: 1;
		overflow: auto;
		padding: 1rem 1.25rem 2rem;
	}

	@media (max-width: 960px) {
		.editor {
			padding: 1rem;
		}

		.editor__panes {
			grid-template-columns: 1fr;
		}

		.editor__actions {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>
