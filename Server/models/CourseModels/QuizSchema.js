const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: { type: String, required: [true, "Question is required"], trim: true },
  options: [{ type: String, required: [true, "Options are required"], trim: true }],
  correctAnswer: { type: String, required: [true, "Correct answer is required"], trim: true }
}, { _id: false });

module.exports = quizSchema;
