import type { PlaywrightCrawlingContext } from "crawlee";

/**
 * Ensures that the toggle element identified by the given selector is unchecked.
 * It assumes that if the element has the class "react-toggle--checked", then it is in the "on" state.
 * If so, it performs a click to uncheck it and waits until the class is removed.
 *
 * @param context - The Playwright crawling context.
 * @param selector - The selector for the inner toggle element (the one that gets the "react-toggle--checked" class).
 */
export async function ensureToggleUnchecked(context: PlaywrightCrawlingContext, selector: string): Promise<void> {
	const { page, log } = context;
	try {
		const toggle = await page.waitForSelector(selector);
		const classList = await toggle.getAttribute("class");
		// If the "react-toggle--checked" class is present, then it is currently checked.
		if (classList && classList.includes("react-toggle--checked")) {
			log.info("Toggle is currently checked, clicking to uncheck it.");
			await toggle.click();
		} else {
			log.info("Toggle is already unchecked; no click needed.");
		}
	} catch (error) {
		log.error(`Error ensuring toggle unchecked for selector ${selector}: ${error}`);
	}
}
