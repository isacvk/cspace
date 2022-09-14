const mongoose = require('mongoose');

const Parishioners = require('./personModel');

const engagementRegSchema = new mongoose.Schema({
  groomId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
  },
  brideId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parishioners',
  },
  groomData: {
    baptismName: {
      type: String,
      required: [true, 'Name of the bride groom is not specified'],
    },
    familyName: {
      type: String,
      required: [true, 'Family name of the bride groom is not specified'],
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
      // required: [true, "Name of bridegroom's parish is not specified"],
    },
    dob: {
      type: Date,
      required: [true, 'Dob is not specified'],
    },
    doBaptism: {
      type: Date,
      required: [true, 'Baptism date is not specified'],
    },
    baptismPlace: {
      type: String,
      // required: [true, 'Baptism place is not specified'],
    },
  },
  brideData: {
    baptismName: {
      type: String,
      required: [true, 'Name of the bride is not specified'],
    },
    familyName: {
      type: String,
      required: [true, 'Family name of the bride is not specified'],
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
      // required: [true, "Name of bride's parish is not specified"],
    },
    dob: {
      type: Date,
      required: [true, 'Dob is not specified'],
    },
    doBaptism: {
      type: Date,
      required: [true, 'Baptism date is not specified'],
    },
    baptismPlace: {
      type: String,
      // required: [true, 'Baptism place is not specified'],
    },
  },
  bannDates: [
    {
      type: Date,
    },
  ],

  engagementDate: {
    type: Date,
    required: [true, 'Engagement date is not specified'],
  },
  celebrant: {
    type: String,
    required: [true, 'Name of the celebrant is not specified'],
  },
  parishPriest: {
    type: String,
    required: [true, 'Parish priest name is not specified'],
  },
  status: {
    type: String,
    enum: ['valid', 'divorced', 'hus-exp', 'wife-exp'],
    default: 'valid',
  },
  remarks: {
    type: String,
  },
});

// engagementRegSchema.pre("save", async function (req,next) {
//   const user = await Parishioners.findById()

// })

engagementRegSchema.post('save', async (doc, next) => {
  let updateList = [];
  if (doc.groomId) updateList.push(doc.groomId);
  if (doc.brideId) updateList.push(doc.brideId);

  const updateStatus = await Parishioners.updateMany(
    { _id: { $in: updateList } },
    {
      $set: { maritalStatus: 'engaged' },
    },
  );
  next();
});

const engagementReg = mongoose.model('engagementReg', engagementRegSchema);

module.exports = engagementReg;
