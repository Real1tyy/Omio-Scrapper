import { Actor } from 'apify';
import { z } from 'zod';

export const TravelModel = z.object({
	from: z.string(),
	to: z.string(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type RawInput = z.infer<typeof TravelModel>;
export type Input = Omit<RawInput, 'date'> & { date: Date };

export const getInput = async (): Promise<Input> => {
	const rawInput: unknown = await Actor.getInput();
	if (!rawInput) {
		throw new Error('No input provided');
	}
	const validatedInput = TravelModel.parse(rawInput);

	const [year, month, day] = validatedInput.date.split('-').map(Number);
	const finalDate = new Date(year, month - 1, day);

	return {
		...validatedInput,
		date: finalDate,
	};
};
