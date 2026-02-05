import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workflowsDir = path.join(__dirname, '../.github/workflows');
const projectsDir = path.join(__dirname, '../projects');

// Get category names from the projects directory subfolders
const getCategories = () => {
	return fs
		.readdirSync(projectsDir)
		.filter((file) => fs.statSync(path.join(projectsDir, file)).isDirectory())
		.sort();
};

const GENERATED_HEADER = `# ============================================================================
# THIS FILE IS GENERATED - DO NOT EDIT DIRECTLY
# ============================================================================
# To modify this workflow, edit scripts/generate-workflows.js and run:
#   npm run generate-workflows
# ============================================================================

`;

// Shared steps that are used in both integration and submit-project workflows
const sharedSteps = {
	checkout: `      - name: 🏃 Run actions/checkout@v4
        uses: actions/checkout@v4`,

	setupNode: `      - name: 🏃 Run actions/setup-node@v4
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'`,

	installDeps: `      - name: 🪜 Install dependencies
        run: npm ci`,

	generateLicenses: `      - name: 🧑‍⚖️ Generate license file
        run: npm run licenses`,

	generateProjects: `      - name: 📽️ Generate project files
        run: npm run generate-projects`,

	format: `      - name: 📝 Format project
        run: npm run format`,

	lint: `      - name: 🔍 Lint project
        run: npm run lint`,

	svelteCheck: `      - name: ✅ Svelte check
        run: npm run check`,

	build: `      - name: 🏗️ Build project
        run: npm run build`,

	setupPlaywright: `      - name: 🎭 Set up playwright
        run: npx playwright install`,

	runTests: `      - name: 🧪 Run tests
        run: npm test`
};

// Generate integration.yml
const generateIntegration = () => {
	const content = `${GENERATED_HEADER}name: 🌀 PR Integration Workflow

on:
  push:
    branches:
      - '**'
      - '!main'

jobs:
  build:
    permissions:
      contents: write

    runs-on: ubuntu-latest

    steps:
${sharedSteps.checkout}
${sharedSteps.setupNode}
${sharedSteps.installDeps}
${sharedSteps.generateLicenses}
${sharedSteps.generateProjects}
${sharedSteps.format}
      - name: 💾 Add and commit changes
        uses: EndBug/add-and-commit@v9.1.4
${sharedSteps.lint}
${sharedSteps.svelteCheck}
${sharedSteps.build}
${sharedSteps.setupPlaywright}
${sharedSteps.runTests}
`;

	return content;
};

// Generate submit-project.yml with embedded integration steps
const generateSubmitProject = (categories) => {
	const categoriesArrayString = JSON.stringify(categories);
	const content = `${GENERATED_HEADER}name: 📝 Submit New Project Guide

on:
  issues:
    types: [opened, labeled]

jobs:
  create-pr:
    runs-on: ubuntu-latest
    if: contains(github.event.issue.labels.*.name, 'project-submission')

    permissions:
      contents: write
      pull-requests: write
      issues: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Parse issue body
        id: parse
        uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.issue.body;

            // Parse the issue form fields
            const categoryMatch = body.match(/### Category\\s*\\n\\n(.+?)(?=\\n\\n###|\\n*$)/s);
            const projectNameMatch = body.match(/### Project URL Slug\\s*\\n\\n(.+?)(?=\\n\\n###|\\n*$)/s);
            const contentMatch = body.match(/### Project Markdown\\s*\\n\\n([\\s\\S]+?)$/);

            if (!categoryMatch || !projectNameMatch || !contentMatch) {
              core.setFailed('Could not parse issue body. Please ensure all fields are filled out.');
              return;
            }

            const category = categoryMatch[1].trim();
            const projectName = projectNameMatch[1].trim();
            const markdownContent = contentMatch[1].trim();

            // Validate category
            const validCategories = ${categoriesArrayString};
            if (!validCategories.includes(category)) {
              core.setFailed(\`Invalid category: \${category}. Must be one of: \${validCategories.join(', ')}\`);
              return;
            }

            // Sanitize filename
            const filename = projectName
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            core.setOutput('category', category);
            core.setOutput('project_name', projectName);
            core.setOutput('filename', filename);
            core.setOutput('filepath', \`projects/\${category}/\${filename}.md\`);

            // Write content to a file for the next step
            const fs = require('fs');
            fs.writeFileSync('markdown_content.tmp', markdownContent);

      - name: Create new branch
        run: |
          BRANCH_NAME="project-submission-\${{ github.event.issue.number }}"
          git checkout -b "$BRANCH_NAME"
          echo "BRANCH_NAME=$BRANCH_NAME" >> $GITHUB_ENV

      - name: Create project file
        run: |
          FILEPATH="\${{ steps.parse.outputs.filepath }}"

          # Create directory if it doesn't exist
          mkdir -p "$(dirname "$FILEPATH")"

          # Move the temp content file to the final location
          mv markdown_content.tmp "$FILEPATH"

      # ========================================================================
      # Integration steps - these replicate the PR Integration Workflow
      # This is necessary because the integration workflow cannot automatically
      # run on PRs created by this workflow due to GitHub security restrictions
      # ========================================================================

${sharedSteps.setupNode}
${sharedSteps.installDeps}
${sharedSteps.generateLicenses}
${sharedSteps.generateProjects}
${sharedSteps.format}

      - name: 💾 Commit all changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "Add new project: \${{ steps.parse.outputs.project_name }}"
          git push origin "$BRANCH_NAME"

${sharedSteps.lint}
${sharedSteps.svelteCheck}
${sharedSteps.build}
${sharedSteps.setupPlaywright}
${sharedSteps.runTests}

      - name: Create Pull Request
        env:
          GH_TOKEN: \${{ github.token }}
        run: |
          gh pr create \\
            --title "New Project Submission: \${{ steps.parse.outputs.project_name }}" \\
            --body "**Category:** \${{ steps.parse.outputs.category }}
          **Submitted by:** @\${{ github.event.issue.user.login }}
          **Issue:** #\${{ github.event.issue.number }}

          This PR adds a new project to the site. Please review the content for quality and appropriateness before merging.

          Closes #\${{ github.event.issue.number }}" \\
            --base main \\
            --head "$BRANCH_NAME"
`;

	return content;
};

const writeWorkflow = (filename, content) => {
	const filePath = path.join(workflowsDir, filename);

	if (fs.existsSync(filePath)) {
		const existingContent = fs.readFileSync(filePath, 'utf8');
		if (content === existingContent) {
			console.log(`${filename} already up to date`);
			return;
		}
	}

	fs.writeFileSync(filePath, content);
	console.log(`${filename} generated successfully`);
};

// Ensure workflows directory exists
if (!fs.existsSync(workflowsDir)) {
	fs.mkdirSync(workflowsDir, { recursive: true });
}

// Get categories from project folders
const categories = getCategories();
console.log(`Found categories: ${categories.join(', ')}`);

// Generate both workflows
writeWorkflow('integration.yml', generateIntegration());
writeWorkflow('submit-project.yml', generateSubmitProject(categories));

console.log('Workflow generation complete');
