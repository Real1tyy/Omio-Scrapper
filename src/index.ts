import { Actor } from 'apify';
import { Dataset } from 'crawlee';
import { createCheerioCrawler } from './crawlers/cheerio.js';
import createPlaywrightCrawler from './crawlers/playwright.js';
import createRequestQueues from './crawlers/requestQueue.js';
import { Input, RawInput } from './models/model.js';
import logger from './utils/logger.js';

async function getAndValidateInput(): Promise<Input> {
  const rawInput: RawInput | null = await Actor.getInput();
  if (!rawInput) {
    throw new Error('No input provided');
  }

  const [year, day, month] = rawInput.date.split('-').map(Number);
  const finalDate = new Date(Date.UTC(year, month - 1, day));

  return {
    ...rawInput,
    date: finalDate,
  };
}

Actor.main(async () => {
  const input = await getAndValidateInput();
  console.log(input);
  console.log('TESTER');
  console.log('TESTE3R');

  const { playwrightQueue, cheerioQueue } = await createRequestQueues();

  const playwrightCrawler = await createPlaywrightCrawler(playwrightQueue, cheerioQueue, input);
  const cheerioCrawler = await createCheerioCrawler(cheerioQueue, playwrightQueue, input);

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
}).catch((error) => {
  logger.error('An error occurred during the scraping process:', error);
});
