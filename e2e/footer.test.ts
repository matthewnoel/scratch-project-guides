import { expect, test } from '@playwright/test';

test.describe('Git Links Footer', () => {
	test('displays feedback link on all pages', async ({ page }) => {
		await page.goto('/');
		const feedbackLink = page.getByRole('link', { name: 'Give Feedback' });
		await expect(feedbackLink).toBeVisible();
		await expect(feedbackLink).toHaveAttribute('target', '_blank');
		await expect(feedbackLink).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides/issues/new'
		);
	});

	test('displays edit this page link on home page', async ({ page }) => {
		await page.goto('/');
		const editLink = page.getByRole('link', { name: 'Edit this page on GitHub' });
		await expect(editLink).toBeVisible();
		// Home page route is "/" so link points to routes/+page.svelte
		await expect(editLink).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides/blob/main/src/routes/+page.svelte'
		);
	});

	test('displays edit this page link on about page', async ({ page }) => {
		await page.goto('/about');
		const editLink = page.getByRole('link', { name: 'Edit this page on GitHub' });
		await expect(editLink).toBeVisible();
		await expect(editLink).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides/blob/main/src/routes/about/+page.svelte'
		);
	});
});
