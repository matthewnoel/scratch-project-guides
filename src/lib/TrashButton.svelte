<script lang="ts">
	import Button from '$lib/Button.svelte';
	import EditorIconButton from '$lib/EditorIconButton.svelte';
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

<EditorIconButton ariaLabel="Clear all backups" icon="🗑️" onClick={openConfirm} />

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
