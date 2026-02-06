<script lang="ts">
	import Button from '$lib/Button.svelte';
	import FileInput from '$lib/FileInput.svelte';
	import Modal from '$lib/Modal.svelte';

	type Props = {
		onRead: (text: string) => void;
	};

	let { onRead }: Props = $props();

	let isModalOpen = $state(false);
	let isOcrRunning = $state(false);
	let ocrProgress = $state(0);
	let ocrStatus = $state('');
	let ocrError = $state('');
	let ocrFileName = $state('');
	let fileResetSignal = $state(0);

	const modalTitleId = 'ocr-modal-title';
	const modalDescriptionId = 'ocr-modal-description';

	const resetOcrState = () => {
		ocrProgress = 0;
		ocrStatus = '';
		ocrError = '';
		ocrFileName = '';
		fileResetSignal += 1;
	};

	const openModal = () => {
		resetOcrState();
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};

	const runOcrWithFile = async (file: File) => {
		if (!file.type.startsWith('image/')) {
			ocrError = 'Please upload an image file.';
			ocrStatus = '';
			ocrProgress = 0;
			return;
		}

		ocrFileName = file.name;
		ocrError = '';
		ocrStatus = 'Starting OCR...';
		ocrProgress = 0;
		isOcrRunning = true;

		try {
			const { recognize } = await import('tesseract.js');
			const result = await recognize(file, 'eng', {
				logger: (message: { status?: string; progress?: number }) => {
					if (typeof message.progress === 'number') {
						ocrProgress = Math.round(message.progress * 100);
					}
					if (message.status) {
						ocrStatus = message.status;
					}
				}
			});

			const detectedText = result.data.text ?? '';
			if (!detectedText.trim()) {
				ocrError = 'No text was detected in the image.';
				ocrStatus = '';
			} else {
				onRead(detectedText);
				ocrStatus = 'OCR complete.';
				ocrProgress = 100;
				closeModal();
			}
		} catch (error) {
			ocrError = error instanceof Error ? error.message : 'OCR failed.';
			ocrStatus = '';
		} finally {
			isOcrRunning = false;
			fileResetSignal += 1;
		}
	};
</script>

<button class="ocr-trigger" onclick={openModal} aria-label="Import text from an image">👀</button>

{#snippet closeAction()}
	<Button variant="standard" type="button" onclick={closeModal} disabled={isOcrRunning}>
		Close
	</Button>
{/snippet}

<Modal
	open={isModalOpen}
	labelledBy={modalTitleId}
	describedBy={modalDescriptionId}
	showClose
	onClose={closeModal}
	actions={[closeAction]}
>
	<header>
		<h4 id={modalTitleId}>Import text from an image</h4>
	</header>
	<p id={modalDescriptionId}>
		Upload a screenshot or photo and we will append the detected text to your markdown.
	</p>
	<div class="ocr-modal__controls">
		<FileInput
			accept="image/*"
			disabled={isOcrRunning}
			onFileSelect={runOcrWithFile}
			ariaLabel="Upload an image for OCR"
			dropzoneLabel="Click or drag an image here"
			resetSignal={fileResetSignal}
		/>
		<div class="ocr-modal__status" aria-live="polite">
			{#if isOcrRunning}
				<span>Processing... {ocrProgress}%</span>
			{:else if ocrStatus}
				<span>{ocrStatus}</span>
			{:else if ocrFileName}
				<span>Last file: {ocrFileName}</span>
			{/if}
			{#if ocrError}
				<span class="ocr-modal__error">{ocrError}</span>
			{/if}
		</div>
	</div>
</Modal>

<style>
	.ocr-trigger {
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 12px;
		background: white;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		padding: 0 1.25rem;
		font-size: 1.5rem;
		cursor: pointer;
		transition: background-color 0.18s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ocr-trigger:hover,
	.ocr-trigger:focus {
		background-color: #f8f8f8;
	}

	.ocr-modal__controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.ocr-modal__status {
		font-size: 0.85rem;
		color: #555;
	}

	.ocr-modal__error {
		color: #b42318;
	}
</style>
