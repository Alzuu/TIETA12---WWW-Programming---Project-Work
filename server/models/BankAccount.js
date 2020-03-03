const mongoose = require('mongoose');

const bankAccountSchema = mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
