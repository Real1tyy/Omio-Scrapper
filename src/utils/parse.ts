import { Company } from '../models/company.js';
import { Position } from '../models/positions.js';
import { Provider } from '../models/provider.js';
import { Response, responseSchema } from '../models/response.js';
import { formatDuration, Result } from '../models/result.js';
import { Segment } from '../models/segment.js';

/**
 * Retrieves an item from a map by key or throws an error if not found.
 *
 * @param map - The map from which to retrieve the item.
 * @param key - The key corresponding to the desired item.
 * @param typeName - A string representing the type being retrieved (for error messages).
 * @returns The item corresponding to the key.
 * @throws Error if the item is not found.
 */
function getFromMap<T>(map: Map<string, T>, key: string, typeName: string): T {
	const item = map.get(key);
	if (!item) {
		throw new Error(`${typeName} with id ${key} not found`);
	}
	return item;
}

/**
 * Parses the full JSON response into a Response object.
 *
 * @param body - The full response body, either as a string
 * @returns The parsed Response.
 * @throws Error if the JSON is invalid or the expected structure is not found.
 */
export function parseResults(body: string): Response {
	try {
		const data = JSON.parse(body);
		return responseSchema.parse(data);
	} catch (error) {
		throw new Error(`Invalid JSON format: ${error}`);
	}
}

/**
 * Extracts and enriches segments while building full stops with travel times and wait times.
 */
export function extractResults(response: Response, currency: string): Result[] {
	// Build lookup maps.
	const companiesMap = new Map<string, Company>(
		response.companies.map((company) => [company.id, company]),
	);
	const positionsMap = new Map<string, Position>(
		response.positions.map((position) => [position.id, position]),
	);
	const providersMap = new Map<string, Provider>(
		response.providers.map((provider) => [provider.id, provider]),
	);
	const segmentsMap = new Map<string, Segment>(
		response.segmentDetails.map((segment) => [segment.id, segment]),
	);

	return response.outbounds.map((outbound) => {
		// Enrich segments and force UTC-converted time strings.
		const enrichedSegments = outbound.segments.map((segmentId) => {
			const segment = getFromMap(segmentsMap, segmentId, 'Segment');
			return {
				id: segment.id,
				departurePosition: getFromMap(
					positionsMap,
					segment.departurePosition,
					'Departure position',
				),
				arrivalPosition: getFromMap(
					positionsMap,
					segment.arrivalPosition,
					'Arrival position',
				),
				departureTime: segment.departureTime.toUTCString(),
				arrivalTime: segment.arrivalTime.toUTCString(),
				duration: segment.duration,
			};
		});

		// Build stops. Each stop shows full segment details,
		// and if there is a gap to the next segment, compute the wait time.
		const stopsDetail = enrichedSegments.map((segment, i) => {
			let waitTime = '';
			if (i < enrichedSegments.length - 1) {
				const nextSegment = enrichedSegments[i + 1];
				const diffMinutes = Math.round(
					(new Date(nextSegment.departureTime).getTime() -
						new Date(segment.arrivalTime).getTime()) /
						60000,
				);
				waitTime = formatDuration(diffMinutes);
			}
			return {
				departure: segment.departurePosition.name,
				arrival: segment.arrivalPosition.name,
				departureTime: segment.departureTime,
				arrivalTime: segment.arrivalTime,
				duration: formatDuration(segment.duration),
				waitTime,
			};
		});

		// Overall journey details: use the first segment's departure and the last segment's arrival.
		const overallDeparture = enrichedSegments[0].departurePosition;
		const overallArrival = enrichedSegments[enrichedSegments.length - 1].arrivalPosition;

		return {
			company: getFromMap(companiesMap, outbound.companyId, 'Company'),
			departurePosition: overallDeparture,
			arrivalPosition: overallArrival,
			segments: enrichedSegments,
			stops: stopsDetail,
			duration: outbound.duration,
			// Convert outbound times to UTC format
			departureTime: new Date(outbound.departureTime).toUTCString(),
			arrivalTime: new Date(outbound.arrivalTime).toUTCString(),
			mode: outbound.mode,
			price: outbound.price,
			originalPrice: outbound.originalPrice ?? outbound.price,
			ticketsLeft: outbound.ticketsLeft,
			journeyId: outbound.journeyId,
			outboundId: outbound.outboundId,
			ticketCompanies: outbound.ticketsSellingCompanies.map((companyId) =>
				getFromMap(companiesMap, companyId, 'Ticket company'),
			),
			serviceProviders: outbound.serviceProviderIds.map((providerId) =>
				getFromMap(providersMap, providerId, 'Provider'),
			),
			currency,
		};
	});
}
