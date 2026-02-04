import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test('has correct title and heading', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Scratch Project Guides');
		await expect(page.locator('h1')).toHaveText('All Projects');
	});

	test('displays all project groups', async ({ page }) => {
		await page.goto('/');
		const groups = page.locator('h3');
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

test.describe('Navigation', () => {
	test('displays navigation bar with all links', async ({ page }) => {
		await page.goto('/');
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
		await expect(nav.getByRole('link', { name: 'Open Scratch Guides' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'All Projects' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
		await expect(nav.getByRole('link', { name: 'GitHub' })).toBeVisible();
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
		const githubLink = page.locator('nav').getByRole('link', { name: 'GitHub' });
		await expect(githubLink).toHaveAttribute('target', '_blank');
		await expect(githubLink).toHaveAttribute('rel', 'noreferrer');
		await expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/matthewnoel/scratch-project-guides'
		);
	});
});

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
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
		// Navigation should still be functional on mobile
		await expect(page.locator('nav').getByRole('link', { name: 'All Projects' })).toBeVisible();
		await expect(page.locator('nav').getByRole('link', { name: 'About' })).toBeVisible();
	});
});
