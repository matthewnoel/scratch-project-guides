<script lang="ts">
	import { onDestroy } from 'svelte';
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';

	type Props = {
		open: boolean;
		markdown: string;
		fileName: string;
		onClose?: () => void;
	};

	let { open, markdown, onClose }: Props = $props();
	let copyStatus = $state('');
	let hasAccount = $state(false);
	let hasCopied = $state(false);
	let hasOpenedForm = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;
	let wasOpen = false;

	const signupUrl = 'https://github.com/signup';
	const issueUrl =
		'https://github.com/matthewnoel/scratch-project-guides/issues/new?template=project-submission.yml';

	const currentStep = $derived.by(() => {
		if (!hasAccount) return 1;
		if (!hasCopied) return 2;
		if (!hasOpenedForm) return 3;
		return 4;
	});

	const stepIndicators = ['1️⃣', '2️⃣', '3️⃣'];
	const getStepIndicator = (step: number) => (currentStep > step ? '✅' : stepIndicators[step - 1]);

	$effect(() => {
		if (open && !wasOpen) {
			copyStatus = '';
			hasAccount = false;
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

<Modal
	{open}
	labelledBy="submit-modal-title"
	describedBy="submit-modal-description"
	onClose={closeModal}
>
	<header class="modal__header">
		<h4 id="submit-modal-title">Submit your project 📨</h4>
		<button class="icon-button" type="button" onclick={closeModal} aria-label="Close"> × </button>
	</header>
	<div class="modal__body">
		<p id="submit-modal-description">
			Thank you for considering submitting your project guide! Follow the steps below to get your
			code merged.
		</p>
		<ol class="modal__steps">
			<li aria-current={currentStep === 1 ? 'step' : undefined}>
				<span class="step__label">
					<span class="step__indicator" aria-hidden="true">{getStepIndicator(1)}</span>
					Create a GitHub account.
				</span>
				<div class="modal__actions">
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
			<li class:step--disabled={!hasAccount} aria-current={currentStep === 2 ? 'step' : undefined}>
				<span class="step__label">
					<span class="step__indicator" aria-hidden="true">{getStepIndicator(2)}</span>
					Copy the markdown to your clipboard.
				</span>
				<div class="modal__actions">
					<Button variant="emphasis" type="button" onclick={copyToClipboard} disabled={!hasAccount}>
						Copy
					</Button>
					{#if copyStatus}
						<span class="copy-status" aria-live="polite">{copyStatus}</span>
					{/if}
				</div>
			</li>
			<li class:step--disabled={!hasCopied} aria-current={currentStep === 3 ? 'step' : undefined}>
				<span class="step__label">
					<span class="step__indicator" aria-hidden="true">{getStepIndicator(3)}</span>
					Fill out the GitHub form with your markdown.
				</span>
				<p class="modal__description">
					Once you have filled out the form, a pull request will be created and reviewed by the
					community. Once the pull request is merged, your guide will be published to the site.
				</p>
				<div class="modal__actions">
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

	.modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.icon-button {
		border: 0;
		background: transparent;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		color: #333;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}

	.icon-button:hover,
	.icon-button:focus-visible {
		background-color: rgba(15, 15, 15, 0.12);
		color: #111;
	}

	.modal__description {
		font-size: 1.2rem;
		margin-left: 2rem;
	}

	.modal__body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: #333;
	}

	.modal__steps {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-left: 0;
		margin: 0;
	}

	.step__label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
	}

	.step__indicator {
		font-size: 1.05rem;
	}

	.step--disabled {
		opacity: 0.55;
	}

	.modal__actions {
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

	@media (max-width: 600px) {
		.modal__actions {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
