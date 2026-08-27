# Travel Tracker

Travel Tracker is an interactive web application for recording countries you have visited and visualizing them directly on a world map. A user enters a country name, the Express server resolves it against PostgreSQL, prevents duplicate entries, and the EJS interface highlights visited countries on an SVG map while keeping a running total.

## Why I built it

I built this while practicing full-stack JavaScript and relational-database integration. I extended the exercise with duplicate-country detection, user-facing validation, parameterized SQL queries, and a clearer request/data flow between the server and the map UI.

## Stack

- JavaScript / Node.js
- Express
- EJS
- PostgreSQL (`pg`)
- HTML / CSS / SVG

## Features

- Search and add visited countries
- Interactive SVG world-map visualization
- Persistent PostgreSQL-backed visited-country data
- Duplicate-entry prevention
- Friendly handling for invalid or empty country searches
- Parameterized database queries
- Environment-based database configuration

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your PostgreSQL connection values.

3. The application expects:
   - a `countries` table with `country_code` and `country_name` columns; and
   - a `visited_countries` table with a `country_code` column.

4. Start the app:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000`.

## Portfolio note

This project began as a guided web-development exercise and was completed and extended as part of my practice with Node.js, Express, EJS, SQL, and PostgreSQL. The repository contains my cleaned implementation rather than the bundled reference/solution files from the exercise.
