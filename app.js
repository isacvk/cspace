const express = require("express");

const personRouter = require("./routes/personRoutes");

const app = express();

app.use(express.json());

// Serving static files
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/persons", personRouter);

module.exports = app;
