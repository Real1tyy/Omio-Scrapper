import { log } from 'apify';
import { CheerioCrawler, RequestQueue } from 'crawlee';
import { UserData } from '../models/input.js';
import createCheerioRouterwithInput from '../routers/cheerio.js';

export const createCheerioCrawler = async (
	cheerioQueue: RequestQueue,
	playwrightQueue: RequestQueue,
	input: UserData,
): Promise<CheerioCrawler> => {
	const cheerioRouter = await createCheerioRouterwithInput(input);
	return new CheerioCrawler({
		requestHandler: async (context) => {
			log.debug(
				`CheerioCrawler handling request ${context.request.url} with label ${context.request.label}`,
			);
			await cheerioRouter({ ...context, playwrightQueue });
		},
		requestQueue: cheerioQueue,
	});
};

export default createCheerioCrawler;
