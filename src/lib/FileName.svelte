<script lang="ts">
	type Props = {
		fileName: string;
	};

	let { fileName = $bindable() }: Props = $props();
</script>

<div class="file-name-container">
	<span>/projects/</span>
	<input
		type="text"
		name="file-name"
		id="file-name"
		placeholder="file-name"
		bind:value={fileName}
	/>
	<span>.md</span>
</div>

<style>
	.file-name-container {
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 12px;
		background: white;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
		overflow: hidden;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: fit-content;
	}

	span {
		color: #444;
		font-size: 1rem;
		font-weight: 600;
	}

	input[type='text'] {
		outline: none;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		background: #fafbfc;
		box-shadow: none;
		transition:
			border-color 0.18s,
			box-shadow 0.18s;
		color: #222;
		appearance: none;
	}

	input[type='text']:focus {
		border-color: #ffbf00;
		box-shadow: 0 0 0 2px #ece6ff;
		background: #fff;
	}

	input[type='text']::placeholder {
		color: #bbb;
		opacity: 1;
		font-weight: 400;
	}
</style>
