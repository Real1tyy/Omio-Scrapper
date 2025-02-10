import { PlaywrightCrawler, PlaywrightCrawlerOptions, RequestQueue } from 'crawlee';
import router from '../routers/playwright.js';
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
): Promise<CustomPlaywrightCrawler> => {
  const options: PlaywrightCrawlerOptions = {
    async requestHandler(context) {
      const { request } = context;
      context.cheerioQueue = cheerioQueue;
      logger.info(`PlaywrightCrawler handling request ${request.url} with label ${request.label}`);
      await router(context);
    },
    failedRequestHandler: async ({ request }) => {
      logger.error(
        `PlaywrightCrawler failed to handle request ${request.url} with label ${request.label}`,
      );
    },
    headless: true,
    requestQueue: playwrightQueue,
  };
  return new CustomPlaywrightCrawler(options, cheerioQueue);
};

export default createPlaywrightCrawler;
