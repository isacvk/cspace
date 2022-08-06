const mongoose = require("mongoose");

const Parishioners = require("./personModel");

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

//*param myParam Updates marriage date on persons model

marriageRegistrySchema.post("save", async function (next) {
  let updateList = [];
  if (this.brideGroomId) updateList.push(this.brideGroomId);
  if (this.brideId) updateList.push(this.brideId);

  updateMarriageDate = await Parishioners.updateMany(
    { _id: { $in: updateList } },
    {
      $set: { marriage: this.marriageDate },
    }
  );
});

const marriageRegistry = mongoose.model(
  "marriageRegistry",
  marriageRegistrySchema
);

module.exports = marriageRegistry;
