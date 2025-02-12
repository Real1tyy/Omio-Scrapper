import { PlaywrightCrawlingContext } from 'crawlee';

export const acceptCookieBanner = async (context: PlaywrightCrawlingContext) => {
	const { page, log } = context;
	const acceptSelector = 'button[data-element="gdpr-banner-button-accept"]';

	// Attempt to wait for the selector for 2 seconds.
	// If it doesn't appear, acceptButton will be null.
	const acceptButton = await page
		.waitForSelector(acceptSelector, { timeout: 2000 })
		.catch(() => null);

	if (acceptButton) {
		await acceptButton.click({ force: true });
		log.info("Cookie banner accepted: 'Accept all' button clicked.");
	} else {
		log.info('Cookie banner not found, continuing...');
	}

	await page.mouse.wheel(0, 700);
	await page.waitForTimeout(1000);
	await page.mouse.wheel(0, 200);
	await page.waitForTimeout(50);
	await page.mouse.wheel(0, -500);
	await page.waitForTimeout(1000);
	await page.mouse.wheel(0, -500);
};
