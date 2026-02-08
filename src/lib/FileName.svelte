<script lang="ts">
	import { onDestroy } from 'svelte';

	type Props = {
		fileName?: string;
		onChangeComplete?: () => void;
	};

	let { fileName = $bindable(''), onChangeComplete }: Props = $props();

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function toKebabCase(value: string): string {
		return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const cursorPosition = target.selectionStart ?? 0;
		const originalValue = target.value;
		const kebabCaseValue = toKebabCase(originalValue);

		// Calculate new cursor position based on transformation
		const beforeCursor = originalValue.substring(0, cursorPosition);
		const newCursorPosition = toKebabCase(beforeCursor).length;

		fileName = kebabCaseValue;

		// Restore cursor position after Svelte updates the DOM
		requestAnimationFrame(() => {
			target.setSelectionRange(newCursorPosition, newCursorPosition);
		});

		// Debounce the onChangeComplete callback
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		if (onChangeComplete) {
			debounceTimer = setTimeout(() => {
				onChangeComplete();
			}, 1000);
		}
	}

	onDestroy(() => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
	});
</script>

<div class="file-name-container">
	<span>/projects/</span>
	<input
		type="text"
		name="file-name"
		id="file-name"
		aria-label="Project file name"
		placeholder="file-name"
		bind:value={fileName}
		oninput={handleInput}
	/>
	<span>.md</span>
</div>

<style>
	.file-name-container {
		border: var(--border);
		border-radius: var(--radius-medium);
		background: white;
		overflow: hidden;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: fit-content;
	}

	span {
		color: black;
		font-size: 1rem;
		font-weight: 600;
	}

	input[type='text'] {
		outline: none;
		border: var(--border);
		border-radius: var(--radius-small);
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		background: white;
		box-shadow: none;
		transition:
			border-color 0.18s,
			box-shadow 0.18s;
		color: black;
		appearance: none;
	}

	input[type='text']:focus {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-primary);
		background: white;
	}

	input[type='text']::placeholder {
		color: var(--color-grey-text);
		opacity: 1;
		font-weight: 400;
	}
</style>
