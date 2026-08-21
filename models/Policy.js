const mongoose = require('mongoose');
module.exports = mongoose.model('Policy', new mongoose.Schema({
  policyNumber: { type: String, unique: true },
  policyStartDate: { type: Date },
  policyEndDate: { type: Date },
  policyCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));