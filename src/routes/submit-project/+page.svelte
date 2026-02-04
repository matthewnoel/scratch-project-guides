<script lang="ts">
	import { onDestroy } from 'svelte';
	import CustomMarkdown from '$lib/CustomMarkdown.svelte';

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
	let copyStatus = $state('');
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;

	const previewSource = $derived(markdown);

	const copyToClipboard = async () => {
		const text = markdown;
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(text);
			} else {
				const textarea = document.createElement('textarea');
				textarea.value = text;
				textarea.setAttribute('readonly', 'true');
				textarea.style.position = 'absolute';
				textarea.style.left = '-9999px';
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			}
			copyStatus = 'Copied!';
		} catch {
			copyStatus = 'Copy failed. Please try again.';
		}

		if (copyTimeout) {
			clearTimeout(copyTimeout);
		}
		copyTimeout = setTimeout(() => {
			copyStatus = '';
		}, 2000);
	};

	onDestroy(() => {
		if (copyTimeout) {
			clearTimeout(copyTimeout);
		}
	});
</script>

<section class="editor">
	<header class="editor__header">
		<div>
			<h1>Submit a Project</h1>
			<p>Draft your guide on the left. Preview the final layout on the right.</p>
		</div>
		<div class="editor__actions">
			<button class="copy-button" type="button" onclick={copyToClipboard}> Copy Markdown </button>
			{#if copyStatus}
				<span class="copy-status" aria-live="polite">{copyStatus}</span>
			{/if}
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

<style>
	:global(main) {
		max-width: none;
		padding: 0;
		margin: 0;
	}

	.editor {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		min-height: calc(100vh - 80px);
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

	.copy-button {
		border: 0;
		border-radius: 999px;
		background: #ffbf00;
		color: #111;
		font-weight: 600;
		padding: 0.6rem 1.2rem;
		cursor: pointer;
	}

	.copy-button:hover,
	.copy-button:focus {
		background: #ffcf33;
	}

	.copy-status {
		font-size: 0.9rem;
		color: #1a7f37;
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

		.copy-button {
			width: 100%;
		}

		.editor__actions {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>
