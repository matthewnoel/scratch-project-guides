<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import Button from '$lib/Button.svelte';

	type Props = {
		open: boolean;
		markdown: string;
		onClose?: () => void;
	};

	let { open, markdown, onClose }: Props = $props();
	let copyStatus = $state('');
	let hasAccount = $state(false);
	let hasCopied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;

	let dialogEl = $state<HTMLDivElement | null>(null);
	let lastActiveElement: HTMLElement | null = null;
	let wasOpen = false;

	const signupUrl = 'https://github.com/signup';
	const issueUrl =
		'https://github.com/matthewnoel/scratch-project-guides/issues/new?template=project-submission.yml';

	const currentStep = $derived.by(() => {
		if (!hasAccount) return 1;
		if (!hasCopied) return 2;
		return 3;
	});

	const focusableSelector = [
		'a[href]',
		'button:not([disabled])',
		'input:not([disabled])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])'
	].join(',');

	const getFocusable = (node: HTMLElement) =>
		Array.from(node.querySelectorAll<HTMLElement>(focusableSelector)).filter(
			(element) => !element.hasAttribute('disabled') && element.tabIndex !== -1
		);

	const focusFirst = () => {
		if (!dialogEl) return;
		const focusable = getFocusable(dialogEl);
		(focusable[0] ?? dialogEl).focus();
	};

	$effect(() => {
		if (open && !wasOpen) {
			lastActiveElement = document.activeElement as HTMLElement | null;
			copyStatus = '';
			hasAccount = false;
			hasCopied = false;
			void (async () => {
				await tick();
				focusFirst();
			})();
		}

		if (!open && wasOpen) {
			lastActiveElement?.focus();
			lastActiveElement = null;
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

	const trapFocus = (node: HTMLElement) => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				onClose?.();
				return;
			}

			if (event.key !== 'Tab') return;

			const focusable = getFocusable(node);
			if (focusable.length === 0) {
				event.preventDefault();
				node.focus();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement as HTMLElement | null;

			if (event.shiftKey && active === first) {
				event.preventDefault();
				last.focus();
				return;
			}

			if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		};

		node.addEventListener('keydown', handleKeydown);

		return {
			destroy() {
				node.removeEventListener('keydown', handleKeydown);
			}
		};
	};
</script>

{#if open}
	<div
		class="modal-backdrop"
		role="button"
		aria-label="Close modal"
		tabindex="0"
		onclick={(event) => {
			if (event.currentTarget === event.target) {
				onClose?.();
			}
		}}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClose?.();
			}
		}}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="submit-modal-title"
			aria-describedby="submit-modal-description"
			tabindex="-1"
			bind:this={dialogEl}
			use:trapFocus
		>
			<header class="modal__header">
				<h1 id="submit-modal-title">Submit your project</h1>
				<button class="icon-button" type="button" onclick={() => onClose?.()} aria-label="Close">
					×
				</button>
			</header>
			<div class="modal__body">
				<p id="submit-modal-description">
					Thank you for considering submitting your project guide! Follow the steps below to get
					your code merged.
				</p>
				<ol class="modal__steps">
					<li
						class:step--disabled={currentStep !== 1}
						aria-current={currentStep === 1 ? 'step' : undefined}
					>
						<span class="step__label">
							<span class="step__indicator" aria-hidden="true">{currentStep === 1 ? '👉' : ''}</span
							>
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
					<li
						class:step--disabled={!hasAccount}
						aria-current={currentStep === 2 ? 'step' : undefined}
					>
						<span class="step__label">
							<span class="step__indicator" aria-hidden="true">{currentStep === 2 ? '👉' : ''}</span
							>
							Copy the markdown to your clipboard.
						</span>
						<div class="modal__actions">
							<Button
								variant="emphasis"
								type="button"
								onclick={copyToClipboard}
								disabled={!hasAccount}
							>
								Copy
							</Button>
							{#if copyStatus}
								<span class="copy-status" aria-live="polite">{copyStatus}</span>
							{/if}
						</div>
					</li>
					<li
						class:step--disabled={!hasCopied}
						aria-current={currentStep === 3 ? 'step' : undefined}
					>
						<span class="step__label">
							<span class="step__indicator" aria-hidden="true">{currentStep === 3 ? '👉' : ''}</span
							>
							Fill out the GitHub form with your markdown.
						</span>
						<div class="modal__actions">
							<Button
								variant="emphasis"
								href={issueUrl}
								target="_blank"
								rel="noreferrer"
								disabled={!hasCopied}
							>
								Go
							</Button>
						</div>
					</li>
				</ol>
			</div>
		</div>
	</div>
{/if}

<style>
	#submit-modal-title {
		font-size: 1.5rem;
	}

	#submit-modal-description {
		font-size: 1.2rem;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(15, 15, 15, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		z-index: 50;
	}

	.modal {
		width: min(560px, 100%);
		background: #fff;
		border-radius: 16px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		outline: none;
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
	}

	.modal__body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: #333;
	}

	.modal__steps {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-left: 1.2rem;
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
		gap: 0.75rem;
		margin-top: 0.75rem;
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
