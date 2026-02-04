import { expect, test } from '@playwright/test';

test.describe('Meta Tags', () => {
	test('home page has correct meta description', async ({ page }) => {
		await page.goto('/');
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute('content', 'Guides for Scratch projects');
	});

	test('about page has correct meta description', async ({ page }) => {
		await page.goto('/about');
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute(
			'content',
			'About the Scratch Project Guides site'
		);
	});

	test('project page has correct meta description', async ({ page }) => {
		await page.goto('/projects/hello-world');
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute(
			'content',
			'Guide for a "Hello World 👋" project in Scratch.'
		);
	});
});
