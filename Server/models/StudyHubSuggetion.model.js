const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  requestType: { type: String, required: true },
  examType: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);