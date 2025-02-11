import { PlaywrightCrawlingContext } from 'crawlee';

export async function typeAndSelectValue(
  inputSelector: string,
  value: string,
  context: PlaywrightCrawlingContext,
) {
  await context.page.fill(inputSelector, value);
  await context.page.waitForTimeout(1000);
  await context.page.click('div[data-e2e="positionSuggestion"]');
  await context.page.waitForTimeout(500);
}
