import { log, ProxyConfiguration } from 'apify';
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import { firefox } from 'playwright';
import { UserData } from '../models/input.js';
import createPlaywrightRouterWithInput from '../router.js';

export const createPlaywrightCrawler = async (
	playwrightQueue: RequestQueue,
	cheerioQueue: RequestQueue,
	input: UserData,
): Promise<PlaywrightCrawler> => {
	const playwrightRouter = await createPlaywrightRouterWithInput(input);
	return new PlaywrightCrawler({
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
			log.debug(
				`PlaywrightCrawler handling request ${context.request.url} with label ${context.request.label}`,
			);
			await playwrightRouter({ ...context, cheerioQueue });
		},
	});
};

export default createPlaywrightCrawler;
