import { ProxyConfiguration } from 'apify';
import { PlaywrightCrawler, PlaywrightCrawlerOptions, RequestQueue } from 'crawlee';
import { firefox } from 'playwright';
import { Input } from '../models/model.js';
import createPlaywrightRouterWithInput from '../routers/playwright.js';
import logger from '../utils/logger.js';

class CustomPlaywrightCrawler extends PlaywrightCrawler {
	cheerioQueue: RequestQueue;

	constructor(options: PlaywrightCrawlerOptions, cheerioQueue: RequestQueue) {
		super(options);
		this.cheerioQueue = cheerioQueue;
	}
}

export const createPlaywrightCrawler = async (
	playwrightQueue: RequestQueue,
	cheerioQueue: RequestQueue,
	input: Input,
): Promise<CustomPlaywrightCrawler> => {
	// const proxyConfiguration = await Actor.createProxyConfiguration({
	//   useApifyProxy: false,
	//   groups: ['RESIDENTIAL'],
	// });

	// if (!proxyConfiguration) {
	//   throw new Error('Proxy configuration not found');
	// }

	const playwrightRouter = await createPlaywrightRouterWithInput(input);
	const options: PlaywrightCrawlerOptions = {
		launchContext: {
			launcher: firefox,
			launchOptions: {
				headless: false,
			},
		},
		requestQueue: playwrightQueue,
		persistCookiesPerSession: true,
		useSessionPool: true,
		keepAlive: true,
		navigationTimeoutSecs: 1000000,
		sessionPoolOptions: {
			persistenceOptions: { enable: true },
			maxPoolSize: 10,
		},
		proxyConfiguration: new ProxyConfiguration({
			proxyUrls: [`http://auto:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`],
		}),
		requestHandler: async (context) => {
			const { request } = context;
			logger.info(`Handling ${request.url} with label ${request.label}`);
			await playwrightRouter(context);
		},
	};
	return new CustomPlaywrightCrawler(options, cheerioQueue);
};

export default createPlaywrightCrawler;
