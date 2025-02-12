import { Dataset, KeyValueStore, PlaywrightCrawlingContext } from 'crawlee';
import setCookieParser, { Cookie } from 'set-cookie-parser';
import { Input } from '../models/input.js';
import { orderResults, prettifyResults } from '../models/result.js';
import { acceptCookieBanner } from '../utils/accept.js';
import { addCookies } from '../utils/cookies.js';
import { dismissGoogleSignIn } from '../utils/google.js';
import { extractResults, parseResults } from '../utils/parse.js';
import { typeAndSelectValue } from '../utils/select.js';
import { ensureToggleUnchecked } from '../utils/toggle.js';

const createBaseHandleStart = (input: Input) => {
	const baseHandleStart = async (context: PlaywrightCrawlingContext) => {
		const { page, log, sendRequest } = context;
		await page.setDefaultNavigationTimeout(1000000);
		const interceptedCookies: Cookie[] = [];
		const startTime = Date.now();

		// Attach a response listener to capture set-cookie headers.
		page.on('response', async (response) => {
			try {
				const headers = response.headers();
				if (headers['set-cookie']) {
					const parsedCookies = setCookieParser(headers['set-cookie'], { map: false });
					interceptedCookies.push(...parsedCookies);
				}
			} catch {
				// Do nothing
			}
		});

		await page.goto('https://www.omio.com/');
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(5000);
		await addCookies(context, interceptedCookies);
		await acceptCookieBanner(context);
		await page.waitForTimeout(3000);

		await typeAndSelectValue('[data-id="departurePosition"]', input.from, context);
		log.info('From selected');
		await typeAndSelectValue('[data-id="arrivalPosition"]', input.to, context);
		log.info('To selected');
		await ensureToggleUnchecked(
			context,
			"[data-e2e='searchCheckbox'] [data-component='toggle'] .react-toggle",
		);
		await dismissGoogleSignIn(context);
		const searchButton = await page.waitForSelector('[data-e2e="buttonSearch"]');
		await searchButton.click();
		log.info('Search button clicked');

		const url = page.url();
		log.info(`URL: ${url.toString()}`);
		const hash = url.match(/results\/([A-Z0-9]+)\//)?.[1];
		const apiUrl = `https://www.omio.com/GoEuroAPI/rest/api/v5/results?direction=outbound&search_id=${hash}&sort_by=updateTime&include_segment_positions=true&sort_variants=smart&exclude_offsite_bus_results=true&exclude_offsite_train_results=true&use_stats=true&updated_since=0`;
		await KeyValueStore.setValue('apiUrl', apiUrl);

		const cookies = await page.context().cookies();
		const cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
		log.info(`Sending request to ${apiUrl}`);
		const response = await sendRequest({
			url: apiUrl,
			method: 'GET',
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				Cookie: cookieHeader,
			},
		});
		log.info('Response received');

		const rawData = await response.body;
		await KeyValueStore.setValue('rawData', rawData);
		const rawResults = parseResults(rawData);
		const results = extractResults(rawResults);
		const prettifiedResults = prettifyResults(results);
		const sortedResults = orderResults(prettifiedResults);
		await Dataset.pushData(sortedResults);

		const endTime = Date.now();
		const duration = (endTime - startTime) / 1000;
		log.info(`Page execution time: ${duration} seconds`);
		await page.close();
		await page.context().close();

		// Sort the results based on the price from lowest to highest.
		// const sortedResults = results.sort((a, b) => a.price - b.price);

		// Log the sorted results (for debugging purposes)
		// log.info(`Sorted Results by Price: ${JSON.stringify(sortedResults)}`);

		// Continue with processing the sorted results...
		// Example: Iterating over each result.
		// for (const result of sortedResults) {
		//   log.info(`Processed Result: ${JSON.stringify(result)}`);
		// }

		// console.log('Filling date');
		// await page.click('span[data-e2e="buttonDepartureDateText"]');
		// await page.waitForTimeout(2000);
		// console.log('Selecting date');
		// await selectCalendarDate(context, input.date);
	};

	return baseHandleStart;
};

export default createBaseHandleStart;
