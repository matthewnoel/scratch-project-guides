import { expect, test } from '@playwright/test';

// These tests assert that every project listed on the home page is reachable
// and renders core elements. They help catch any breakage in the build-time
// projects generation pipeline (scripts/generate-projects.js) or the
// [slug] route after a dependency update to SvelteKit or vite.

test.describe('Projects data integrity', () => {
	test('every project link on home navigates to a working guide', async ({ page }) => {
		await page.goto('/');
		const projectLinks = page.locator('section.level-1 ul li a');
		const hrefs = await projectLinks.evaluateAll((nodes) =>
			nodes.map((n) => (n as HTMLAnchorElement).getAttribute('href'))
		);
		expect(hrefs.length).toBeGreaterThanOrEqual(5);
		for (const href of hrefs) {
			expect(href).toBeTruthy();
			const res = await page.goto(href as string);
			expect(res?.status()).toBe(200);
			// Every project page renders exactly one h1 (its title)
			await expect(page.locator('article h1, main h1').first()).toBeVisible();
		}
	});

	test('project page title matches link text from home', async ({ page }) => {
		await page.goto('/');
		const links = await page.locator('section.level-1 ul li a').evaluateAll((nodes) =>
			nodes.map((n) => ({
				href: (n as HTMLAnchorElement).getAttribute('href'),
				text: n.textContent?.trim() ?? ''
			}))
		);

		for (const { href, text } of links) {
			await page.goto(href as string);
			await expect(page).toHaveTitle(text);
			await expect(page.locator('h1').first()).toHaveText(text);
		}
	});

	test('groups render in the expected order (Getting Started first)', async ({ page }) => {
		await page.goto('/');
		const h2Texts = await page.locator('section.level-1 h2').allTextContents();
		expect(h2Texts[0]).toBe('Getting Started');
		// Remaining groups are alphabetical
		const remaining = h2Texts.slice(1);
		const sorted = [...remaining].sort((a, b) => a.localeCompare(b));
		expect(remaining).toEqual(sorted);
	});
});
