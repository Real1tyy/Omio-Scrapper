import { Company } from '../models/company.js';
import { Position } from '../models/positions.js';
import { Provider } from '../models/provider.js';
import { Response, responseSchema } from '../models/response.js';
import { Result } from '../models/result.js';
import { Segment } from '../models/segment.js';

/**
/**
 * Parses the full JSON response.
 *
 * This function:
 *   1. Builds a Map for companies (using data.companies) where each key is the company ID.
 *   2. Builds a Map for positions (using data.positions) where each key is the position ID.
 *   3. Walks the outbounds object, parses each outbound using the resultSchema,
 *      and then adds the corresponding Company (and Position if applicable) by looking
 *      up the corresponding maps.
 *
 * @param body - The full response body, either as a string or a Buffer.
 * @returns An array of EnhancedResult objects.
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

export function extractResults(response: Response): Result[] {
  const results: Result[] = [];

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

  return results;
}
