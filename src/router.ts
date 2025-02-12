import { createCheerioRouter, createPlaywrightRouter } from 'crawlee';
import { LABELS } from './constants.js';
import baseHandleStart from './handlers/start.js';
import { Input } from './models/input.js';

export const createPlaywrightRouterWithInput = async (input: Input) => {
	const playwrightRouter = createPlaywrightRouter();
	playwrightRouter.addHandler(LABELS.SEARCH, baseHandleStart(input));

	return playwrightRouter;
};

export const createCheerioRouterwithInput = async () => {
	const cheerioRouter = createCheerioRouter();
	return cheerioRouter;
};
