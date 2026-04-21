import { expect, test } from '@playwright/test';

// Tests the scratchblocks library integration. These pin the rendered SVG
// structure so dependency updates to scratchblocks or svelte 5 can be
// caught before deploying.

test.describe('ScratchBlock rendering', () => {
	test('renders an SVG for each scratchblocks fence on a project page', async ({ page }) => {
		await page.goto('/projects/hello-world');
		// Two scratchblocks fences in hello-world.md
		const svgs = page.locator('[role="img"][aria-label^="Scratch blocks:"] svg');
		await expect(svgs.first()).toBeVisible({ timeout: 10000 });
		await expect(svgs).toHaveCount(2);
	});

	test('each scratchblocks div has a descriptive aria-label', async ({ page }) => {
		await page.goto('/projects/hello-world');
		const blocks = page.locator('[role="img"][aria-label^="Scratch blocks:"]');
		await expect(blocks.first()).toBeVisible({ timeout: 10000 });

		const labels = await blocks.evaluateAll((nodes) =>
			nodes.map((n) => n.getAttribute('aria-label'))
		);
		// One block is "when green flag clicked", the other is two lines joined by "; "
		expect(labels).toContain('Scratch blocks: when green flag clicked');
		expect(labels).toContain('Scratch blocks: when green flag clicked; say [Hello World!]');
	});

	test('renders blocks with scratchblocks library markup', async ({ page }) => {
		await page.goto('/projects/hello-world');
		const block = page.locator('[role="img"][aria-label^="Scratch blocks:"]').first();
		await expect(block.locator('svg')).toBeVisible({ timeout: 10000 });
		// scratchblocks generates nested <g> groups and <text> nodes inside the SVG
		const groupCount = await block.locator('svg g').count();
		expect(groupCount).toBeGreaterThan(0);
		const textNodeCount = await block.locator('svg text').count();
		expect(textNodeCount).toBeGreaterThan(0);
	});

	test('scratchblock SVGs have non-zero dimensions', async ({ page }) => {
		await page.goto('/projects/hello-world');
		const svg = page.locator('[role="img"][aria-label^="Scratch blocks:"] svg').first();
		await expect(svg).toBeVisible({ timeout: 10000 });
		const box = await svg.boundingBox();
		expect(box?.width ?? 0).toBeGreaterThan(0);
		expect(box?.height ?? 0).toBeGreaterThan(0);
	});

	test('fibonacci page renders all four scratchblocks fences', async ({ page }) => {
		await page.goto('/projects/fibonacci-sequence');
		const blocks = page.locator('[role="img"][aria-label^="Scratch blocks:"]');
		await expect(blocks.first()).toBeVisible({ timeout: 10000 });
		await expect(blocks).toHaveCount(4);
	});
});

test.describe('Scratch project embeds', () => {
	test('hello-world embed has correct iframe attributes', async ({ page }) => {
		await page.goto('/projects/hello-world');
		const iframe = page.locator('iframe');
		await expect(iframe).toHaveAttribute('src', 'https://scratch.mit.edu/projects/807782232/embed');
		await expect(iframe).toHaveAttribute('title', 'Project Demo');
		await expect(iframe).toHaveAttribute('width', '485');
		await expect(iframe).toHaveAttribute('height', '402');
	});

	test('embed figure has caption and "View on scratch.mit.edu" link', async ({ page }) => {
		await page.goto('/projects/hello-world');
		await expect(page.locator('figcaption', { hasText: 'Demo The Project' })).toBeVisible();
		const viewLink = page.getByRole('link', { name: 'View on scratch.mit.edu' });
		await expect(viewLink).toHaveAttribute('href', 'https://scratch.mit.edu/projects/807782232');
		await expect(viewLink).toHaveAttribute('target', '_blank');
		await expect(viewLink).toHaveAttribute('rel', 'noreferrer');
	});

	test('embeds on multiple projects use correct project IDs', async ({ page }) => {
		const cases = [
			{ slug: 'hello-world', id: '807782232' },
			{ slug: 'fibonacci-sequence', id: '812115282' },
			{ slug: 'math-quiz', id: '805521735' },
			{ slug: 'pong', id: '801064832' }
		];
		for (const { slug, id } of cases) {
			await page.goto(`/projects/${slug}`);
			const iframe = page.locator('iframe');
			await expect(iframe).toHaveAttribute('src', new RegExp(`scratch\\.mit\\.edu/projects/${id}`));
		}
	});
});
