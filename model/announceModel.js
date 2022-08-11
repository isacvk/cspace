const mongoose = require("mongoose");

const announceSchema = new mongoose.Schema({
  announcement: {
    type: String,
    required: [true, "Please specify the announcement"],
  },
  date: {
    type: Date,
  },
});

const Announce = mongoose.model("Announce", announceSchema);

module.exports = Announce;
