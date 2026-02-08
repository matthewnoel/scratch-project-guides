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
	const SCRATCHBLOCKS_MARKDOWN_SYNTAX = [
		['Code', 'Use', 'Example'],
		['`block name`', 'a block', '`erase all`'],
		[
			'`end`',
			'stops a C block (only necessary if more blocks come after the C block)',
			`\`\`\`
repeat (5)
  move (10) steps
end
say [Done!]
\`\`\``
		],
		['`[text]`', 'a text input', `say [Hello World!]`],
		['`(var)`', 'a variable or reporter block', '`(x position)`']
		// TODO
	];
	const MARKDOWN_SYNTAX_BREAKDOWN = (() => {
		const [header, ...rows] = SCRATCHBLOCKS_MARKDOWN_SYNTAX;
		const separator = header.map(() => '---');
		const formatRow = (row: string[]) => `| ${row.join(' | ')} |`;
		const table = [formatRow(header), formatRow(separator), ...rows.map(formatRow)].join('\n');
		return `Here's a breakdown of the scratchblocks markdown syntax:\n${table}`;
	})();
	const SYSTEM_PROMPT = [
		'Your task is to faithfully transform this raw OCR result from a Scratch code screenshot into valid Scratchblocks markdown.',
		'You will recieve ONE LINE at a time.',
		'Output ONLY the valid markdown.',
		MARKDOWN_SYNTAX_BREAKDOWN,
		'Here are some common mistakes in the OCR result:',
		'`when clicked` => `when green flag clicked`, `J` => `end`.',
		'Remember to output the entire line as valid scratchblocks flavored markdown.'
	].join('\n');

	console.log(SYSTEM_PROMPT);

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

	/**
	 * Process a single line of OCR text through the LLM with a fresh context.
	 */
	const processLine = async (
		engine: import('@mlc-ai/web-llm').MLCEngine,
		line: string
	): Promise<string> => {
		await engine.resetChat();

		const response = await engine.chat.completions.create({
			messages: [
				{ role: 'system', content: SYSTEM_PROMPT },
				{ role: 'user', content: line }
			],
			temperature: 0.1,
			max_tokens: 256
		});

		const raw = response.choices[0]?.message?.content;
		return raw ? cleanResponse(raw) : line;
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

			const lines = value.split('\n');
			const nonEmptyCount = lines.filter((l) => l.trim().length > 0).length;
			let processed = 0;
			const results: string[] = [];

			for (const line of lines) {
				if (currentRunId !== runId) return;

				// Preserve blank lines as-is without an LLM call.
				if (line.trim().length === 0) {
					results.push(line);
					continue;
				}

				processed += 1;
				status = `Processing line ${processed} of ${nonEmptyCount}...`;

				const result = await processLine(engine, line);
				results.push(result);
			}

			if (currentRunId !== runId) return;

			status = 'Processing complete.';
			isRunning = false;
			onComplete(results.join('\n'));
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
