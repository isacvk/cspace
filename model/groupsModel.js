const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please specify the name of group!'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'please specify the type of group!'],
  },
});

const Groups = mongoose.model('Groups', groupSchema);

module.exports = Groups;
