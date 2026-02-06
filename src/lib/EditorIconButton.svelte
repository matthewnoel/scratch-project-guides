<script lang="ts">
	type Props = {
		ariaLabel: string;
		icon: string;
		onClick: () => void;
		disabled?: boolean;
	};

	let { ariaLabel, icon, onClick, disabled = false }: Props = $props();
</script>

<button aria-label={ariaLabel} onclick={onClick} {disabled}>
	{icon}
</button>

<style>
	button {
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 12px;
		background: white;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		padding: 0 1.25rem;
		font-size: 1.5rem;
		cursor: pointer;
		transition: background-color 0.18s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:hover,
	button:focus {
		background-color: #f8f8f8;
	}
</style>
