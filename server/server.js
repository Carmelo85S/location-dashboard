const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const proj4 = require("proj4");
const { getCityWeather, getCityWeatherForecast } = require("./weather");
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();

require("dotenv").config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let frontendCoordinates = {};
// Configure the projection for SWEREF99TM required by Trafikverket API
proj4.defs("EPSG:3006", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");

const API_URL_SITUATION = process.env.TRAFIKVERKET_API_URL_SITUATION;
const AUTH_KEY_SITUATION = process.env.TRAFIKVERKET_API_KEY_SITUATION;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

//Trasport
const AUTH_KEY = process.env.TRAFIKVERKET_API_KEY;
const API_URL = process.env.TRAFIKVERKET_API_URL;

app.get("/fetchDataTrafficSituation", (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const xmlDataSituation = `
  <REQUEST>
    <LOGIN authenticationkey="${AUTH_KEY_SITUATION}"/>
    <QUERY objecttype="Situation" schemaversion="1" limit="10">
      <FILTER>
        <NEAR name="Deviation.Geometry.WGS84" value="${lon} ${lat}"/>
      </FILTER>
    </QUERY>
  </REQUEST>
  `;

  axios
    .post(API_URL_SITUATION, xmlDataSituation, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
    .then((response) => {
      console.log("Response: ", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      res.status(500).send("Failed to fetch data");
    });
});

app.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await getCityWeather(lat, lon, WEATHER_API_KEY);
    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.get("/forecast", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await getCityWeatherForecast(lat, lon, WEATHER_API_KEY);
    return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.post("/logCoordinates", (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  frontendCoordinates = { lat, lon };

  console.log("--------------------------------------------------");
  console.log("FRONTEND COORDINATES RECEIVED - START HERE:");
  console.log("--------------------------------------------------");
  console.log(JSON.stringify(frontendCoordinates, null, 2));
  console.log("--------------------------------------------------");
  console.log("FRONTEND COORDINATES RECEIVED - END HERE:");
  console.log("--------------------------------------------------");
  console.log(
    "FIND THESE COORDINATES IN CODE: 'frontendCoordinates' variable inside '/logCoordinates' POST route."
  );

  res.json({ message: "Coordinates received", lat, lon });
});

app.get("/geocode", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    console.log("Received address:", address);
    console.log("Current frontendCoordinates:", frontendCoordinates);

    const apiKey = process.env.GEO_API_KEY;
    const url = `https://geokeo.com/geocode/v1/search.php?q=${encodeURIComponent(
      address
    )}&api=${apiKey}`;

    const response = await fetch(url);
    console.log("Response status:", response.status);

    const text = await response.text();
    console.log("Response body:", text);

    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = JSON.parse(text);
      return res.json(data);
    } else {
      return res
        .status(500)
        .json({ error: "Unexpected response format", body: text });
    }
  } catch (error) {
    console.error("Error fetching geocode data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("nearestStation", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing coordinates" });
  }
})

app.listen(8080, () => {
  console.log("server running on port 8080");
});
