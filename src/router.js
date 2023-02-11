import { writable } from 'svelte/store';

export const page = writable('');
export const updatePage = (newPage) => page.update(() => newPage);