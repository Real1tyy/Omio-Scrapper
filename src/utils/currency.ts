import { PlaywrightCrawlingContext } from 'crawlee';

export const selectCurrency = async (context: PlaywrightCrawlingContext, currency: string) => {
	const currencyDropdown = await context.page.waitForSelector(
		'[data-component="DesktopCurrencySwitcher"]',
	);
	await currencyDropdown.click();
	await context.page.waitForTimeout(500);

	const currencyOption = await context.page.waitForSelector(
		`div[data-component="Dropdown"] div[data-component="DropdownMenuItem"][data-value="${currency}"]`,
	);
	await currencyOption.click();
};
