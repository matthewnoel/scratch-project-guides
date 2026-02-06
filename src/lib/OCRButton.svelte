<script lang="ts">
	type Props = {
		onRead: (text: string) => void;
	};

	let { onRead }: Props = $props();

	let isOcrRunning = $state(false);
	let ocrProgress = $state(0);
	let ocrStatus = $state('');
	let ocrError = $state('');
	let ocrFileName = $state('');

	const handleOcrFileChange = async (event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		if (!input.files?.length) {
			return;
		}

		const file = input.files[0];
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
			}
		} catch (error) {
			ocrError = error instanceof Error ? error.message : 'OCR failed.';
			ocrStatus = '';
		} finally {
			isOcrRunning = false;
			input.value = '';
		}
	};
</script>

<div class="ocr-row">
	<div>
		<div class="ocr-row__title">Import text from an image</div>
		<div class="ocr-row__subtitle">
			Upload a screenshot or photo and we will append the detected text to your markdown.
		</div>
	</div>
	<div class="ocr-row__controls">
		<input
			type="file"
			accept="image/*"
			onchange={handleOcrFileChange}
			disabled={isOcrRunning}
			aria-label="Upload an image for OCR"
		/>
		<div class="ocr-row__status" aria-live="polite">
			{#if isOcrRunning}
				<span>Processing... {ocrProgress}%</span>
			{:else if ocrStatus}
				<span>{ocrStatus}</span>
			{:else if ocrFileName}
				<span>Last file: {ocrFileName}</span>
			{/if}
			{#if ocrError}
				<span class="ocr-row__error">{ocrError}</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.ocr-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		background: #fdfdfd;
	}

	.ocr-row__title {
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.ocr-row__subtitle {
		color: #555;
		max-width: 480px;
	}

	.ocr-row__controls {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.4rem;
	}

	.ocr-row__status {
		font-size: 0.85rem;
		color: #555;
	}

	.ocr-row__error {
		color: #b42318;
	}

	@media (max-width: 960px) {
		.ocr-row {
			flex-direction: column;
			align-items: flex-start;
		}

		.ocr-row__controls {
			align-items: flex-start;
		}
	}
</style>
