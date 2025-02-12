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
	// Extract the day number from the provided date and convert it to string.
	const dayNumber = date.getDate();
	const dayText = dayNumber.toString();

	// Wait for the calendar container to be visible.
	const calendarLocator = context.page.locator('div[data-e2e="calendar"]');
	await calendarLocator.waitFor({ state: 'visible', timeout: 5000 });

	// Get all li elements within the calendar container.
	const dayElements = await calendarLocator
		.locator('li[data-e2e="calendarDay"]')
		.elementHandles();

	// Iterate over each li element and compare its text content.
	for (const li of dayElements) {
		const innerText = (await li.textContent()) || '';
		if (innerText.trim() === dayText) {
			await li.click();
			return;
		}
	}

	throw new Error(`No calendar day element found for day "${dayText}".`);
}
