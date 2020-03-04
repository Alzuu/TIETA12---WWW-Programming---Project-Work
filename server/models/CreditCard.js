const mongoose = require('mongoose');

const creditCardSchema = mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: 20,
  },
  CVC: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 4,
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
