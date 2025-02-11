import { PlaywrightCrawlingContext } from 'crawlee';
import setCookieParser, { Cookie } from 'set-cookie-parser';
import { Input } from '../models/model.js';
import { typeAndSelectValue } from '../utils/select.js';

const createBaseHandleStart = (input: Input) => {
  const baseHandleStart = async (context: PlaywrightCrawlingContext) => {
    const { page, log, sendRequest } = context;

    // Initialize an array to store intercepted cookies.
    const interceptedCookies: Cookie[] = [];

    // Attach a response listener to capture set-cookie headers.
    page.on('response', async (response) => {
      try {
        const headers = response.headers();
        if (headers['set-cookie']) {
          console.log('Set-cookie:', headers['set-cookie']);
          const parsedCookies = setCookieParser(headers['set-cookie'], { map: false });
          interceptedCookies.push(...parsedCookies);
        } else {
          console.log('No set-cookie:', headers);
        }
      } catch (err) {
        log.error(`Error processing response from ${response.url()}: ${err}`);
      }
    });

    // Navigate to the target site.
    await page.goto('https://www.omio.com/');
    await page.waitForLoadState('domcontentloaded');
    // Wait a bit to ensure challenge cookies are received.
    await page.waitForTimeout(5000);

    // Re-add intercepted cookies to the context to ensure they're used in subsequent requests.
    if (interceptedCookies.length > 0) {
      const currentURL = new URL(page.url());
      const cookiesToAdd = interceptedCookies.map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain || currentURL.hostname,
        path: cookie.path || '/',
        expires: cookie.expires ? Math.floor(new Date(cookie.expires).getTime() / 1000) : -1,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite
          ? ((cookie.sameSite.toLowerCase() === 'lax'
              ? 'Lax'
              : cookie.sameSite.toLowerCase() === 'strict'
                ? 'Strict'
                : 'None') as 'Lax' | 'Strict' | 'None')
          : undefined,
      }));
      await page.context().addCookies(cookiesToAdd);
      log.info(`Added intercepted cookies to context: ${JSON.stringify(cookiesToAdd)}`);
    }
    const cookies = await page.context().cookies();
    console.log(cookies);


    try {
      const acceptButton = await page.waitForSelector(
        'button[data-element="gdpr-banner-button-accept"]',
        { timeout: 1000 },
      );
      await acceptButton.click({ force: true });
      log.info("Cookie banner accepted: 'Accept all' button clicked.");

      // Simulate user interaction.
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(50);
      await page.mouse.wheel(0, -500);
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, -500);
    } catch (error) {
      log.info("No cookie banner 'Accept all' button was found, continuing.");
    }
    await page.waitForTimeout(5000);

    const cookies = await context.cookies;
    console.log(`Cookies in session: ${JSON.stringify(cookies)}`);

    await typeAndSelectValue('[data-id="departurePosition"]', input.from, context);
    await page.waitForTimeout(500);
    await typeAndSelectValue('[data-id="arrivalPosition"]', input.to, context);
    await page.waitForTimeout(500);

    const searchCheckboxToggle = await page.waitForSelector(
      "[data-e2e='searchCheckbox'] [data-component='toggle']",
    );
    await searchCheckboxToggle.click();

    console.log('Searching prepare...');
    const searchButton = await page.waitForSelector('[data-e2e="buttonSearch"]');
    await searchButton.click();
    const url = page.url();
    console.log(url);
    
    const hash =
    sendRequest({
      url: url,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });




    await page.waitForTimeout(1000000);
    // console.log('Filling date');
    // await page.click('span[data-e2e="buttonDepartureDateText"]');
    // await page.waitForTimeout(2000);
    // console.log('Selecting date');
    // await selectCalendarDate(context, input.date);
  };

  return baseHandleStart;
};

export default createBaseHandleStart;
