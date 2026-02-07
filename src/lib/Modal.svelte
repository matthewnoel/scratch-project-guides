<script lang="ts" module>
	let modalIdCounter = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';

	type Props = {
		open: boolean;
		title: string;
		emoji: string;
		onClose?: () => void;
		showClose?: boolean;
		actions?: Snippet[];
		children?: Snippet;
	};

	let { open, title, emoji, onClose, showClose = false, actions = [], children }: Props = $props();

	const internalTitleId = `modal-title-${modalIdCounter++}`;

	const actionList = $derived.by(() => (Array.isArray(actions) ? actions : []));

	let dialogEl = $state<HTMLDivElement | null>(null);
	let lastActiveElement: HTMLElement | null = null;
	let wasOpen = false;

	const close = () => {
		onClose?.();
	};

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

	const trapFocus = (node: HTMLElement) => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
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

	const handleBackdropClick = (event: MouseEvent) => {
		if (event.currentTarget === event.target) {
			close();
		}
	};

	const handleBackdropKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			close();
		}
	};
</script>

{#if open}
	<div
		class="modal-backdrop"
		role="button"
		aria-label="Close modal"
		tabindex="0"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby={internalTitleId}
			tabindex="-1"
			bind:this={dialogEl}
			use:trapFocus
		>
			{#if showClose}
				<button class="close-button" type="button" aria-label="Close modal" onclick={close}>
					×
				</button>
			{/if}
			{#if title}
				<header>
					<h1 id={internalTitleId} class="modal-title">{title} {emoji}</h1>
				</header>
			{/if}
			{@render children?.()}
			{#if actionList.length}
				<div class="actions">
					{#each actionList as action, index (index)}
						{@render action?.()}
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	h1 {
		font-size: 1.5rem;
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
		position: relative;
	}

	.modal-title {
		margin: 0;
	}

	.close-button {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
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

	.close-button:hover,
	.close-button:focus-visible {
		background-color: rgba(15, 15, 15, 0.12);
		color: #111;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 0.75rem;
		flex-wrap: wrap;
	}
</style>
