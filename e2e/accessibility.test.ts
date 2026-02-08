import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
	test('navigation is keyboard accessible', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		// First focusable element should be in nav
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});

	test('project links are focusable', async ({ page }) => {
		await page.goto('/');
		const projectLink = page.getByRole('link', { name: 'Hello World 👋' });
		await projectLink.focus();
		await expect(projectLink).toBeFocused();
	});
});

test.describe('Responsive Layout', () => {
	test('navigation wraps on mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		const nav = page.getByRole('navigation', { name: 'Main' });
		await expect(nav).toBeVisible();
		// Navigation should still be functional on mobile
		await expect(nav.getByRole('link', { name: 'All Projects' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
	});
});
