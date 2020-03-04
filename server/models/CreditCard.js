const mongoose = require('mongoose');

const creditCardSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  CVC: {
    type: Number,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50,
  },
});

module.exports = mongoose.model('CreditCard', creditCardSchema);
