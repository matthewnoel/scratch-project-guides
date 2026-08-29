<script>
	// @ts-nocheck
	import MarkdownIt from 'markdown-it';
	/**
	 * @typedef {Object} Props
	 * @property {string} [source]
	 */

	/** @type {Props} */
	let { source = '' } = $props();
	const getHtml = (source) => {
		const markdownIt = new MarkdownIt();
		const defaultLinkOpen =
			markdownIt.renderer.rules.link_open ||
			((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
		markdownIt.renderer.rules.link_open = (tokens, index, options, env, self) => {
			tokens[index].attrSet('target', '_blank');
			tokens[index].attrSet('rel', 'noopener noreferrer');
			return defaultLinkOpen(tokens, index, options, env, self);
		};
		return markdownIt.render(source);
	};
	let html = $derived(getHtml(source));
</script>

<div>
	{@html html}
</div>
