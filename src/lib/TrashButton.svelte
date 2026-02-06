<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';

	type Props = {
		onTrashed: () => void;
	};

	let { onTrashed }: Props = $props();
	let isConfirmOpen = $state(false);

	const modalTitleId = 'trash-modal-title';
	const modalDescriptionId = 'trash-modal-description';

	const openConfirm = () => {
		isConfirmOpen = true;
	};

	const closeConfirm = () => {
		isConfirmOpen = false;
	};

	const confirmTrash = () => {
		localStorage.clear();
		onTrashed();
		closeConfirm();
	};
</script>

<button onclick={openConfirm} aria-label="Clear all backups">🗑️</button>

{#snippet confirmActions()}
	<Button variant="standard" type="button" onclick={closeConfirm}>Cancel</Button>
	<Button variant="emphasis" type="button" onclick={confirmTrash}>Trash</Button>
{/snippet}

<Modal
	open={isConfirmOpen}
	labelledBy={modalTitleId}
	describedBy={modalDescriptionId}
	showClose
	onClose={closeConfirm}
	actions={[confirmActions]}
>
	<header>
		<h4 id={modalTitleId}>Clear all backups?</h4>
	</header>
	<p id={modalDescriptionId}>This removes your saved draft from this browser.</p>
</Modal>

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
