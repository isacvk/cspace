const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE_ATLAS.replace(
  "<PASSWORD>",
  process.env.DATABASE_ATLAS_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB Connection Successfull"));

console.log("APP ENV : ", process.env.NODE_ENV);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
