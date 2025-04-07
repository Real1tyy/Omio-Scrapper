import { Company } from './company.js';
import { Position } from './positions.js';
import { Provider } from './provider.js';

/**
 * An enriched version of a Segment that includes full position objects instead of just IDs.
 */
export interface EnrichedSegment {
	id: string;
	departurePosition: Position;
	arrivalPosition: Position;
	departureTime: string;
	arrivalTime: string;
	duration?: string;
}

/**
 * A stop (connection) detail between segments. For every connection we list
 * the arrival position of the previous segment, the departure position of the next,
 * and a string indicating the connecting time.
 */
export interface StopDetail {
	departure: string;
	arrival: string;
	departureTime: string;
	arrivalTime: string;
	duration: string;
	waitTime?: string;
}

export interface Result {
	company: Company;
	departurePosition: Position;
	arrivalPosition: Position;
	segments: EnrichedSegment[];
	stops: StopDetail[];
	duration: string;
	departureTime: string;
	arrivalTime: string;
	mode: string;
	price: number;
	originalPrice: number;
	ticketsLeft: number;
	journeyId: string;
	outboundId: string;
	ticketCompanies: Company[];
	serviceProviders: Provider[];
	currency: string;
}

/**
 * Converts a duration (in minutes) to a human friendly format.
 * For example, 90 becomes "1 hrs 30 mins".
 */
export function formatDuration(duration: string | number): string {
	const totalMinutes = typeof duration === 'string' ? parseInt(duration, 10) : duration;
	const hrs = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	const hrsRepresentation = hrs === 0 ? '' : `${hrs} hrs`;
	const minsRepresentation = mins === 0 ? '' : `${mins} mins`;
	return hrsRepresentation === ''
		? minsRepresentation
		: `${hrsRepresentation} ${minsRepresentation}`;
}

/**
 * Interface representing the prettified result object.
 * In addition to the basic info, we now include a prettified segments list and stops.
 */
export interface PrettifiedResult {
	company: string;
	mode: string;
	departureTime: string;
	arrivalTime: string;
	duration: string;
	departure: string;
	arrival: string;
	price: number;
	ticketsLeft: number;
	stops: StopDetail[];
	currency: string;
}

/**
 * Converts a single Result into a plain JSON object with the PrettifiedResult type.
 * The departureTime and arrivalTime are kept as strings in order to preserve their original timezone offsets.
 */
export function prettifyResult(result: Result): PrettifiedResult {
	return {
		company: result.company.name,
		mode: result.mode,
		departureTime: result.departureTime,
		arrivalTime: result.arrivalTime,
		duration: formatDuration(result.duration),
		departure: result.departurePosition.name,
		arrival: result.arrivalPosition.name,
		price: result.price,
		ticketsLeft: result.ticketsLeft,
		stops: result.stops.length > 1 ? result.stops : [],
		currency: result.currency,
	};
}

/**
 * Converts an array of Result objects into an array of PrettifiedResult objects.
 */
export function prettifyResults(results: Result[]): PrettifiedResult[] {
	return results.map(prettifyResult);
}

/**
 * Orders an array of PrettifiedResult objects first by mode (alphabetically) and then by departureTime.
 *
 * The departureTime comparison converts the ISO strings into Date objects for accurate numerical comparison.
 *
 * @param results - Array of PrettifiedResult objects.
 * @returns A new sorted array.
 */
export function orderResults(results: PrettifiedResult[]): PrettifiedResult[] {
	return results.slice().sort((a, b) => {
		// First order based on the mode.
		if (a.mode < b.mode) return -1;
		if (a.mode > b.mode) return 1;

		// If mode is the same, order based on departureTime.
		const timeA = new Date(a.departureTime).getTime();
		const timeB = new Date(b.departureTime).getTime();
		return timeA - timeB;
	});
}
