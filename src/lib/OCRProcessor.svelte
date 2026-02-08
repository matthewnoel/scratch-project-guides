<script lang="ts">
	type Props = {
		image: File | null;
		onRead: (text: string) => void;
		onError?: (error: Error) => void;
		onComplete?: () => void;
		maxRetries?: number;
		retryDelayMs?: number;
		progress?: number;
		status?: string;
		error?: string;
		isRunning?: boolean;
		fileName?: string;
	};

	let {
		image,
		onRead,
		onError,
		onComplete,
		maxRetries = 1,
		retryDelayMs = 400,
		progress = $bindable(0),
		status = $bindable(''),
		error = $bindable(''),
		isRunning = $bindable(false),
		fileName = $bindable('')
	}: Props = $props();

	let runId = 0;

	const sleep = (durationMs: number) => new Promise((resolve) => setTimeout(resolve, durationMs));

	const setIdleState = () => {
		progress = 0;
		status = '';
		error = '';
		fileName = '';
		isRunning = false;
	};

	const formatError = (err: unknown) => {
		if (err instanceof Error) {
			return err;
		}
		return new Error('OCR failed.');
	};

	const runOcr = async (file: File, currentRunId: number) => {
		if (!file.type.startsWith('image/')) {
			const invalidError = new Error('Please upload an image file.');
			error = invalidError.message;
			status = '';
			progress = 0;
			onError?.(invalidError);
			onComplete?.();
			return;
		}

		fileName = file.name;
		error = '';
		status = 'Starting OCR...';
		progress = 0;
		isRunning = true;

		try {
			for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
				try {
					const { recognize } = await import('tesseract.js');
					const result = await recognize(file, 'eng', {
						logger: (message: { status?: string; progress?: number }) => {
							if (currentRunId !== runId) {
								return;
							}
							if (typeof message.progress === 'number') {
								progress = Math.round(message.progress * 100);
							}
							if (message.status) {
								status = message.status;
							}
						}
					});

					if (currentRunId !== runId) {
						return;
					}

					const detectedText = result.data.text ?? '';
					if (!detectedText.trim()) {
						throw new Error('No text was detected in the image.');
					}

					onRead(detectedText);
					status = 'OCR complete.';
					progress = 100;
					return;
				} catch (err) {
					if (currentRunId !== runId) {
						return;
					}

					const formattedError = formatError(err);
					if (attempt < maxRetries) {
						error = '';
						status = `Retrying OCR... (${attempt + 1}/${maxRetries})`;
						if (retryDelayMs > 0) {
							await sleep(retryDelayMs);
						}
						continue;
					}

					error = formattedError.message;
					status = '';
					onError?.(formattedError);
				}
			}
		} finally {
			if (currentRunId === runId) {
				isRunning = false;
				onComplete?.();
			}
		}
	};

	$effect(() => {
		if (!image) {
			setIdleState();
			return;
		}

		runId += 1;
		void runOcr(image, runId);
	});
</script>

<div class="processing-status" role="status" aria-live="polite">
	{#if isRunning}
		<span>Processing... {progress}%</span>
	{:else if status}
		<span>{status}</span>
	{:else if fileName}
		<span>Last file: {fileName}</span>
	{/if}
	{#if error}
		<span class="processing-error">{error}</span>
	{/if}
</div>
