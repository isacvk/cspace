const mongoose = require("mongoose");

const announceSchema = new mongoose.Schema({
  announcement: {
    type: String,
    required: [true, "Please specify the announcement"],
  },
  date: {
    type: Date,
  },
  visibility: {
    type: String,
    enum: [private, public],
  },
});

const Announce = mongoose.model("Announce", announceSchema);

module.exports = Announce;
