# Omio Scrapper

Omio Scrapper is an [Apify Actor](https://docs.apify.com/actors) designed to scrape travel data from [Omio](https://www.omio.com) for a specific date. It fetches all available data matching the search criteria (e.g. travel schedules, prices, etc.) and outputs the results into an Apify dataset.

---

## Overview

This open-source actor leverages [Crawlee](https://crawlee.dev/) and [Playwright](https://playwright.dev/) for robust browser automation and web scraping.

---

## Input

The actor expects the following input fields:

- **from**: Departure city (string).
- **to**: Destination city (string).
- **date**: Travel date in the format `YYYY-MM-DD`.

> **Example Input:**
>
> ```json
> {
>   "from": "Berlin",
>   "to": "Munich",
>   "date": "2023-11-15"
> }
> ```

*Note:* Although your actor's input schema was originally defined using keys like `"from"`, `"to"`, and `"date"`, you can consider these as representing the _fromLocation_, _toLocation_, and _day_ respectively.

---

## Output

The actor publishes all fetched travel data entries to an [Apify dataset](https://docs.apify.com/actors/dataset). Each record in the dataset represents one travel option including details such as departure/arrival times, travel duration, pricing, and other metadata as available on Omio.

---

## Project Structure

Below is an overview of the project's file structure:

```
├── .actor
│   ├── actor.json         # Apify actor configuration; specifies actor specification and environment
│   └── INPUT_SCHEMA.json  # JSON schema for the actor input
├── docs                   # Documentation and additional project files
├── src
│   ├── crawlers           # Contains crawler files for rendering with Cheerio and Playwright
│   │   ├── cheerio.ts
│   │   ├── playwright.ts
│   │   └── requestQueue.ts
│   ├── handlers           # Main task handler; starts the crawl and coordinates results extraction
│   │   └── start.ts
│   ├── models             # Data models (e.g., for input and result structures)
│   ├── router.ts          # Defines routing for tasks and custom endpoints if needed
│   └── utils              # Utility modules with helper functions
│       ├── accept.ts      # Handles cookie banners and other pop-ups
│       ├── calendar.ts    # Utilities for selecting calendar dates
│       ├── cookies.ts     # Cookie manipulation functions
│       ├── currency.ts    # Currency conversion & extraction utilities
│       ├── google.ts      # Dismisses the Google sign‑in overlay from within an iframe
│       ├── parse.ts       # Parsing functions for scraping and data extraction
│       ├── select.ts      # Helpers to type and select values on the page
│       └── toggle.ts      # Functions to toggle interface elements
├── package.json           # Package metadata and dependency configuration
├── LICENSE                # AGPL-3.0 license file
└── README.md              # This file
```

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

   The project is configured to run on the Apify platform. Review the `.actor/actor.json` file for configuration details. You can deploy the actor using Apify CLI or directly through the Apify web interface.

---

## Configuration

- **Input Schema**: Located in `.actor/INPUT_SCHEMA.json`, it ensures that only valid data (departure city, destination city, and a properly formatted date) is provided.
- **Actor Configuration**: The `.actor/actor.json` file outlines metadata such as actor specification version, name, version, and Dockerfile location.
- **Dependencies**: All required dependencies are declared in `package.json` and include libraries such as `crawlee`, `playwright`, and `apify`.

---

## License

This project is open source, licensed under the [GNU Affero General Public License 3.0 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.en.html). Feel free to review, use, and modify the code according to the license terms.

---

The Omio Scrapper is provided as-is for anyone to use, inspect, or extend. Enjoy exploring the code!
