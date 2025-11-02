// models/Suggestion.js
import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  requestType: {
    type: String,
    enum: ['notes', 'question-paper', 'other'],
    required: true,
  },
  examType: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

export default Suggestion;
