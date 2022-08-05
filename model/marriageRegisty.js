const mongoose = require("mongoose");

const marriageRegistrySchema = new mongoose.Schema({
  brideGroomId: {
    type: mongoose.Schema.ObjectId,
    ref: "Parishioners",
  },
  brideId: {
    type: mongoose.Schema.ObjectId,
    ref: "Parishioners",
  },
  brideGroomData: {
    name: {
      type: String,
      required: [true, "Name of the bride groom is not specified"],
    },
    familyName: {
      type: String,
      required: [true, "Family name of the bride groom is not specified"],
    },
    father: {
      type: String,
      required: [true, "Name of bridegroom's father is not specified"],
    },
    mother: {
      type: String,
      required: [true, "Name of bridegroom's mother is not specified"],
    },
    parish: {
      type: String,
      required: [true, "Name of bridegroom's parish is not specified"],
    },
  },
  brideData: {
    name: {
      type: String,
      required: [true, "Name of the bride is not specified"],
    },
    familyName: {
      type: String,
      required: [true, "Family name of the bride is not specified"],
    },
    father: {
      type: String,
      required: [true, "Name of bride's father is not specified"],
    },
    mother: {
      type: String,
      required: [true, "Name of bride's mother is not specified"],
    },
    parish: {
      type: String,
      required: [true, "Name of bride's parish is not specified"],
    },
  },

  marriageDate: {
    type: Date,
    required: [true, "Please provide marriage date"],
  },
  celebrant: {
    type: String,
    required: [true, "Please provide the celebrant name"],
  },
  parishPriest: {
    type: String,
    required: [true, "Parish priest name is not specified"],
  },
});

const marriageRegistry = mongoose.model(
  "marriageRegistry",
  marriageRegistrySchema
);

module.exports = marriageRegistry;
