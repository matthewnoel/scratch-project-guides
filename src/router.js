import { writable } from 'svelte/store';

export const page = writable('');
export const projectName = writable('');
const projectNames = [
    'hello-world',
    'pong',
    'tic-tac-toe',
    'math-quiz',
]

export const initPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const nameParam = urlParams.get('name');
    updatePage(pageParam, nameParam);
};

const setProjectName = (name) => {
    if (projectNames.includes(name)) {
        projectName.update(() => name);
        return name;
    }
    return '';
};

export const updatePage = (newPage, project) => page.update(() => {
    const sanitizedPage = newPage?.toLowerCase();
    const url = new URL(window.location);
    for (const key of url.searchParams.keys()) {
        url.searchParams.delete(key);
    }
    switch (sanitizedPage) {
        case 'about':
        case 'project':
            url.searchParams.set('page', sanitizedPage);
            url.searchParams.set('name', setProjectName(project));
            break;
        default:
            url.searchParams.set('page', '');
            break;
    }
    history.pushState({}, '', url);
    return newPage;
});
