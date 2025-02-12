import { Company } from '../models/company.js';
import { Position } from '../models/positions.js';
import { Provider } from '../models/provider.js';
import { Response, responseSchema } from '../models/response.js';
import { Result } from '../models/result.js';
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
 * Extracts results from a parsed response.
 *
 * For each outbound, this function injects:
 *   - The company matched by outbound.companyId.
 *   - The segment object matched by outbound.segments (assumed to be a single numeric id).
 *   - Departure and arrival positions via the segment's departurePositionId and arrivalPositionId.
 *   - Ticket companies mapped from outbound.ticketsSellingCompanies.
 *   - Service providers mapped from outbound.serviceProviderIds.
 *
 * @param response - The parsed response.
 * @returns An array of Result objects.
 */
export function extractResults(response: Response): Result[] {
	// Build lookup maps from the response data.
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
		const segment = getFromMap(segmentsMap, outbound.segments[0], 'Segment');
		const departurePosition = getFromMap(
			positionsMap,
			segment.departurePosition,
			'Departure position',
		);
		const arrivalPosition = getFromMap(
			positionsMap,
			segment.arrivalPosition,
			'Arrival position',
		);

		const ticketCompanies = outbound.ticketsSellingCompanies.map((companyId) =>
			getFromMap(companiesMap, companyId, 'Ticket company'),
		);
		const serviceProviders = outbound.serviceProviderIds.map((providerId) =>
			getFromMap(providersMap, providerId, 'Provider'),
		);

		return {
			company: getFromMap(companiesMap, outbound.companyId, 'Company'),
			departurePosition,
			arrivalPosition,
			segment,
			duration: outbound.duration,
			departureTime: outbound.departureTime,
			arrivalTime: outbound.arrivalTime,
			stops: outbound.stops,
			mode: outbound.mode,
			price: outbound.price,
			originalPrice: outbound.originalPrice,
			ticketsLeft: outbound.ticketsLeft,
			journeyId: outbound.journeyId,
			outboundId: outbound.outboundId,
			ticketCompanies,
			serviceProviders,
		};
	});
}
