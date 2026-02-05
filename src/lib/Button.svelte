<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- allow external hrefs */
	import type { Snippet } from 'svelte';

	type Variant = 'emphasis' | 'standard';
	type Size = 'small' | 'medium' | 'large';

	type Props = {
		variant?: Variant;
		size?: Size;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let {
		variant = 'standard',
		size = 'medium',
		href,
		type = 'button',
		disabled = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const isLink = $derived.by(() => Boolean(href));
	const classes = $derived.by(() =>
		[
			'button',
			`button--${variant}`,
			`button--${size}`,
			disabled ? 'button--disabled' : '',
			className
		]
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
		font: inherit;
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

	.button--small {
		padding: 0.2rem 0.6rem;
		font-size: 1rem;
	}

	.button--medium {
		padding: 0.4rem 0.9rem;
		font-size: 1.25rem;
	}

	.button--large {
		padding: 0.55rem 1.1rem;
		font-size: 1.5rem;
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
