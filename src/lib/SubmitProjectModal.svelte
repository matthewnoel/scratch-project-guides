<script lang="ts">
	import { onDestroy, tick } from 'svelte';

	type Props = {
		open: boolean;
		markdown: string;
		onClose?: () => void;
	};

	let { open, markdown, onClose }: Props = $props();
	let copyStatus = $state('');
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;

	let dialogEl = $state<HTMLDivElement | null>(null);
	let lastActiveElement: HTMLElement | null = null;
	let wasOpen = false;

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
		} catch {
			copyStatus = 'Copy failed. Please try again.';
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
				<h2 id="submit-modal-title">Submit your project</h2>
				<button class="icon-button" type="button" onclick={() => onClose?.()} aria-label="Close">
					×
				</button>
			</header>
			<div class="modal__body">
				<p id="submit-modal-description">
					Follow the steps below to submit your guide to the Scratch Project Guides repo.
				</p>
				<ol class="modal__steps">
					<li>
						Copy your markdown to the clipboard.
						<div class="modal__actions">
							<button class="primary-button" type="button" onclick={copyToClipboard}>
								Copy markdown
							</button>
							{#if copyStatus}
								<span class="copy-status" aria-live="polite">{copyStatus}</span>
							{/if}
						</div>
					</li>
					<li>
						Open the issue template and paste your markdown into the submission form.
						<a
							class="issue-link"
							href="https://github.com/matthewnoel/scratch-project-guides/issues/new?template=project-submission.yml"
							target="_blank"
							rel="noreferrer"
						>
							Open issue template
						</a>
					</li>
				</ol>
			</div>
			<footer class="modal__footer">
				<button class="secondary-button" type="button" onclick={() => onClose?.()}> Close </button>
			</footer>
		</div>
	</div>
{/if}

<style>
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

	.modal__header h2 {
		margin: 0;
		font-size: 1.4rem;
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

	.modal__actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.75rem;
	}

	.primary-button {
		border: 0;
		border-radius: 999px;
		background: #ffbf00;
		color: #111;
		font-weight: 600;
		padding: 0.55rem 1.1rem;
		cursor: pointer;
	}

	.primary-button:hover,
	.primary-button:focus {
		background: #ffcf33;
	}

	.secondary-button {
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 999px;
		background: #fff;
		color: #111;
		font-weight: 600;
		padding: 0.55rem 1.1rem;
		cursor: pointer;
	}

	.issue-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.5rem;
		color: #0b57d0;
		font-weight: 600;
		text-decoration: none;
	}

	.issue-link:hover,
	.issue-link:focus {
		text-decoration: underline;
	}

	.copy-status {
		font-size: 0.9rem;
		color: #1a7f37;
	}

	.modal__footer {
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 600px) {
		.modal__actions {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
