<script lang="ts">
	import Button from '$lib/Button.svelte';
	import EditorIconButton from '$lib/EditorIconButton.svelte';
	import FileInput from '$lib/FileInput.svelte';
	import Modal from '$lib/Modal.svelte';
	import OCRProcessor from '$lib/OCRProcessor.svelte';
	import OCRPostProcessor from '$lib/OCRPostProcessor.svelte';

	type Props = {
		onRead: (text: string) => void;
	};

	let { onRead }: Props = $props();

	const emoji = '📸';
	let isModalOpen = $state(false);
	let isOcrRunning = $state(false);
	let isPostProcessorRunning = $state(false);
	let fileResetSignal = $state(0);
	let ocrImageFile = $state<File | null>(null);
	let ocrText = $state('');
	let currentStep = $state<'select' | 'ocr' | 'post-processor'>('select');

	const modalDescriptionId = 'ocr-modal-description';

	const resetOcrState = () => {
		ocrImageFile = null;
		ocrText = '';
		currentStep = 'select';
		fileResetSignal += 1;
	};

	const openModal = () => {
		resetOcrState();
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};

	const runOcrWithFile = (file: File) => {
		ocrImageFile = file;
		currentStep = 'ocr';
	};

	const handleOcrRead = (text: string) => {
		ocrText = text;
		currentStep = 'post-processor';
	};

	const handlePostProcessingComplete = (text: string) => {
		onRead(text);
		closeModal();
	};

	const handleOcrComplete = () => {
		fileResetSignal += 1;
	};
</script>

<EditorIconButton ariaLabel="Import text from an image" icon={emoji} onClick={openModal} />

{#snippet closeAction()}
	<Button
		variant="standard"
		type="button"
		onclick={closeModal}
		disabled={isOcrRunning || isPostProcessorRunning}
	>
		Close
	</Button>
{/snippet}

<Modal
	open={isModalOpen}
	title="Add code from screenshot"
	{emoji}
	showClose
	onClose={closeModal}
	actions={[closeAction]}
>
	<p id={modalDescriptionId}>
		Screenshot a section of your Scratch and we'll try to write the code block for you.
	</p>
	<div class="container">
		{#if currentStep === 'select'}
			<FileInput
				accept="image/*"
				disabled={isOcrRunning}
				onFileSelect={runOcrWithFile}
				ariaLabel="Upload an image for OCR"
				dropzoneLabel="Click or drag an image here"
				resetSignal={fileResetSignal}
			/>
		{:else if currentStep === 'ocr'}
			<OCRProcessor
				image={ocrImageFile}
				onRead={handleOcrRead}
				onComplete={handleOcrComplete}
				maxRetries={1}
				retryDelayMs={500}
				bind:isRunning={isOcrRunning}
			/>
			{#if !isOcrRunning}
				<Button variant="standard" type="button" onclick={resetOcrState}>
					Choose another image
				</Button>
			{/if}
		{:else}
			<OCRPostProcessor
				text={ocrText}
				onComplete={handlePostProcessingComplete}
				bind:isRunning={isPostProcessorRunning}
			/>
			{#if !isPostProcessorRunning}
				<Button variant="standard" type="button" onclick={resetOcrState}>Start over</Button>
			{/if}
		{/if}
	</div>
</Modal>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}
</style>
