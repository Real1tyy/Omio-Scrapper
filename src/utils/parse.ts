import { Response, responseSchema } from '../models/response.js';

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
  let data;

  try {
    data = JSON.parse(body);
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error}`);
  }
  const results: Response = responseSchema.parse(data);
  console.log('Result: ', results);
  // Create a Map for companies.
  // (Assumes your JSON includes a "companies" property.
  //  If your JSON uses "providers" instead, you can substitute that.)
  // const companyMap = new Map<string, Company>();
  // if (data.companies && typeof data.companies === 'object') {
  //   for (const [key, value] of Object.entries(data.companies)) {
  //     companyMap.set(key, {
  //       id: key,
  //       name: value.name,
  //       logoUrl: value.logoUrl,
  //       companyCodes: value.companyCodes,
  //     });
  //   }
  // }

  // // Create a Map for positions.
  // const positionsMap = new Map<string, Position>();
  // if (data.positions && typeof data.positions === 'object') {
  //   for (const [key, value] of Object.entries(data.positions)) {
  //     positionsMap.set(key, {
  //       id: key,
  //       name: value.name,
  //       country: value.country,
  //       cityName: value.cityName,
  //       latitude: Number(value.latitude),
  //       longitude: Number(value.longitude),
  //     });
  //   }
  // }

  // // Ensure that data.outbounds exists and is an object.
  // if (
  //   typeof data !== 'object' ||
  //   data === null ||
  //   !('outbounds' in data) ||
  //   typeof data.outbounds !== 'object'
  // ) {
  //   throw new Error("Invalid JSON structure: 'outbounds' field is missing or is not an object.");
  // }
  // const outboundsObject = data.outbounds;

  // // Process each outbound.
  // const results: EnhancedResult[] = Object.values(outboundsObject).map((item: any) => {
  //   // Validate and parse using the resultSchema.
  //   const parsed = resultSchema.parse(item);

  //   // Lookup the company based on companyId.
  //   const company = companyMap.get(parsed.companyId);

  //   // Optionally, if the outbound contains a position reference,
  //   // do a similar lookup. (Assuming there's a property "positionId".)
  //   const position = (parsed as any).positionId
  //     ? positionsMap.get((parsed as any).positionId)
  //     : undefined;

  //   // Remove companyId from the result and attach the full company entry.
  //   const { companyId, ...rest } = parsed;
  //   return { ...rest, company, position };
  // });

  return results;
}
