import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { projectsData } from '$lib/projects';

export const load: PageLoad = ({ params }) => {
	if (!(params.slug in projectsData)) {
		error(404, 'Not found');
	}
	return {
		// @ts-expect-error because of laziness
		title: projectsData[params.slug].title,
		// @ts-expect-error because of laziness
		markdown: projectsData[params.slug].markdown
	};
};
