import { Actor, log } from 'apify';
import createPlaywrightCrawler from './crawlers/playwright.js';
import createRequestQueues from './crawlers/requestQueue.js';
import { getValidatedInput } from './models/input.js';

Actor.main(async () => {
	const input = await getValidatedInput();
	console.log(input);
	process.exit(0);
	const { playwrightQueue, cheerioQueue } = await createRequestQueues();
	const playwrightCrawler = await createPlaywrightCrawler(playwrightQueue, cheerioQueue, input);

	// prepared for use if needed
	// const cheerioCrawler = await createCheerioCrawler(cheerioQueue, playwrightQueue, input);
	log.debug('Starting Playwright crawler...');
	await playwrightCrawler.run();
	log.debug('Playwright crawler finished.');
});
