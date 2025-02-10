import { Dataset } from 'crawlee';
import { createCheerioCrawler } from './crawlers/cheerio.js';
import createPlaywrightCrawler from './crawlers/playwright.js';
import createRequestQueues from './crawlers/requestQueue.js';
import logger from './utils/logger.js';

const main = async () => {
  try {
    logger.debug('Starting the scraping process...');

    const { playwrightQueue, cheerioQueue } = await createRequestQueues();

    const playwrightCrawler = await createPlaywrightCrawler(playwrightQueue, cheerioQueue);
    const cheerioCrawler = await createCheerioCrawler(cheerioQueue, playwrightQueue);

    logger.debug(
      `playwright queue requests: ${await playwrightCrawler.requestQueue?.getTotalCount()}`,
    );
    logger.debug(`cheerio queue requests: ${await cheerioCrawler.requestQueue?.getTotalCount()}`);

    logger.debug('Starting Playwright crawler...');
    await playwrightCrawler.run();
    logger.debug('Playwright crawler finished.');

    logger.debug('Starting Cheerio crawler...');
    await cheerioCrawler.run();
    logger.debug('Cheerio crawler finished.');

    // Process and export the dataset
    const data = await Dataset.getData();
    console.log(`Data amount: ${data.count}`);
    // await Dataset.exportToCSV('result.csv');

    logger.debug('Data has been exported to result.csv');
  } catch (error) {
    logger.error('An error occurred during the scraping process:', error);
  }
};

main();
