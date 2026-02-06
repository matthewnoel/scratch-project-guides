<script>
	// @ts-nocheck

	import Markdown from '$lib/Markdown.svelte';
	import ScratchBlock from '$lib/ScratchBlock.svelte';
	import ScratchProject from '$lib/ScratchProject.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {string} [source]
	 */

	/** @type {Props} */
	let { source = '' } = $props();

	const getScratchProjectId = (line) => {
		if (line.startsWith('https://scratch.mit.edu/projects/')) {
			const digits = line.replace(/\D/g, '');
			if (digits.length > 0) {
				return digits;
			}
		}
		return null;
	};
	const isScratchProjectLink = (line) => {
		return getScratchProjectId(line) !== null;
	};
	const isScratchBlockEnd = (line, current) => {
		return current.length > 0 && line.startsWith('```');
	};
	const resetCurrentScratchBlock = (currentMarkdown, currentScratchBlock) => {
		let newMarkdown = currentMarkdown;
		if (currentScratchBlock.length > 0) {
			if (currentMarkdown.length > 0) {
				newMarkdown = `${currentMarkdown}\n${currentScratchBlock}`;
			} else {
				newMarkdown += currentScratchBlock;
			}
		}
		return [newMarkdown, ''];
	};
	const isScratchBlockStart = (line) => {
		return line.startsWith('```scratchblocks');
	};

	const buildSections = (input) => {
		let currentMarkdown = '';
		let currentScratchBlock = '';
		const sections = [];
		const lines = input.split('\n');
		for (const line of lines) {
			if (isScratchProjectLink(line)) {
				[currentMarkdown, currentScratchBlock] = resetCurrentScratchBlock(
					currentMarkdown,
					currentScratchBlock
				);
				if (currentScratchBlock.length > 0) {
					if (currentMarkdown.length > 0) {
						currentMarkdown += `\n${currentScratchBlock}`;
					} else {
						currentMarkdown += currentScratchBlock;
					}
					currentScratchBlock = '';
				}
				if (currentMarkdown.length > 0) {
					sections.push({
						type: 'MARKDOWN',
						data: currentMarkdown
					});
					currentMarkdown = '';
				}
				sections.push({
					type: 'SCRATCH_PROJECT',
					data: getScratchProjectId(line)
				});
			} else if (isScratchBlockStart(line)) {
				[currentMarkdown, currentScratchBlock] = resetCurrentScratchBlock(
					currentMarkdown,
					currentScratchBlock
				);
				if (currentMarkdown.length > 0) {
					sections.push({
						type: 'MARKDOWN',
						data: currentMarkdown
					});
					currentMarkdown = '';
				}
				currentScratchBlock += `\n`;
			} else if (isScratchBlockEnd(line, currentScratchBlock)) {
				sections.push({
					type: 'SCRATCHBLOCK',
					data: currentScratchBlock
				});
				currentScratchBlock = '';
			} else if (currentScratchBlock.length > 0) {
				currentScratchBlock += `\n${line}`;
			} else {
				currentMarkdown += `${line}\n`;
			}
		}
		[currentMarkdown, currentScratchBlock] = resetCurrentScratchBlock(
			currentMarkdown,
			currentScratchBlock
		);
		if (currentMarkdown.length > 0) {
			sections.push({
				type: 'MARKDOWN',
				data: currentMarkdown
			});
		}
		return sections;
	};

	const sections = $derived.by(() => buildSections(source));
</script>

{#each sections as { type, data }, index (`${type}-${index}`)}
	{#if type === 'MARKDOWN'}
		<Markdown source={data} />
	{:else if type === 'SCRATCHBLOCK'}
		<ScratchBlock text={data} />
	{:else if type === 'SCRATCH_PROJECT'}
		<ScratchProject id={data} />
	{:else}
		<p>Unknown section type {type}</p>
	{/if}
{/each}
