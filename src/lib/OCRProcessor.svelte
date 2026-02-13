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

	const SCRATCH_USER_WORDS = [
		'when',
		'clicked',
		'flag',
		'green',
		'key',
		'pressed',
		'backdrop',
		'switches',
		'sprite',
		'clone',
		'loudness',
		'timer',
		'video',
		'motion',
		'message',
		'received',
		'broadcast',
		'start',
		'stop',
		'sounds',
		'scripts',
		'scene',
		'move',
		'steps',
		'turn',
		'right',
		'left',
		'degrees',
		'clockwise',
		'counterclockwise',
		'goto',
		'go',
		'random',
		'position',
		'glide',
		'secs',
		'point',
		'direction',
		'towards',
		'mouse',
		'pointer',
		'change',
		'set',
		'rotation',
		'style',
		'all',
		'around',
		"don't",
		'rotate',
		'left-right',
		'only',
		'costume',
		'next',
		'switch',
		'size',
		'show',
		'hide',
		'front',
		'back',
		'forward',
		'backward',
		'layers',
		'layer',
		'say',
		'for',
		'think',
		'hello',
		'effect',
		'color',
		'fisheye',
		'whirl',
		'pixelate',
		'mosaic',
		'brightness',
		'ghost',
		'clear',
		'graphic',
		'effects',
		'play',
		'sound',
		'until',
		'done',
		'volume',
		'by',
		'to',
		'tempo',
		'forever',
		'repeat',
		'if',
		'then',
		'else',
		'wait',
		'and',
		'or',
		'not',
		'touching',
		'edge',
		'is',
		'on',
		'down',
		'distance',
		'answer',
		'username',
		'year',
		'month',
		'date',
		'day',
		'of',
		'week',
		'days',
		'since',
		'2000',
		'hour',
		'minute',
		'second',
		'reset',
		'loud',
		'stage',
		'transparency',
		'off',
		'my',
		'variable',
		'list',
		'length',
		'contains',
		'item',
		'add',
		'delete',
		'insert',
		'at',
		'replace',
		'with',
		'make',
		'create',
		'myself',
		'as',
		'this',
		'ask',
		'pen',
		'up',
		'stamp',
		'erase',
		'saturation',
		'current',
		'minutes',
		'seconds',
		'join',
		'letter',
		'mod',
		'round',
		'sqrt',
		'abs',
		'floor',
		'ceiling',
		'cos',
		'sin',
		'tan',
		'asin',
		'acos',
		'atan',
		'ln',
		'log',
		'e'
	].join('\n');

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
			const { createWorker, PSM } = await import('tesseract.js');
			const worker = await createWorker('eng', undefined, {
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

			try {
				await worker.writeText('eng.user-words', SCRATCH_USER_WORDS);
				await worker.reinitialize('eng', undefined, 'user_words_suffix user-words');
				await worker.setParameters({
					tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
					tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyz0123456789 ()[]{}<>%-'
				});

				for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
					try {
						const result = await worker.recognize(file);

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
				await worker.terminate();
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
