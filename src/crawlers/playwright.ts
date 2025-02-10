import { Actor } from 'apify';
import { PlaywrightCrawler, PlaywrightCrawlerOptions, RequestQueue } from 'crawlee';
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
  const proxyConfiguration = await Actor.createProxyConfiguration({
    useApifyProxy: true,
  });

  if (!proxyConfiguration) {
    throw new Error('Proxy configuration not found');
  }

  const playwrightRouter = await createPlaywrightRouterWithInput(input);
  const options: PlaywrightCrawlerOptions = {
    async requestHandler(context) {
      const { request } = context;
      context.cheerioQueue = cheerioQueue;
      logger.info(`PlaywrightCrawler handling request ${request.url} with label ${request.label}`);
      await playwrightRouter(context);
    },
    failedRequestHandler: async ({ request }) => {
      logger.error(
        `PlaywrightCrawler failed to handle request ${request.url} with label ${request.label}`,
      );
    },
    headless: false,
    requestQueue: playwrightQueue,
    proxyConfiguration,
  };
  return new CustomPlaywrightCrawler(options, cheerioQueue);
};

export default createPlaywrightCrawler;
