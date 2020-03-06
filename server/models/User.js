const mongoose = require('mongoose');

const UserRole = require('./UserRole');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: UserRole,
    required: true,
  },
  items: {
    type: [String],
  },
  creditCardId: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  bankAccountId: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
});

module.exports = mongoose.model('User', userSchema);
