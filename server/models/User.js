var mongoose = require('mongoose');

const UserRole = require('./UserRole');

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
      type: UserRole,
      required: true
  }
});

module.exports =  mongoose.model('User', userSchema);
