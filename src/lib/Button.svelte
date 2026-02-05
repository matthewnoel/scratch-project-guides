<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- allow external hrefs */
	import type { Snippet } from 'svelte';

	type Variant = 'emphasis' | 'standard';

	type Props = {
		variant?: Variant;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let {
		variant = 'standard',
		href,
		type = 'button',
		disabled = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const isLink = $derived.by(() => Boolean(href));
	const classes = $derived.by(() =>
		['button', `button--${variant}`, disabled ? 'button--disabled' : '', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if isLink}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a
		{...rest}
		class={classes}
		href={disabled ? undefined : href}
		aria-disabled={disabled ? 'true' : undefined}
		tabindex={disabled ? -1 : undefined}
	>
		{@render children?.()}
	</a>
{:else}
	<button {...rest} class={classes} {type} {disabled}>
		{@render children?.()}
	</button>
{/if}

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 999px;
		font-weight: 600;
		padding: 0.55rem 1.1rem;
		border: 1px solid transparent;
		background: transparent;
		color: #111;
		text-decoration: none;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.button:focus-visible {
		outline: 3px solid rgba(17, 17, 17, 0.2);
		outline-offset: 2px;
	}

	.button--emphasis {
		background: #ffbf00;
		color: #111;
	}

	.button--emphasis:hover,
	.button--emphasis:focus {
		background: #ffcf33;
	}

	.button--standard {
		border-color: rgba(0, 0, 0, 0.12);
		background: #fff;
		color: #111;
	}

	.button--standard:hover,
	.button--standard:focus {
		border-color: rgba(0, 0, 0, 0.2);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
	}

	.button--disabled {
		cursor: not-allowed;
		opacity: 0.6;
		pointer-events: none;
	}
</style>
