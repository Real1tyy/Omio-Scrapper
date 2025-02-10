import { RequestQueue } from 'crawlee';
import { BASE_LABEL } from '../constants/labels.js';
import { BASE_URL } from '../constants/links.js';

const createRequestQueues = async (): Promise<{
  playwrightQueue: RequestQueue;
  cheerioQueue: RequestQueue;
}> => {
  let playwrightQueue = await RequestQueue.open('playwright-queue');
  await playwrightQueue.drop();
  let cheerioQueue = await RequestQueue.open('cheerio-queue');
  await cheerioQueue.drop();

  playwrightQueue = await RequestQueue.open('playwright-queue');
  cheerioQueue = await RequestQueue.open('cheerio-queue');

  await playwrightQueue.addRequests([]);

  await cheerioQueue.addRequests([
    {
      url: BASE_URL,
      label: BASE_LABEL,
    },
  ]);

  return { playwrightQueue, cheerioQueue };
};

export default createRequestQueues;
