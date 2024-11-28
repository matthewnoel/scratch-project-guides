import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async (params) => {
	return {
		page: params.route.id,
	};
};
