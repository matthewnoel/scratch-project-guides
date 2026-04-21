import { expect, test } from '@playwright/test';

// These tests pin the behavior of the markdown-it + CustomMarkdown pipeline so
// dependency updates to markdown-it, scratchblocks, or the Svelte 5 runtime
// can be caught early. They exercise the real rendered DOM on project pages
// where the markdown source is well-known and relatively stable.

test.describe('Markdown rendering (markdown-it integration)', () => {
	test('renders level-1 headings from H1 markdown', async ({ page }) => {
		await page.goto('/projects/hello-world');
		await expect(page.getByRole('heading', { level: 1, name: 'Hello World 👋' })).toBeVisible();
	});

	test('renders level-2 headings from H2 markdown', async ({ page }) => {
		await page.goto('/projects/hello-world');
		await expect(
			page.getByRole('heading', { level: 2, name: 'A classic first program' })
		).toBeVisible();
	});

	test('renders paragraphs', async ({ page }) => {
		await page.goto('/projects/hello-world');
		await expect(page.getByText("Great job! You've written your first program.")).toBeVisible();
	});

	test('renders inline code with <code> tags', async ({ page }) => {
		await page.goto('/projects/hello-world');
		// "Events" and "Looks" are wrapped in backticks in the source
		const eventsCode = page.locator('code', { hasText: 'Events' }).first();
		await expect(eventsCode).toBeVisible();
		await expect(eventsCode).toHaveText('Events');
	});

	test('renders external markdown links with proper href', async ({ page }) => {
		await page.goto('/projects/fibonacci-sequence');
		const link = page.getByRole('link', {
			name: 'Learn more about the Fibonacci sequence.'
		});
		await expect(link).toHaveAttribute(
			'href',
			'https://www.mathsisfun.com/numbers/fibonacci-sequence.html'
		);
	});

	test('renders bold/strong text from markdown', async ({ page }) => {
		await page.goto('/projects/pong');
		// "**This Project Is Incomplete**" should render as <strong>
		const strong = page.locator('strong', { hasText: 'This Project Is Incomplete' });
		await expect(strong).toBeVisible();
	});

	test('renders ordered and unordered lists', async ({ page }) => {
		await page.goto('/submit-project');
		const preview = page.getByLabel('Markdown preview');
		// Default markdown has both an unordered (Materials) and ordered (Steps) list
		await expect(preview.locator('ul li', { hasText: 'Scratch' }).first()).toBeVisible();
		await expect(preview.locator('ol li').first()).toBeVisible();
	});

	test('does not render scratchblocks fences as <pre><code>', async ({ page }) => {
		await page.goto('/projects/hello-world');
		// The CustomMarkdown splitter hands scratchblocks fences to the scratchblocks
		// renderer instead of markdown-it, so there should be no <pre><code> block
		// containing the literal scratchblocks source.
		const pre = page.locator('pre code', { hasText: 'when green flag clicked' });
		await expect(pre).toHaveCount(0);
	});

	test('renders a blockquote fence as code block for non-scratchblocks fences', async ({
		page
	}) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		await textarea.fill('# Test\n\n```\nplain code\n```\n');
		const preview = page.getByLabel('Markdown preview');
		await expect(preview.locator('pre code')).toHaveText(/plain code/);
	});

	test('renders inline HTML entities correctly', async ({ page }) => {
		await page.goto('/submit-project');
		const textarea = page.getByLabel('Markdown editor');
		// markdown-it should HTML-escape raw characters in text content
		await textarea.fill('# Safe\n\n<script>alert(1)</script>');
		const preview = page.getByLabel('Markdown preview');
		// The literal text should appear as-is; no actual script tag should be injected
		await expect(preview.getByText('<script>alert(1)</script>')).toBeVisible();
		const scriptCount = await preview.locator('script').count();
		expect(scriptCount).toBe(0);
	});
});
