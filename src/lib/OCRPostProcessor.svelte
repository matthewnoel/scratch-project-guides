<script lang="ts">
	type Props = {
		text: string;
		onComplete: (text: string) => void;
		status?: string;
		error?: string;
		isRunning?: boolean;
		delayMs?: number;
	};

	let {
		text,
		onComplete,
		status = $bindable(''),
		error = $bindable(''),
		isRunning = $bindable(false),
		delayMs = 10
	}: Props = $props();

	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let runId = 0;

	const resetState = () => {
		status = '';
		error = '';
		isRunning = false;
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	const runNlp = (value: string, currentRunId: number) => {
		status = 'Preparing text...';
		error = '';
		isRunning = true;

		timeoutId = setTimeout(() => {
			if (currentRunId !== runId) {
				return;
			}
			status = 'NLP complete.';
			isRunning = false;
			onComplete(value);
		}, delayMs);
	};

	$effect(() => {
		if (!text) {
			resetState();
			return;
		}

		runId += 1;
		runNlp(text, runId);
	});

	$effect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		};
	});
</script>

<div class="processing-status" aria-live="polite">
	{#if isRunning}
		<span>Processing text...</span>
	{:else if status}
		<span>{status}</span>
	{/if}
	{#if error}
		<span class="processing-error">{error}</span>
	{/if}
</div>
