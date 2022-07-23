const mongoose = require("mongoose");

const app = require("./app");

mongoose
  .connect(
    "mongodb+srv://isac:isac1234@natours.sabm7.mongodb.net/natours?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connection Successfull"));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
