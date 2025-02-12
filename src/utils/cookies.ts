import { PlaywrightCrawlingContext } from 'crawlee';
import { Cookie } from 'set-cookie-parser';
import { log } from 'apify';

export const addCookies = async (
	context: PlaywrightCrawlingContext,
	interceptedCookies: Cookie[],
) => {
	// Re-add intercepted cookies to the context to ensure they're used in subsequent requests.
	if (interceptedCookies.length > 0) {
		const currentURL = new URL(context.page.url());
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
		await context.page.context().addCookies(cookiesToAdd);
		log.info(`Added intercepted cookies to context: ${JSON.stringify(cookiesToAdd)}`);
	}
};
