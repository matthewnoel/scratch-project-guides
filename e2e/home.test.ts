import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test('has correct title and heading', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Scratch Project Guides');
		await expect(page.locator('h1')).toHaveText('All Projects');
	});

	test('displays all project groups', async ({ page }) => {
		await page.goto('/');
		const groups = page.locator('h2');
		await expect(groups).toHaveCount(3);
		await expect(groups.nth(0)).toHaveText('Getting Started');
		await expect(groups.nth(1)).toHaveText('Educational');
		await expect(groups.nth(2)).toHaveText('Games');
	});

	test('displays all projects with links', async ({ page }) => {
		await page.goto('/');

		// Getting Started projects
		await expect(page.getByRole('link', { name: 'Hello World 👋' })).toBeVisible();

		// Educational projects
		await expect(page.getByRole('link', { name: 'Fibonacci Sequence 🐚' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Math Quiz 🧮' })).toBeVisible();

		// Games projects
		await expect(page.getByRole('link', { name: 'Pong 🏓' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Tic-Tac-Toe #️⃣' })).toBeVisible();
	});

	test('project links navigate to correct pages', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Hello World 👋' }).click();
		await expect(page).toHaveURL(/\/projects\/hello-world$/);
		await expect(page).toHaveTitle('Hello World 👋');
	});
});
