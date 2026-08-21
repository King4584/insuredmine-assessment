const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  firstName: { type: String },
  dob: { type: String },
  address: { type: String },
  phone: { type: String },
  state: { type: String },
  zip: { type: String },
  email: { type: String }, 
  gender: { type: String },
  userType: { type: String }
}));