import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../projects');

const getFiles = () => {
    return fs.readdirSync(projectsDir);
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
    const files = getFiles();
    const names = cleanFileNames(files);
    const objects = {};
    for (const name of names) {
        objects[name] = {
            title: name,
            markdown: fs.readFileSync(path.join(projectsDir, `${name}.md`), 'utf8')
        };
    }
    const content = `export const projects = ${JSON.stringify(objects)};\n`;

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File created successfully');
    });
};

createModule();
