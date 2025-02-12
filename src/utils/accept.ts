import { PlaywrightCrawlingContext } from 'crawlee';

export const acceptCookieBanner = async (context: PlaywrightCrawlingContext) => {
	const { page, log } = context;
	const acceptButton = await page.waitForSelector(
		'button[data-element="gdpr-banner-button-accept"]',
		{ timeout: 2000 },
	);
	await acceptButton.click({ force: true });
	log.info("Cookie banner accepted: 'Accept all' button clicked.");

	await page.mouse.wheel(0, 700);
	await page.waitForTimeout(1000);
	await page.mouse.wheel(0, 200);
	await page.waitForTimeout(50);
	await page.mouse.wheel(0, -500);
	await page.waitForTimeout(1000);
	await page.mouse.wheel(0, -500);
};
