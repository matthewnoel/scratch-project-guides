<script lang="ts">
	type Props = {
		onFileSelect: (file: File) => void | Promise<void>;
		disabled?: boolean;
		accept?: string;
		ariaLabel?: string;
		dropzoneLabel?: string;
		resetSignal?: number;
	};

	let {
		onFileSelect,
		disabled = false,
		accept = 'image/*',
		ariaLabel = 'Upload a file',
		dropzoneLabel = 'Click or drag a file here',
		resetSignal = 0
	}: Props = $props();

	let isDragActive = $state(false);
	let fileInput: HTMLInputElement | null = null;

	const handleFileChange = async (event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		if (!input.files?.length) {
			return;
		}

		await onFileSelect(input.files[0]);
	};

	const handleDrop = async (event: DragEvent) => {
		event.preventDefault();
		if (disabled) {
			return;
		}

		isDragActive = false;
		const file = event.dataTransfer?.files?.[0];
		if (!file) {
			return;
		}

		await onFileSelect(file);
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (!disabled) {
			isDragActive = true;
		}
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		if (
			event.currentTarget instanceof HTMLElement &&
			event.relatedTarget instanceof Node &&
			event.currentTarget.contains(event.relatedTarget)
		) {
			return;
		}

		isDragActive = false;
	};

	const handleDragEnter = (event: DragEvent) => {
		event.preventDefault();
		if (!disabled) {
			isDragActive = true;
		}
	};

	const triggerFilePicker = () => {
		if (!disabled) {
			fileInput?.click();
		}
	};

	$effect(() => {
		if (fileInput && resetSignal >= 0) {
			fileInput.value = '';
		}
	});
</script>

<input
	bind:this={fileInput}
	type="file"
	{accept}
	onchange={handleFileChange}
	{disabled}
	aria-label={ariaLabel}
	class="file-input"
/>
<div
	class="dropzone"
	class:is-dragging={isDragActive}
	role="button"
	tabindex={disabled ? -1 : 0}
	aria-disabled={disabled}
	aria-label={ariaLabel}
	onclick={triggerFilePicker}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			triggerFilePicker();
		}
	}}
	ondragenter={handleDragEnter}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<span>{dropzoneLabel}</span>
</div>

<style>
	.file-input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.dropzone {
		border: 2px dashed rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-medium);
		padding: 1rem;
		text-align: center;
		font-size: 0.95rem;
		color: var(--color-grey-text);
		background: var(--color-grey-background);
		cursor: pointer;
		transition:
			border-color 0.18s,
			background-color 0.18s,
			box-shadow 0.18s;
	}

	.dropzone:hover,
	.dropzone:focus-visible {
		border-color: rgba(0, 0, 0, 0.4);
		background: white;
		outline: none;
	}

	.dropzone.is-dragging {
		border-color: var(--color-primary);
		background: rgba(255, 191, 0, 0.15);
		box-shadow: 0 0 0 3px rgba(255, 191, 0, 0.15);
	}

	.dropzone[aria-disabled='true'] {
		cursor: not-allowed;
		opacity: 0.6;
	}
</style>
