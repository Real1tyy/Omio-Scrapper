import fs from "fs";
import path from "path";
import { expect } from "playwright/test";
import type { Response } from "../models/response.js";
import { extractResults, parseResults } from "./parse.js";

/**
 * Verifies that an object has a property with the expected length as an array.
 *
 * @param obj - The parsed response object.
 * @param propName - The property name.
 * @param expectedLength - Expected length of the array at that property.
 */
function expectArrayProperty(obj: Response, propName: string, expectedLength: number) {
	expect(obj).toHaveProperty(propName);
	const value = obj[propName as keyof Response];
	expect(Array.isArray(value)).toBe(true);
	expect(value.length).toBe(expectedLength);
}

/**
 * Helper function for running tests on a given response file.
 *
 * @param fileName - The name of the file under test.
 * @param expectedCounts - An object containing the expected counts for each property.
 */
function runParseAndExtractTests(
	fileName: string,
	expectedCounts: {
		outbounds: number;
		companies: number;
		positions: number;
		providers: number;
		segmentDetails: number;
		resultsCount: number;
	}
) {
	describe(`Tests for ${fileName}`, () => {
		const filePath = path.join(__dirname, "../../data", fileName);
		let jsonData: string;
		let parsedResponse: Response;

		beforeAll(() => {
			jsonData = fs.readFileSync(filePath, "utf-8");
			parsedResponse = parseResults(jsonData);
		});

		it(`should parse ${fileName} without throwing an error and return valid arrays for the given properties`, () => {
			expect(parsedResponse).toBeDefined();
			expectArrayProperty(parsedResponse, "outbounds", expectedCounts.outbounds);
			expectArrayProperty(parsedResponse, "companies", expectedCounts.companies);
			expectArrayProperty(parsedResponse, "positions", expectedCounts.positions);
			expectArrayProperty(parsedResponse, "providers", expectedCounts.providers);
			expectArrayProperty(parsedResponse, "segmentDetails", expectedCounts.segmentDetails);
		});

		it(`should extract ${expectedCounts.resultsCount} Result objects from ${fileName}`, () => {
			const currency = "USD";
			const results = extractResults(parsedResponse, currency);
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBe(expectedCounts.resultsCount);
		});
	});
}

describe("Response Parsing and Extraction Tests", () => {
	runParseAndExtractTests("example_response.json", {
		outbounds: 71,
		companies: 3,
		positions: 13,
		providers: 3,
		segmentDetails: 71,
		resultsCount: 71,
	});

	runParseAndExtractTests("example_response2.json", {
		outbounds: 41,
		companies: 3,
		positions: 12,
		providers: 3,
		segmentDetails: 41,
		resultsCount: 41,
	});

	runParseAndExtractTests("example_response3.json", {
		outbounds: 44,
		companies: 6,
		positions: 11,
		providers: 5,
		segmentDetails: 44,
		resultsCount: 44,
	});

	runParseAndExtractTests("example_response4.json", {
		outbounds: 53,
		companies: 19,
		positions: 23,
		providers: 2,
		segmentDetails: 78,
		resultsCount: 53,
	});
});
