import { Company } from '../models/company.js';
import { Position } from '../models/positions.js';
import { Provider } from '../models/provider.js';
import { Response, responseSchema } from '../models/response.js';
import { Result } from '../models/result.js';
import { Segment } from '../models/segment.js';

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
		console.log("got here");
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
	const companiesMap = new Map<string, Company>();
	const positionsMap = new Map<string, Position>();
	const providersMap = new Map<string, Provider>();
	const segmentsMap = new Map<string, Segment>();

	response.companies.forEach((company) => {
		companiesMap.set(company.id, company);
	});

	response.positions.forEach((position) => {
		positionsMap.set(position.id, position);
	});

	response.providers.forEach((provider) => {
		providersMap.set(provider.id, provider);
	});

	response.segmentDetails.forEach((segment) => {
		segmentsMap.set(segment.id, segment);
	});

	return response.outbounds.map((outbound) => {
		const segment = segmentsMap.get(outbound.segments[0]);
		if (!segment) {
			throw new Error(`Segment with id ${outbound.segments} not found`);
		}

		const departurePosition = positionsMap.get(segment.departurePosition);
		if (!departurePosition) {
			throw new Error(`Departure position with id ${segment.departurePosition} not found`);
		}
		const arrivalPosition = positionsMap.get(segment.arrivalPosition);
		if (!arrivalPosition) {
			throw new Error(`Arrival position with id ${segment.arrivalPosition} not found`);
		}

		const ticketCompanies = outbound.ticketsSellingCompanies.map((companyId) => {
			const company = companiesMap.get(companyId);
			if (!company) {
				throw new Error(`Company with id ${companyId} not found in ticket companies`);
			}
			return company;
		});

		const serviceProviders = outbound.serviceProviderIds.map((providerId) => {
			const provider = providersMap.get(providerId);
			if (!provider) {
				throw new Error(`Provider with id ${providerId} not found`);
			}
			return provider;
		});

		return {
			company: companiesMap.get(outbound.companyId)!,
			departurePosition: departurePosition,
			arrivalPosition: arrivalPosition,
			segment: segment,
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
			ticketCompanies: ticketCompanies,
			serviceProviders: serviceProviders,
		};
	});
}
