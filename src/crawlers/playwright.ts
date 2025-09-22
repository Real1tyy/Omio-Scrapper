import { Actor, log } from "apify";
import { PlaywrightCrawler, type RequestQueue } from "crawlee";
import { firefox } from "playwright";
import type { Input } from "../models/input.js";
import { createPlaywrightRouterWithInput } from "../router.js";

export const createPlaywrightCrawler = async (
	playwrightQueue: RequestQueue,
	cheerioQueue: RequestQueue,
	input: Input
): Promise<PlaywrightCrawler> => {
	const playwrightRouter = await createPlaywrightRouterWithInput(input);
	return new PlaywrightCrawler({
		launchContext: {
			launcher: firefox,
			launchOptions: {
				headless: true,
			},
		},
		requestQueue: playwrightQueue,
		navigationTimeoutSecs: 1000000,
		sessionPoolOptions: {
			persistenceOptions: { enable: true },
			maxPoolSize: 10,
		},
		proxyConfiguration: await Actor.createProxyConfiguration(),
		requestHandler: async (context) => {
			log.debug(`PlaywrightCrawler handling request ${context.request.url} with label ${context.request.label}`);
			await playwrightRouter({ ...context, cheerioQueue });
		},
	});
};

export default createPlaywrightCrawler;
