<script lang="ts">
	import { onDestroy } from 'svelte';
	import Button from '$lib/Button.svelte';
	import FileName from '$lib/FileName.svelte';
	import Modal from '$lib/Modal.svelte';

	type Props = {
		open: boolean;
		markdown: string;
		fileName: string;
		saveMarkdownToLocalStorage: () => void;
		onClose: () => void;
	};

	let {
		open,
		markdown,
		fileName = $bindable(),
		saveMarkdownToLocalStorage,
		onClose
	}: Props = $props();

	const hasValidFileName = $derived(!!fileName && fileName !== 'file-name');
	let copyStatus = $state('');
	let hasAccount = $state(false);
	let hasRememberedName = $state(false);
	let hasCopied = $state(false);
	let hasOpenedForm = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;
	let wasOpen = false;

	const signupUrl = 'https://github.com/signup';
	const issueUrl =
		'https://github.com/matthewnoel/scratch-project-guides/issues/new?template=project-submission.yml';

	const currentStep = $derived.by(() => {
		if (!hasAccount) return 1;
		if (!hasRememberedName) return 2;
		if (!hasCopied) return 3;
		if (!hasOpenedForm) return 4;
		return 5;
	});

	const stepIndicators = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
	const getStepIndicator = (step: number) => (currentStep > step ? '✅' : stepIndicators[step - 1]);

	$effect(() => {
		if (open && !wasOpen) {
			copyStatus = '';
			hasAccount = false;
			hasRememberedName = false;
			hasCopied = false;
			hasOpenedForm = false;
		}

		wasOpen = open;
	});

	const copyToClipboard = async () => {
		try {
			if (!navigator?.clipboard?.writeText) {
				throw new Error('Clipboard API unavailable');
			}
			await navigator.clipboard.writeText(markdown);
			copyStatus = 'Copied!';
			hasCopied = true;
		} catch {
			copyStatus = 'Copy failed. Please try again.';
			hasCopied = false;
		}

		if (copyTimeout) {
			clearTimeout(copyTimeout);
		}
		copyTimeout = setTimeout(() => {
			copyStatus = '';
		}, 2000);
	};

	onDestroy(() => {
		if (copyTimeout) {
			clearTimeout(copyTimeout);
		}
	});

	const closeModal = () => {
		onClose?.();
	};
</script>

<Modal {open} title="Submit your project" emoji="📨" onClose={closeModal} showClose>
	<div class="body">
		<p id="submit-modal-description">
			Thank you for considering submitting your project guide! Follow the steps below to get your
			code merged.
		</p>
		<ol class="steps">
			<li aria-current={currentStep === 1 ? 'step' : undefined}>
				<span class="label">
					<span class="step" aria-hidden="true">{getStepIndicator(1)}</span>
					Create a GitHub account.
				</span>
				<div class="actions">
					<Button variant="emphasis" href={signupUrl} target="_blank" rel="noreferrer">
						Sign Up
					</Button>
					<Button
						variant="standard"
						type="button"
						onclick={() => {
							hasAccount = true;
						}}
					>
						I Have One
					</Button>
				</div>
			</li>
			<li class:disabled-step={!hasAccount} aria-current={currentStep === 2 ? 'step' : undefined}>
				<span class="label">
					<span class="step" aria-hidden="true">{getStepIndicator(2)}</span>
					{hasValidFileName ? 'Remember your file name.' : 'Choose a file name.'}
				</span>
				<div class="file-name-wrapper">
					<FileName bind:fileName onChangeComplete={saveMarkdownToLocalStorage} />
				</div>
				<div class="actions">
					<Button
						variant="emphasis"
						type="button"
						disabled={!hasAccount || !hasValidFileName}
						onclick={() => {
							hasRememberedName = true;
						}}
					>
						Got It
					</Button>
				</div>
			</li>
			<li
				class:disabled-step={!hasRememberedName}
				aria-current={currentStep === 3 ? 'step' : undefined}
			>
				<span class="label">
					<span class="step" aria-hidden="true">{getStepIndicator(3)}</span>
					Copy the markdown to your clipboard.
				</span>
				<div class="actions">
					<Button
						variant="emphasis"
						type="button"
						onclick={copyToClipboard}
						disabled={!hasRememberedName}
					>
						Copy
					</Button>
					{#if copyStatus}
						<span class="copy-status" aria-live="polite">{copyStatus}</span>
					{/if}
				</div>
			</li>
			<li class:disabled-step={!hasCopied} aria-current={currentStep === 4 ? 'step' : undefined}>
				<span class="label">
					<span class="step" aria-hidden="true">{getStepIndicator(4)}</span>
					Fill out the GitHub form with your markdown.
				</span>
				<p class="description">
					Once you have filled out the form, a pull request will be created and reviewed by the
					community. Once the pull request is merged, your guide will be published to the site.
				</p>
				<div class="actions">
					<Button
						variant="emphasis"
						href={issueUrl}
						target="_blank"
						rel="noreferrer"
						disabled={!hasCopied}
						onclick={() => {
							hasOpenedForm = true;
						}}
					>
						Go to Form
					</Button>
				</div>
			</li>
		</ol>
	</div>
</Modal>

<style>
	#submit-modal-description {
		font-size: 1.2rem;
	}

	.description {
		font-size: 1.2rem;
		margin-left: 2rem;
	}

	.file-name-wrapper {
		margin-top: 0.5rem;
		margin-left: 2rem;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: var(--color-grey-text);
	}

	.steps {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-left: 0;
		margin: 0;
	}

	.label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
	}

	.step {
		font-size: 1.05rem;
	}

	.disabled-step {
		opacity: 0.55;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
		margin-top: 0.75rem;
		margin-left: 2rem;
	}

	.copy-status {
		font-size: 0.9rem;
		color: #1a7f37;
	}
</style>
