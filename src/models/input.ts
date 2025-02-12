import { Actor } from 'apify';
import { z } from 'zod';

export const rawInputSchema = z.object({
	from: z.string(),
	to: z.string(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type RawInput = z.infer<typeof rawInputSchema>;
export type Input = Omit<RawInput, 'date'> & { date: Date };

export const getValidatedInput = async (): Promise<Input> => {
	const rawInput: unknown = await Actor.getInput();
	const validatedInput = rawInputSchema.parse(rawInput);

	const [year, month, day] = validatedInput.date.split('-').map(Number);
	const finalDate = new Date(year, month - 1, day);

	// Get today's date with time zeroed out.
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (finalDate < today) {
		Actor.fail('Incorrect input: Date must be either today or later');
	}

	return {
		...validatedInput,
		date: finalDate,
	};
};
