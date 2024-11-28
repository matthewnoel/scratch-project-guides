import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { projects } from '$lib/projects';

export const load: PageLoad = ({ params }) => {
    if (!(params.slug in projects)) {
        error(404, 'Not found');
    }
    return {
        markdown: projects[params.slug].markdown,
    };
};
