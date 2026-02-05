import { expect, test } from '@playwright/test';

test.describe('Project Pages', () => {
	test.describe('Hello World', () => {
		test('has correct title and heading', async ({ page }) => {
			await page.goto('/projects/hello-world');
			await expect(page).toHaveTitle('Hello World 👋');
			await expect(page.locator('h1')).toHaveText('Hello World 👋');
		});

		test('displays project description', async ({ page }) => {
			await page.goto('/projects/hello-world');
			await expect(page.locator('h2')).toHaveText('A classic first program');
		});

		test('displays scratchblocks code', async ({ page }) => {
			await page.goto('/projects/hello-world');
			// Scratchblocks are rendered as SVG elements (loaded async via onMount)
			// Wait for the SVG elements to appear
			await expect(page.locator('svg').first()).toBeVisible({ timeout: 10000 });
			const svgCount = await page.locator('svg').count();
			// At least 2 scratchblocks + 1 iframe embed = 3 SVG-like elements, but iframe is not svg
			expect(svgCount).toBeGreaterThanOrEqual(2);
		});

		test('embeds Scratch project', async ({ page }) => {
			await page.goto('/projects/hello-world');
			const iframe = page.locator('iframe');
			await expect(iframe).toBeVisible();
			await expect(iframe).toHaveAttribute('src', /scratch\.mit\.edu\/projects\/807782232/);
		});
	});

	test.describe('Fibonacci Sequence', () => {
		test('has correct title and heading', async ({ page }) => {
			await page.goto('/projects/fibonacci-sequence');
			await expect(page).toHaveTitle('Fibonacci Sequence 🐚');
			await expect(page.locator('h1')).toHaveText('Fibonacci Sequence 🐚');
		});

		test('displays project content', async ({ page }) => {
			await page.goto('/projects/fibonacci-sequence');
			await expect(page.getByText('The Fibonacci sequence is a series of numbers')).toBeVisible();
			await expect(page.getByText('0, 1, 1, 2, 3, 5, 8, 13')).toBeVisible();
		});

		test('has external link to learn more', async ({ page }) => {
			await page.goto('/projects/fibonacci-sequence');
			const learnMoreLink = page.getByRole('link', {
				name: 'Learn more about the Fibonacci sequence.'
			});
			await expect(learnMoreLink).toHaveAttribute(
				'href',
				'https://www.mathsisfun.com/numbers/fibonacci-sequence.html'
			);
		});

		test('displays multiple scratchblocks', async ({ page }) => {
			await page.goto('/projects/fibonacci-sequence');
			// Wait for scratchblocks to load (async via onMount)
			await expect(page.locator('svg').first()).toBeVisible({ timeout: 10000 });
			const svgCount = await page.locator('svg').count();
			expect(svgCount).toBeGreaterThanOrEqual(4);
		});

		test('embeds Scratch project', async ({ page }) => {
			await page.goto('/projects/fibonacci-sequence');
			const iframe = page.locator('iframe');
			await expect(iframe).toBeVisible();
			await expect(iframe).toHaveAttribute('src', /scratch\.mit\.edu\/projects\/812115282/);
		});
	});

	test.describe('Math Quiz', () => {
		test('has correct title and heading', async ({ page }) => {
			await page.goto('/projects/math-quiz');
			await expect(page).toHaveTitle('Math Quiz 🧮');
			await expect(page.locator('h1')).toHaveText('Math Quiz 🧮');
		});

		test('displays project content', async ({ page }) => {
			await page.goto('/projects/math-quiz');
			await expect(page.getByText('Make an addition quiz tool')).toBeVisible();
			await expect(page.getByText('Going Further 🚀')).toBeVisible();
		});

		test('displays scratchblocks', async ({ page }) => {
			await page.goto('/projects/math-quiz');
			// Wait for scratchblocks to load (async via onMount)
			await expect(page.locator('svg').first()).toBeVisible({ timeout: 10000 });
			const svgCount = await page.locator('svg').count();
			expect(svgCount).toBeGreaterThanOrEqual(4);
		});
	});

	test.describe('Pong', () => {
		test('has correct title and heading', async ({ page }) => {
			await page.goto('/projects/pong');
			await expect(page).toHaveTitle('Pong 🏓');
			await expect(page.locator('h1')).toHaveText('Pong 🏓');
		});

		test('displays project content', async ({ page }) => {
			await page.goto('/projects/pong');
			await expect(page.getByText('Make the classic game')).toBeVisible();
			await expect(page.getByText("First we'll make a")).toBeVisible();
		});

		test('displays multiple scratchblocks for game logic', async ({ page }) => {
			await page.goto('/projects/pong');
			// Wait for scratchblocks to load (async via onMount)
			await expect(page.locator('svg').first()).toBeVisible({ timeout: 10000 });
			// Pong has many code blocks for ball, player, bot, etc.
			const count = await page.locator('svg').count();
			expect(count).toBeGreaterThanOrEqual(5);
		});
	});

	test.describe('Tic-Tac-Toe', () => {
		test('has correct title and heading', async ({ page }) => {
			await page.goto('/projects/tic-tac-toe');
			await expect(page).toHaveTitle('Tic-Tac-Toe #️⃣');
			await expect(page.locator('h1')).toHaveText('Tic-Tac-Toe #️⃣');
		});

		test('shows work in progress notice', async ({ page }) => {
			await page.goto('/projects/tic-tac-toe');
			await expect(page.getByText('To Do')).toBeVisible();
			await expect(page.getByRole('link', { name: 'issue 12' })).toBeVisible();
		});
	});
});
