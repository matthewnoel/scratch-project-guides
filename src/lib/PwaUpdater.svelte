<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		import('virtual:pwa-register/svelte').then(({ useRegisterSW }) => {
			useRegisterSW({ immediate: true });
		});
	});
</script>
