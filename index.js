import "dotenv/config";
import express from "express";
import pg from "pg";

const app = express();
const port = Number(process.env.PORT || 3000);

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getVisitedCountries() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries ORDER BY country_code",
  );
  return result.rows.map((country) => country.country_code);
}

app.get("/", async (req, res, next) => {
  try {
    const countries = await getVisitedCountries();
    res.render("index", {
      countries,
      total: countries.length,
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/add", async (req, res, next) => {
  const countryName = req.body.country?.trim().toLowerCase();

  try {
    if (!countryName) {
      const countries = await getVisitedCountries();
      return res.status(400).render("index", {
        countries,
        total: countries.length,
        error: "Enter a country name.",
      });
    }

    const countryResult = await db.query(
      `SELECT country_code
       FROM countries
       WHERE LOWER(country_name) LIKE '%' || $1 || '%'
       ORDER BY country_name
       LIMIT 1`,
      [countryName],
    );

    if (countryResult.rowCount === 0) {
      const countries = await getVisitedCountries();
      return res.status(404).render("index", {
        countries,
        total: countries.length,
        error: "Country name not found. Try again.",
      });
    }

    const countryCode = countryResult.rows[0].country_code;
    const existingCountry = await db.query(
      "SELECT 1 FROM visited_countries WHERE country_code = $1",
      [countryCode],
    );

    if (existingCountry.rowCount > 0) {
      const countries = await getVisitedCountries();
      return res.status(409).render("index", {
        countries,
        total: countries.length,
        error: "That country is already on your map.",
      });
    }

    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1)",
      [countryCode],
    );

    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, _next) => {
  console.error(error);
  res.status(500).send("Something went wrong while loading the travel tracker.");
});

async function start() {
  try {
    await db.connect();
    app.listen(port, () => {
      console.log(`Travel Tracker running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

start();
