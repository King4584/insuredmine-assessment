const mongoose = require('mongoose');

module.exports = mongoose.model('Agent', new mongoose.Schema({
  agentName: {
    type: String,
    required: true,
    unique: true
  }
}));