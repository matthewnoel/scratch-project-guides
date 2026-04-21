import { expect, test } from '@playwright/test';

test.describe('Extended accessibility', () => {
	test('home page has exactly one h1', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toHaveCount(1);
	});

	test('about page has exactly one h1', async ({ page }) => {
		await page.goto('/about');
		await expect(page.locator('h1')).toHaveCount(1);
	});

	test('every project page has exactly one h1', async ({ page }) => {
		for (const slug of ['hello-world', 'fibonacci-sequence', 'math-quiz', 'pong', 'tic-tac-toe']) {
			await page.goto(`/projects/${slug}`);
			await expect(page.locator('h1')).toHaveCount(1);
		}
	});

	test('external links use rel="noreferrer" and target="_blank"', async ({ page }) => {
		await page.goto('/');
		const externalLinks = page.locator('a[href^="http"]');
		const total = await externalLinks.count();
		for (let i = 0; i < total; i += 1) {
			const link = externalLinks.nth(i);
			const target = await link.getAttribute('target');
			const rel = await link.getAttribute('rel');
			// External links opening in _blank should have rel="noreferrer" for security
			if (target === '_blank') {
				expect(rel ?? '').toMatch(/noreferrer/);
			}
		}
	});

	test('nav links are reachable via keyboard in order', async ({ page }) => {
		await page.goto('/');
		// First tab: skip-to-main-content link
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
		// Second tab: site-title "Open Scratch Guides"
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Open Scratch Guides' })).toBeFocused();
		// Third: All Projects in nav
		await page.keyboard.press('Tab');
		await expect(
			page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'All Projects' })
		).toBeFocused();
	});

	test('main navigation has aria-label "Main"', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
	});

	test('external-link footer uses aria-label "External links"', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('navigation', { name: 'External links' })).toBeVisible();
	});

	test('Escape key closes the submit-project submission modal', async ({ page }) => {
		await page.goto('/submit-project');
		await page.getByRole('button', { name: 'Submit My Project' }).click();
		await expect(page.getByRole('dialog', { name: /Submit your project/ })).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog', { name: /Submit your project/ })).toBeHidden();
	});

	test('all images/role=img elements have accessible names', async ({ page }) => {
		await page.goto('/projects/hello-world');
		// Wait for scratchblocks to render
		await expect(page.locator('[role="img"]').first()).toBeVisible({ timeout: 10000 });
		const imgs = page.locator('[role="img"]');
		const total = await imgs.count();
		for (let i = 0; i < total; i += 1) {
			const label = await imgs.nth(i).getAttribute('aria-label');
			expect(label).toBeTruthy();
		}
	});
});
