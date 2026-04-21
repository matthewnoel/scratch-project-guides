import { expect, test } from '@playwright/test';

test.describe('Submit Project Page', () => {
	test('has correct title and heading', async ({ page }) => {
		await page.goto('/submit-project');
		await expect(page.getByRole('heading', { level: 1, name: 'Submit a Guide' })).toBeVisible();
	});

	test('renders editor and preview panes', async ({ page }) => {
		await page.goto('/submit-project');
		await expect(page.getByText('Markdown', { exact: true })).toBeVisible();
		await expect(page.getByText('Preview', { exact: true })).toBeVisible();
		await expect(page.getByLabel('Markdown editor')).toBeVisible();
		await expect(page.getByLabel('Markdown preview')).toBeVisible();
	});

	test('preview renders default markdown', async ({ page }) => {
		await page.goto('/submit-project');
		const preview = page.getByLabel('Markdown preview');
		await expect(
			preview.getByRole('heading', { level: 1, name: 'New Scratch Project' })
		).toBeVisible();
		await expect(preview.getByRole('heading', { level: 2, name: 'Materials' })).toBeVisible();
		await expect(preview.getByRole('heading', { level: 2, name: 'Steps' })).toBeVisible();
	});

	test('editor textarea contains default markdown', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		const value = await textarea.inputValue();
		expect(value).toContain('# New Scratch Project');
		expect(value).toContain('## Materials');
		expect(value).toContain('## Steps');
		expect(value).toContain('```scratchblocks');
	});

	test('typing in editor updates the preview live', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		await textarea.fill('# Custom Heading\n\nSome body text.');
		const preview = page.getByLabel('Markdown preview');
		await expect(preview.getByRole('heading', { level: 1, name: 'Custom Heading' })).toBeVisible();
		await expect(preview.getByText('Some body text.')).toBeVisible();
	});

	test('preview renders scratchblocks when fenced with scratchblocks language', async ({
		page
	}) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		await textarea.fill('# Test\n\n```scratchblocks\nwhen green flag clicked\nsay [Hi!]\n```');
		const preview = page.getByLabel('Markdown preview');
		await expect(preview.locator('svg').first()).toBeVisible({ timeout: 10000 });
	});

	test('preview embeds Scratch project for scratch project URL lines', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		await textarea.fill('# Test\n\nhttps://scratch.mit.edu/projects/123456789/\n');
		const preview = page.getByLabel('Markdown preview');
		await expect(preview.locator('iframe')).toHaveAttribute(
			'src',
			/scratch\.mit\.edu\/projects\/123456789/
		);
	});

	test('FileName input transforms values to kebab-case', async ({ page }) => {
		await page.goto('/submit-project');
		const fileNameInput = page.getByLabel('Project file name').first();
		await fileNameInput.fill('My Cool Project!!!');
		await expect(fileNameInput).toHaveValue('my-cool-project-');
	});

	test('FileName input shows file path decoration', async ({ page }) => {
		await page.goto('/submit-project');
		await expect(page.getByText('/projects/').first()).toBeVisible();
		await expect(page.getByText('.md').first()).toBeVisible();
	});

	test('trash button is hidden initially with default markdown and no file name', async ({
		page
	}) => {
		await page.goto('/submit-project');
		await expect(page.getByRole('button', { name: 'Clear all backups' })).toBeHidden();
	});

	test('trash button appears when markdown is changed from default', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		await textarea.fill('# Something different');
		await expect(page.getByRole('button', { name: 'Clear all backups' })).toBeVisible();
	});

	test('trash button appears when file name is set', async ({ page }) => {
		await page.goto('/submit-project');
		const fileNameInput = page.getByLabel('Project file name').first();
		await fileNameInput.fill('my-guide');
		await expect(page.getByRole('button', { name: 'Clear all backups' })).toBeVisible();
	});

	test('trash button opens confirmation modal and cancel preserves state', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		await textarea.fill('# Custom Content');
		await page.getByRole('button', { name: 'Clear all backups' }).click();

		const dialog = page.getByRole('dialog', { name: /Clear all backups/ });
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: 'Cancel' }).click();
		await expect(dialog).toBeHidden();
		// textarea should still contain the edited content
		await expect(textarea).toHaveValue('# Custom Content');
	});

	test('trash button confirm restores default markdown', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		await textarea.fill('# Wiped Out');
		await page.getByRole('button', { name: 'Clear all backups' }).click();
		await page
			.getByRole('dialog', { name: /Clear all backups/ })
			.getByRole('button', { name: 'Trash' })
			.click();
		// After trash, textarea content should be reset to default
		const value = await textarea.inputValue();
		expect(value).toContain('# New Scratch Project');
	});

	test('OCR button opens modal and closes it', async ({ page }) => {
		await page.goto('/submit-project');
		await page.getByRole('button', { name: 'Import text from an image' }).click();
		const dialog = page.getByRole('dialog', { name: /Add code from screenshot/ });
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: 'Close modal' }).first().click();
		await expect(dialog).toBeHidden();
	});

	test('OCR modal contains a file dropzone', async ({ page }) => {
		await page.goto('/submit-project');
		await page.getByRole('button', { name: 'Import text from an image' }).click();
		const dialog = page.getByRole('dialog', { name: /Add code from screenshot/ });
		await expect(dialog.getByText('Click or drag an image here')).toBeVisible();
	});

	test('Submit button opens the submission modal', async ({ page }) => {
		await page.goto('/submit-project');
		await page.getByRole('button', { name: 'Submit My Project' }).click();
		const dialog = page.getByRole('dialog', { name: /Submit your project/ });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByText('Create a GitHub account.')).toBeVisible();
		await expect(dialog.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
			'href',
			'https://github.com/signup'
		);
	});

	test('Submit modal closes via Escape key', async ({ page }) => {
		await page.goto('/submit-project');
		await page.getByRole('button', { name: 'Submit My Project' }).click();
		const dialog = page.getByRole('dialog', { name: /Submit your project/ });
		await expect(dialog).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
	});

	test('Submit modal steps advance as user confirms each step', async ({ page }) => {
		await page.goto('/submit-project');
		await page.getByRole('button', { name: 'Submit My Project' }).click();
		const dialog = page.getByRole('dialog', { name: /Submit your project/ });

		// Step 2 "Got It" should be disabled until both "I Have One" clicked and a valid file name is entered
		const gotIt = dialog.getByRole('button', { name: 'Got It' });
		await expect(gotIt).toBeDisabled();

		await dialog.getByRole('button', { name: 'I Have One' }).click();
		// Still disabled because no file name yet
		await expect(gotIt).toBeDisabled();

		await dialog.getByLabel('Project file name').fill('my-project');
		await expect(gotIt).toBeEnabled();

		await gotIt.click();
		// Step 3 "Copy" button should be enabled now
		const copyBtn = dialog.getByRole('button', { name: 'Copy' });
		await expect(copyBtn).toBeEnabled();
	});

	test('Submit modal "Go to Form" anchor is initially disabled and points to the issue template when enabled', async ({
		page,
		context,
		browserName
	}) => {
		if (browserName === 'chromium') {
			await context.grantPermissions(['clipboard-write', 'clipboard-read']);
		}
		await page.goto('/submit-project');
		await page.getByRole('button', { name: 'Submit My Project' }).click();
		const dialog = page.getByRole('dialog', { name: /Submit your project/ });

		// While disabled, the Button renders an <a> with aria-disabled and no href.
		const goToFormDisabled = dialog.locator('a', { hasText: 'Go to Form' });
		await expect(goToFormDisabled).toHaveAttribute('aria-disabled', 'true');

		// Walk through steps to enable Go to Form
		await dialog.getByRole('button', { name: 'I Have One' }).click();
		await dialog.getByLabel('Project file name').fill('example');
		await dialog.getByRole('button', { name: 'Got It' }).click();
		await dialog.getByRole('button', { name: 'Copy' }).click();
		await expect(dialog.getByText('Copied!')).toBeVisible({ timeout: 2000 });

		const goToForm = dialog.getByRole('link', { name: 'Go to Form' });
		await expect(goToForm).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides/issues/new?template=project-submission.yml'
		);
		await expect(goToForm).toHaveAttribute('target', '_blank');
	});

	test('editor content persists to localStorage and reloads', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		const fileNameInput = page.getByLabel('Project file name').first();

		await fileNameInput.fill('saved-guide');
		await textarea.fill('# Saved Guide\n\nPersisted content.');

		// Wait for the debounced localStorage save (debounce is 1s in both inputs)
		await page.waitForTimeout(1500);

		// Verify it was written to localStorage
		const stored = await page.evaluate(() => {
			return Object.keys(localStorage).map((key) => ({ key, value: localStorage.getItem(key) }));
		});
		expect(stored.length).toBeGreaterThan(0);
		const match = stored.find((item) => item.key === 'saved-guide');
		expect(match).toBeDefined();
		expect(match?.value).toContain('Saved Guide');

		// Reload and confirm the content is restored
		await page.reload();
		await expect(page.getByLabel('Markdown editor')).toHaveValue(/Saved Guide/);
		await expect(page.getByLabel('Project file name').first()).toHaveValue('saved-guide');
	});

	test('layout uses the full width for submit-project (no GitLinks footer)', async ({ page }) => {
		await page.goto('/submit-project');
		// Submit project page should NOT show the GitLinks feedback footer
		await expect(page.getByRole('link', { name: 'Give Feedback' })).toBeHidden();
		await expect(page.getByRole('link', { name: 'Edit this page on GitHub' })).toBeHidden();
	});
});
