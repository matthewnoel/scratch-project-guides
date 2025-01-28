import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../projects');

const getFolders = () => {
	return fs.readdirSync(projectsDir).filter((file) => {
		return fs.statSync(path.join(projectsDir, file)).isDirectory();
	});
};

const getFiles = (subdirectory) => {
	return fs.readdirSync(path.join(projectsDir, subdirectory));
};

const cleanFileNames = (files) => {
	const names = [];

	for (const file of files) {
		if (!file.endsWith('.md')) {
			continue;
		}
		const name = file.replace('.md', '');
		names.push(name);
	}

	return names;
};

const createModule = () => {
	const filePath = path.join(__dirname, '../src/lib/projects.js');
	const folders = getFolders();
	const dictionary = {};
	const array = [];
	const projects = [];

	for (const folder of folders) {
		const group = { folder: folder, projects: [] };
		const files = getFiles(folder);
		const names = cleanFileNames(files);
		for (const name of names) {
			projects.push(name);
			const markdown = fs.readFileSync(path.join(projectsDir, folder, `${name}.md`), 'utf8');
			const title = markdown
				.split('\n')
				.find((line) => line.startsWith('# '))
				.substring(2); // todo: better title extraction
			dictionary[name] = {
				title,
				category: folder,
				markdown
			};
			group.projects.push({
				slug: name,
				title,
				markdown
			});
		}
		array.push(group);
	}

	array.sort((a, b) => {
		if (a.folder === 'Getting Started') {
			return -1;
		}
		return a.folder.localeCompare(b.folder);
	});

	const content = `export const groupedProjects = ${JSON.stringify(array)};\nexport const projectsData = ${JSON.stringify(dictionary)};\nexport const projects = ${JSON.stringify(projects)};\n`;

	if (fs.existsSync(filePath)) {
		const existingContent = fs.readFileSync(filePath, 'utf8');
		if (content === existingContent) {
			console.log('File already up to date');
			return;
		}
	}

	fs.writeFile(filePath, content, (err) => {
		if (err) {
			console.error('Error writing file:', err);
			return;
		}
		console.log('File created successfully');
	});
};

createModule();
