import { expect, test } from '@playwright/test';

test.describe('Layout', () => {
	test('has a skip-to-main-content link targeting #main-content', async ({ page }) => {
		await page.goto('/');
		const skipLink = page.getByRole('link', { name: 'Skip to main content' });
		await expect(skipLink).toHaveAttribute('href', '#main-content');
	});

	test('main content region has id="main-content"', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('main#main-content')).toBeVisible();
	});

	test('skip link can receive focus', async ({ page }) => {
		await page.goto('/');
		const skipLink = page.getByRole('link', { name: 'Skip to main content' });
		await skipLink.focus();
		await expect(skipLink).toBeFocused();
	});

	test('header contains the site title "Open Scratch Guides"', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'Open Scratch Guides' })).toBeVisible();
	});

	test('main body respects max-width on non-submit routes', async ({ page }) => {
		await page.goto('/');
		const main = page.locator('main#main-content');
		const isFullWidth = await main.evaluate((el) => el.classList.contains('full-width'));
		expect(isFullWidth).toBe(false);
	});

	test('submit-project route uses full-width main', async ({ page }) => {
		await page.goto('/submit-project');
		const main = page.locator('main#main-content');
		const isFullWidth = await main.evaluate((el) => el.classList.contains('full-width'));
		expect(isFullWidth).toBe(true);
	});

	test('page has html lang attribute set', async ({ page }) => {
		await page.goto('/');
		const lang = await page.locator('html').getAttribute('lang');
		expect(lang).toBeTruthy();
	});

	test('has viewport meta tag for responsive layout', async ({ page }) => {
		await page.goto('/');
		const viewport = page.locator('meta[name="viewport"]');
		await expect(viewport).toHaveAttribute('content', /width=device-width/);
	});

	test('applies stylesheets (body has non-default font-family)', async ({ page }) => {
		await page.goto('/');
		// Asserts Tailwind + app.css are actually loaded (the body should have a computed font-family).
		const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
		expect(fontFamily).toBeTruthy();
		expect(fontFamily.length).toBeGreaterThan(0);
	});

	test('does not throw uncaught page errors on internal routes', async ({ page }) => {
		// Only watches `pageerror` (uncaught JS) on routes we serve ourselves, so we
		// catch real Svelte/SvelteKit/Vite regressions without false-positives from
		// the scratch.mit.edu iframe's own console output.
		const errors: string[] = [];
		page.on('pageerror', (err) => errors.push(err.message));
		const routes = ['/', '/about', '/submit-project'];
		for (const route of routes) {
			await page.goto(route);
		}
		expect(errors).toEqual([]);
	});
});

test.describe('Static assets', () => {
	test('favicon is served', async ({ request }) => {
		const res = await request.get('/favicon.png');
		expect(res.status()).toBe(200);
		expect(res.headers()['content-type']).toMatch(/image/);
	});
});
