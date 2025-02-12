import { Company } from './company.js';
import { Position } from './positions.js';
import { Provider } from './provider.js';
import { Segment } from './segment.js';

export interface Result {
	company: Company;
	departurePosition: Position;
	arrivalPosition: Position;
	segment: Segment;
	duration: string;
	departureTime: Date;
	arrivalTime: Date;
	stops: string;
	mode: string;
	price: number;
	originalPrice: number;
	ticketsLeft: number;
	journeyId: string;
	outboundId: string;
	ticketCompanies: Company[];
	serviceProviders: Provider[];
}

export function formatDuration(duration: string | number): string {
	const totalMinutes = typeof duration === 'string' ? parseInt(duration, 10) : duration;
	const hrs = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	const minsRepresentation = mins === 0 ? '' : `${mins} mins`;
	const hrsRepresentation = hrs === 0 ? '' : `${hrs} hrs`;

	return hrsRepresentation === ''
		? minsRepresentation
		: `${hrsRepresentation} ${minsRepresentation}`;
}

export function prettifyResult(result: Result): string {
	const departureTime = result.departureTime.toISOString();
	const arrivalTime = result.arrivalTime.toISOString();
	const formattedDuration = formatDuration(result.duration);

	return `
Company: ${result.company.name}
Mode: ${result.mode}
Departure Time: ${departureTime}
Arrival Time: ${arrivalTime}
Duration: ${formattedDuration}
Departure: ${result.departurePosition.name}
Arrival: ${result.arrivalPosition.name}
Price: ${result.price}
Tickets Left: ${result.ticketsLeft}`;
}

export function prettifyResults(results: Result[]): string {
	return results.map(prettifyResult).join('\n\n');
}
