<script lang="ts">
	type Props = {
		text: string;
		onComplete: (text: string) => void;
		status?: string;
		error?: string;
		isRunning?: boolean;
	};

	let {
		text,
		onComplete,
		status = $bindable(''),
		error = $bindable(''),
		isRunning = $bindable(false)
	}: Props = $props();

	let runId = 0;

	const MODEL_ID = 'SmolLM2-1.7B-Instruct-q4f16_1-MLC';
	const SYSTEM_PROMPT =
		'Your task is to faithfully transform this raw OCR result from a Scratch code screenshot into valid Scratchblocks markdown. Output ONLY the valid markdown. Here are some common mistakes in the OCR result and how to fix them: `when clicked` => `when green flag clicked`';

	// Module-level engine cache shared across component instances.
	// Uses dynamic import to avoid SSR issues with browser-only WebGPU APIs.
	let enginePromise: Promise<import('@mlc-ai/web-llm').MLCEngine> | null = null;

	const getEngine = (currentRunId: number): Promise<import('@mlc-ai/web-llm').MLCEngine> => {
		if (!enginePromise) {
			enginePromise = (async () => {
				const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
				return CreateMLCEngine(MODEL_ID, {
					initProgressCallback: (report) => {
						if (currentRunId !== runId) return;
						status = report.text;
					}
				});
			})().catch((err) => {
				// Reset so a future attempt can retry instead of returning
				// the same rejected promise forever.
				enginePromise = null;
				throw err;
			});
		}
		return enginePromise;
	};

	/**
	 * Strip markdown code fences the model may wrap around its output.
	 */
	const cleanResponse = (response: string): string => {
		let cleaned = response.trim();
		const codeBlockMatch = cleaned.match(/^```(?:scratchblocks)?\n?([\s\S]*?)```$/);
		if (codeBlockMatch) {
			cleaned = codeBlockMatch[1].trim();
		}
		return cleaned;
	};

	const resetState = () => {
		status = '';
		error = '';
		isRunning = false;
	};

	const runPostProcessing = async (value: string, currentRunId: number) => {
		status = 'Initializing AI model...';
		error = '';
		isRunning = true;

		try {
			if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
				throw new Error('WebGPU is not supported in this browser.');
			}

			const engine = await getEngine(currentRunId);
			if (currentRunId !== runId) return;

			status = 'Processing text with AI...';

			const response = await engine.chat.completions.create({
				messages: [
					{ role: 'system', content: SYSTEM_PROMPT },
					{ role: 'user', content: value }
				],
				temperature: 0.1,
				max_tokens: 2048
			});

			if (currentRunId !== runId) return;

			const raw = response.choices[0]?.message?.content;
			const result = raw ? cleanResponse(raw) : value;

			status = 'Processing complete.';
			isRunning = false;
			onComplete(result);
		} catch (err) {
			if (currentRunId !== runId) return;

			const message = err instanceof Error ? err.message : 'Post-processing failed.';
			error = `AI post-processing unavailable: ${message}. Using raw OCR text.`;
			status = '';
			isRunning = false;
			onComplete(value);
		}
	};

	$effect(() => {
		if (!text) {
			resetState();
			return;
		}

		runId += 1;
		void runPostProcessing(text, runId);
	});
</script>

<div class="processing-status" role="status" aria-live="polite">
	{#if isRunning}
		<span>{status || 'Processing text...'}</span>
	{:else if status}
		<span>{status}</span>
	{/if}
	{#if error}
		<span class="processing-error">{error}</span>
	{/if}
</div>
