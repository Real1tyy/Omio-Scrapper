import { PlaywrightCrawlingContext } from 'crawlee';
import { Input } from '../models/model.js';
import { selectCalendarDate } from '../utils/calendar.js';
import { typeAndSelectValue } from '../utils/select.js';
const createBaseHandleStart = (input: Input) => {
  const baseHandleStart = async (context: PlaywrightCrawlingContext) => {
    const { page, log } = context;

    try {
      await page.waitForLoadState('domcontentloaded');
      const acceptButton = await page.waitForSelector(
        'button[data-element="gdpr-banner-button-accept"]',
        { timeout: 1000 },
      );
      await acceptButton.click({ force: true });
      log.info("Cookie banner accepted: 'Accept all' button clicked.");
    } catch (error) {
      // If the button is not found (i.e. doesn't appear), log and continue.
      log.info("No cookie banner 'Accept all' button was found, continuing further.");
    }

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
