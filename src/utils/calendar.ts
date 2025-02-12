import { Actor } from 'apify';
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

	const targetDay = date.getDate();
	const targetMonth = date.getMonth();
	const targetYear = date.getFullYear();

	await page.click('span[data-e2e="buttonDepartureDateText"]');
	log.info('Opened calendar');
	await page.waitForTimeout(1000);

	const calendarLocator = page.locator('div[data-e2e="calendar"]');
	await calendarLocator.waitFor();
	log.info('Calendar found');

	// Use an iterative approach to look for the target date.
	// We assume that if we don't find it, it is because the date is further in the future.
	// "maxAttempts" is a safe-guard (each new attempt shows 1 extra month)
	// Right now it starts from january 2025 up to the end of april 2025
	// Meaning each calendar view shows 4 whole months and it starts from january
	const maxAttempts = 12; // e.g. 12 attempts to cover 12 months
	let attempt = 0;

	while (attempt < maxAttempts) {
		log.info(`Attempt ${attempt + 1}: Searching for date ${date.toDateString()}`);

		const dayElements = await calendarLocator
			.locator('li[data-e2e="calendarDay"]')
			.elementHandles();

		// Loop through and see if one matches the desired date.
		for (const dayElement of dayElements) {
			const dateAttr = await dayElement.getAttribute('date');
			if (!dateAttr) continue;

			const elementDate = new Date(dateAttr);
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

		// If we haven't returned yet, the target date was not visible.
		// Assume it is further into the future. Click the "next month" button.
		log.info(`Date ${date.toDateString()} not visible, clicking next month arrow.`);
		// The next month button is identified by the classes `_4a0dd _5b3ef` inside the calendar.
		const nextButton = calendarLocator.locator('div._4a0dd._5b3ef');
		await nextButton.click();
		await page.waitForTimeout(3000);
		attempt++;
	}
	await Actor.fail(
		`No calendar day element found representing ${date.toDateString()} after ${attempt} attempts.`,
	);
}
