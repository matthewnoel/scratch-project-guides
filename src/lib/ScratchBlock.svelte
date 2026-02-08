<script lang="ts">
	type Props = {
		text?: string;
	};

	type ScratchblocksModule = {
		parse: (source: string, options: { languages: string[] }) => unknown;
		newView: (
			doc: unknown,
			options: { style: string; scale: number }
		) => { render: () => { outerHTML: string } };
	};

	let { text = '' }: Props = $props();
	let svg = $state('');
	let scratchblocksModule: ScratchblocksModule | null = null;
	let renderToken = 0;

	let ariaLabel = $derived(
		'Scratch blocks: ' +
			text
				.split('\n')
				.filter((line) => line.trim())
				.join('; ')
	);

	const renderScratchblocks = async (source: string) => {
		if (!source.trim()) {
			svg = '';
			return;
		}
		const token = ++renderToken;
		if (!scratchblocksModule) {
			// @ts-expect-error because of laziness
			const module = await import('scratchblocks');
			scratchblocksModule = module.default;
		}
		if (!scratchblocksModule) {
			return;
		}
		if (token !== renderToken) {
			return;
		}
		const scratchblocks = scratchblocksModule;
		const doc = scratchblocks.parse(source, {
			languages: ['en']
		});
		const view = scratchblocksModule.newView(doc, {
			style: 'scratch3',
			scale: 0.675
		});
		svg = view.render().outerHTML;
	};

	$effect(() => {
		void renderScratchblocks(text);
	});
</script>

<div role="img" aria-label={ariaLabel}>
	{@html svg}
</div>
