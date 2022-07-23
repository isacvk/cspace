const express = require("express");

const personRouter = require("./routes/personRoutes");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(express.json());

// Serving static files
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/persons", personRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
