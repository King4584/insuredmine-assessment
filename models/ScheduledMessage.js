const mongoose = require('mongoose');
module.exports = mongoose.model('ScheduledMessage', new mongoose.Schema({
  message: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  insertedAt: { type: Date, default: Date.now }
}));