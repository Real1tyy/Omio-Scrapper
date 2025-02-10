import { PlaywrightCrawlingContext } from 'crawlee';
import { Input } from '../models/model.js';
import { selectCalendarDate } from '../utils/calendar.js';
import { typeAndSelectValue } from '../utils/select.js';
const createBaseHandleStart = (input: Input) => {
  const baseHandleStart = async (context: PlaywrightCrawlingContext) => {
    const { page, log } = context;

    try {
      await page.waitForLoadState('domcontentloaded');
      const frames = page.frames();
      frames.forEach((frame, index) => {
        console.log(`Frame ${index}: ${frame.url()}`);
      });
      const acceptButton = await page.waitForSelector(
        'button[data-element="gdpr-banner-button-accept"]',
        { timeout: 1000 },
      );
      await acceptButton.click({ force: true });
      log.info("Cookie banner accepted: 'Accept all' button clicked.");
      // Scroll the page a bit to simulate user interaction
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, -200);
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, -300);
    } catch (error) {
      // If the button is not found (i.e. doesn't appear), log and continue.
      log.info("No cookie banner 'Accept all' button was found, continuing further.");
    }
    await page.waitForTimeout(5000);
    const cookies = await context.cookies;
    console.log(`cookies: ${cookies}`); // Look for __cf_bm or cf_clearance

    await typeAndSelectValue('[data-id="departurePosition"]', input.from, context);
    await page.waitForTimeout(5000);
    await typeAndSelectValue('[data-id="arrivalPosition"]', input.to, context);
    await page.waitForTimeout(1000);
    console.log('filling date');
    await page.click('span[data-e2e="buttonDepartureDateText"]');
    await page.waitForTimeout(2000);

    console.log('going for date');
    await selectCalendarDate(context, input.date);
  };

  return baseHandleStart;
};

export default createBaseHandleStart;
