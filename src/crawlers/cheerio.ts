import { CheerioCrawler, CheerioCrawlerOptions, RequestQueue } from 'crawlee';
import { Input } from '../models/model.js';
import createCheerioRouterwithInput from '../routers/cheerio.js';
import logger from '../utils/logger.js';

class CustomCheerioCrawler extends CheerioCrawler {
	playwrightQueue: RequestQueue;

	constructor(options: CheerioCrawlerOptions, playwrightQueue: RequestQueue) {
		super(options);
		this.playwrightQueue = playwrightQueue;
	}
}

export const createCheerioCrawler = async (
	cheerioQueue: RequestQueue,
	playwrightQueue: RequestQueue,
	input: Input,
): Promise<CustomCheerioCrawler> => {
	const cheerioRouter = await createCheerioRouterwithInput(input);
	const options: CheerioCrawlerOptions = {
		async requestHandler(context) {
			const { request } = context;
			context.playwrightQueue = playwrightQueue;
			logger.debug(
				`CheerioCrawler handling request ${request.url} with label ${request.label}`,
			);
			await cheerioRouter(context);
		},
		failedRequestHandler: async ({ request }) => {
			logger.error(
				`CheerioCrawler failed to handle request ${request.url} with label ${request.label}`,
			);
		},
		requestQueue: cheerioQueue,
	};

	return new CustomCheerioCrawler(options, playwrightQueue);
};

export default createCheerioCrawler;
