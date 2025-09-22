import type { PlaywrightCrawlingContext } from "crawlee";

/**
 * Checks for a Google sign-in iframe and, if present,
 * clicks the close button (inside the iframe) to dismiss it.
 *
 * @param context - The Playwright crawling context.
 */
export async function dismissGoogleSignIn(context: PlaywrightCrawlingContext): Promise<void> {
	const { page, log } = context;
	try {
		// Look for the Google sign-in iframe by using a selector that matches a part of its src URL.
		const googleIframeHandle = await page.$('iframe[src*="accounts.google.com/gsi/iframe/select"]');

		if (googleIframeHandle) {
			// Get the content frame of the iframe.
			const googleFrame = await googleIframeHandle.contentFrame();
			if (googleFrame) {
				log.info("Google sign-in iframe detected.");
				// Try to find the close button inside the iframe.
				const closeButton = await googleFrame.$('div#close[role="button"]');
				if (closeButton) {
					log.info("Close button for Google sign-in overlay found inside iframe. Clicking it...");
					await closeButton.click();
					log.info("Close button clicked. Waiting for iframe to disappear...");
					// Wait until the iframe disappears from the DOM.
					await page.waitForSelector('iframe[src*="accounts.google.com/gsi/iframe/select"]', {
						state: "detached",
						timeout: 10000,
					});
					log.info("Google sign-in overlay dismissed.");
				} else {
					log.info("Google sign-in overlay is present, but no close button was found inside the iframe.");
				}
			} else {
				log.info("Unable to retrieve the content frame from the Google sign-in iframe.");
			}
		} else {
			log.info("Google sign-in iframe not detected; nothing to dismiss.");
		}
	} catch (error) {
		log.error(`Error dismissing Google sign-in overlay: ${error}`);
	}
}
