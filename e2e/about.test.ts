import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
	test('has correct title and heading', async ({ page }) => {
		await page.goto('/about');
		await expect(page).toHaveTitle('About');
		await expect(page.locator('h1')).toHaveText('About');
	});

	test('displays under construction message', async ({ page }) => {
		await page.goto('/about');
		await expect(page.locator('h3')).toHaveText('🚧 Under Construction 👷');
	});

	test('has link to GitHub issues', async ({ page }) => {
		await page.goto('/about');
		const issuesLink = page.getByRole('link', { name: 'in progress' });
		await expect(issuesLink).toHaveAttribute('target', '_blank');
		await expect(issuesLink).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides/issues'
		);
	});

	test('has link to third-party licenses', async ({ page }) => {
		await page.goto('/about');
		const licensesLink = page.getByRole('link', { name: 'third-party licenses here' });
		await expect(licensesLink).toHaveAttribute('target', '_blank');
		await expect(licensesLink).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides/blob/main/third-party-licenses.txt'
		);
	});
});
