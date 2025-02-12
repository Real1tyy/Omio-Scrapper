# Omio Scrapper

Omio Scrapper is an [Apify Actor](https://docs.apify.com/actors) designed to scrape travel data from [Omio](https://www.omio.com) for specific dates. It fetches all available travel options matching the search criteria (e.g. schedules, prices, etc.) and outputs the results into an Apify dataset.

---

## Overview

This open‑source actor uses [Crawlee](https://crawlee.dev/) together with [Playwright](https://playwright.dev/) to automate browser activities and scrape data. The project extracts travel information for trains, buses, and planes—all with details such as departure/arrival times, durations, pricing, and other metadata.

**Please note:** Currency support is not fully feature‑complete. Currently, the currency shown depends on the proxy location. We plan to add improved currency handling in the future.

The Omio Scrapper is under active development. Future releases will include additional features such as exposing top‑level map, filter, and reduce operations on the results—giving users the ability to modify and transform the output however they wish.

---

## Project Structure

- **handlers:**
  Contains the main task handler (e.g. `start.ts`), which coordinates the scraping process and data extraction.

- **crawlers:**
  Holds the browser automation and scraper modules (for both Cheerio and Playwright) responsible for parsing page content.

- **models:**
  Defines all data structures including search input, travel results, companies, providers, positions, etc.

- **utils:**
  Provides helper functions for cookie handling, currency, parsing, element selections, and more.

- **router:**
  Sets up the routing for tasks and custom endpoints if needed.

This high‑level architecture allows for a clear separation of concerns and makes it easier to extend or modify specific parts of the system.

---

## Getting Started

1. **Install Dependencies**

    Ensure you have [pnpm](https://pnpm.io/) installed, then run:

    ```bash
    pnpm install
    ```

2. **Run the Project**

    Run the TypeScript source code:

    ```bash
    pnpm dev
    ```

3. **Deploy as an Apify Actor**

    Check the [.actor/actor.json](.actor/actor.json) for deployment configurations and deploy via the Apify CLI or Apify web interface.

---

## Input

The actor expects the following input fields:

- **from:** Departure city (string).
- **to:** Destination city (string).
- **date:** Travel date in the format `YYYY-MM-DD`.
  *Note: The date must be either today's date or a future date. Past dates are not supported.*

> **Example Input:**
>
> ```json
> {
> 	"from": "Berlin",
> 	"to": "Munich",
> 	"date": "2023-11-15"
> }
> ```

_Note:_ These keys represent the departure location, destination, and travel day respectively.

---

## Output

The actor writes all extracted travel data entries to an [Apify dataset](https://docs.apify.com/actors/dataset). Each record represents one travel option with details such as times, duration, price, and additional travel specifics.

---

## License

This project is open source, licensed under the [GNU Affero General Public License 3.0 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.en.html). Feel free to review, use, and modify the code according to the license terms.
