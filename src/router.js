import { writable } from 'svelte/store';

export const page = writable('');

export const initPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    updatePage(pageParam);
};

export const updatePage = (newPage) => page.update(() => {
    const sanitizedPage = newPage?.toLowerCase();
    const url = new URL(window.location);
    for (const key of url.searchParams.keys()) {
        url.searchParams.delete(key);
    }
    switch (sanitizedPage) {
        case 'about':
        case 'project':
            url.searchParams.set('page', sanitizedPage);
            break;
        default:
            url.searchParams.set('page', '');
            break;
    }
    history.pushState({}, '', url);
    return newPage;
});