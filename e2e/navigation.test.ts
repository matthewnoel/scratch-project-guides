import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
	test('displays navigation bar with all links', async ({ page }) => {
		await page.goto('/');
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Open Scratch Guides' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'All Projects' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Source Code' })).toBeVisible();
	});

	test('logo/brand links to home page', async ({ page }) => {
		await page.goto('/about');
		await page.locator('nav').getByRole('link', { name: 'Open Scratch Guides' }).click();
		await expect(page).toHaveURL('/');
	});

	test('All Projects link navigates to home', async ({ page }) => {
		await page.goto('/about');
		await page.locator('nav').getByRole('link', { name: 'All Projects' }).click();
		await expect(page).toHaveURL('/');
	});

	test('About link navigates to about page', async ({ page }) => {
		await page.goto('/');
		await page.locator('nav').getByRole('link', { name: 'About' }).click();
		await expect(page).toHaveURL(/\/about$/);
	});

	test('GitHub link opens in new tab with correct URL', async ({ page }) => {
		await page.goto('/');
		const githubLink = page.locator('nav').getByRole('link', { name: 'Source Code' });
		await expect(githubLink).toHaveAttribute('target', '_blank');
		await expect(githubLink).toHaveAttribute('rel', 'noreferrer');
		await expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides'
		);
	});

	test('Submit a Project link navigates to submit project page', async ({ page }) => {
		await page.goto('/');
		await page.locator('nav').getByRole('link', { name: 'New Guide' }).click();
		await expect(page).toHaveURL('/submit-project');
	});
});
