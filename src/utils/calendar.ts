import { PlaywrightCrawlingContext } from 'crawlee';
/**
 * Selects the correct day on an interactive calendar based on the provided date.
 * Assumes that the calendar's month and year have already been loaded.
 *
 * @param context - The Playwright crawling context.
 * @param date - The Date object to be selected.
 */
export async function selectCalendarDate(
	context: PlaywrightCrawlingContext,
	date: Date,
): Promise<void> {
	const { page, log } = context;
	// Extract target day info from the provided date
	const targetDay = date.getDate();
	const targetMonth = date.getMonth();
	const targetYear = date.getFullYear();

	// Open the calendar
	await page.click('span[data-e2e="buttonDepartureDateText"]');
	log.info('Opened calendar');
	await page.waitForTimeout(1000);

	const calendarLocator = page.locator('div[data-e2e="calendar"]');
	await calendarLocator.waitFor();
	log.info('Calendar found');

	// Get all calendar day elements
	const dayElements = await calendarLocator
		.locator('li[data-e2e="calendarDay"]')
		.elementHandles();

	for (const dayElement of dayElements) {
		// Get the 'date' attribute from the day element.
		const dateAttr = await dayElement.getAttribute('date');
		if (!dateAttr) continue;
		log.info(`Date attribute: ${dateAttr}`);

		const elementDate = new Date(dateAttr);
		// Compare day, month, and year.
		if (
			elementDate.getDate() === targetDay &&
			elementDate.getMonth() === targetMonth &&
			elementDate.getFullYear() === targetYear
		) {
			await dayElement.click();
			log.info(`Clicked on date: ${elementDate.toDateString()}`);
			return;
		}
	}
	throw new Error(`No calendar day element found representing ${date.toDateString()}`);
}
