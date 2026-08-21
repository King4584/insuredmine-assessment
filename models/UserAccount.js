const mongoose = require('mongoose');
module.exports = mongoose.model('UserAccount', new mongoose.Schema({
  accountName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));