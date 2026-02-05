import { expect, test } from '@playwright/test';

test.describe('404 Error Handling', () => {
	test('returns 404 for non-existent project', async ({ page }) => {
		const response = await page.goto('/projects/non-existent-project');
		expect(response?.status()).toBe(404);
	});

	test('returns 404 for invalid route', async ({ page }) => {
		const response = await page.goto('/invalid-route');
		expect(response?.status()).toBe(404);
	});
});
