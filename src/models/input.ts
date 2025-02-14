import { Actor } from 'apify';
import { z } from 'zod';

const absoluteDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const relativeDateRegex = /^(\d+)\s*(day|week|month|year)s?$/i;

export const rawInputSchema = z.object({
	from: z.string(),
	to: z.string(),
	date: z
		.string()
		.refine((date) => absoluteDateRegex.test(date) || relativeDateRegex.test(date), {
			message: 'Date must be in YYYY-MM-DD format or relative format like "2 days"',
		}),
});

export type RawInput = z.infer<typeof rawInputSchema>;
export type Input = Omit<RawInput, 'date'> & { date: Date };

/**
 * Adds a relative time to the given date.
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The unit of time ("day", "week", "month", or "year")
 * @returns A new Date object with the added time.
 */
const addRelativeToDate = (date: Date, amount: number, unit: string): Date => {
	const newDate = new Date(date);
	switch (unit.toLowerCase()) {
		case 'day':
		case 'days':
			newDate.setDate(newDate.getDate() + amount);
			break;
		case 'week':
		case 'weeks':
			newDate.setDate(newDate.getDate() + amount * 7);
			break;
		case 'month':
		case 'months':
			newDate.setMonth(newDate.getMonth() + amount);
			break;
		case 'year':
		case 'years':
			newDate.setFullYear(newDate.getFullYear() + amount);
			break;
		default:
			Actor.fail(`Unsupported time unit: ${unit}`);
	}
	return newDate;
};

/**
 * Gets and validates the input.
 * The input date can be either absolute – in "YYYY-MM-DD" format – or relative like "2 days".
 * For a relative date, today's date is taken as the base, and the amount is added accordingly.
 */
export const getValidatedInput = async (): Promise<Input> => {
	const rawInput: unknown = await Actor.getInput();
	const validatedInput = rawInputSchema.parse(rawInput);

	const today = new Date();
	let finalDate: Date;

	if (absoluteDateRegex.test(validatedInput.date)) {
		const [year, month, day] = validatedInput.date.split('-').map(Number);
		finalDate = new Date(Date.UTC(year, month - 1, day));
	} else {
		const match = validatedInput.date.match(relativeDateRegex)!;
		const amount = parseInt(match[1], 10);
		const unit = match[2];
		finalDate = addRelativeToDate(today, amount, unit);
	}

	today.setHours(0, 0, 0, 0);
	if (finalDate < today) {
		Actor.fail('Incorrect input: Date must be either today or later');
	}

	return {
		...validatedInput,
		date: finalDate,
	};
};
