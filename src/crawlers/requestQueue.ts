import { Actor, ApifyClient, log } from 'apify';
import { RequestQueue } from 'crawlee';
import { LABELS, SEARCH_URL } from '../constants.js';

const createRequestQueues = async (): Promise<{
	playwrightQueue: RequestQueue;
	cheerioQueue: RequestQueue;
}> => {
	const apifyClient = new ApifyClient();
	const playwrightQueueMetadata = await apifyClient.requestQueues().getOrCreate();
	const cheerioQueueMetadata = await apifyClient.requestQueues().getOrCreate();
	const playwrightQueue = await Actor.openRequestQueue(playwrightQueueMetadata.id);
	const cheerioQueue = await Actor.openRequestQueue(cheerioQueueMetadata.id);

	await playwrightQueue.addRequests([
		{
			url: SEARCH_URL,
			label: LABELS.SEARCH,
		},
	]);
	await cheerioQueue.addRequests([]);
	log.debug(`playwright queue requests: ${await playwrightQueue.getTotalCount()}`);
	log.debug(`cheerio queue requests: ${await cheerioQueue.getTotalCount()}`);
	return { playwrightQueue, cheerioQueue };
};

export default createRequestQueues;
