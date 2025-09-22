import { log } from "apify";
import { CheerioCrawler, type RequestQueue } from "crawlee";
import { createCheerioRouterwithInput } from "../router.js";

export const createCheerioCrawler = async (
	cheerioQueue: RequestQueue,
	playwrightQueue: RequestQueue
): Promise<CheerioCrawler> => {
	const cheerioRouter = await createCheerioRouterwithInput();
	return new CheerioCrawler({
		requestHandler: async (context) => {
			log.debug(`CheerioCrawler handling request ${context.request.url} with label ${context.request.label}`);
			await cheerioRouter({ ...context, playwrightQueue });
		},
		requestQueue: cheerioQueue,
	});
};

export default createCheerioCrawler;
