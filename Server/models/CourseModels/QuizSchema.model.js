const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  question: { type: String, required: [true, "Question is required"], trim: true },
  options: [{ type: String, required: [true, "Options are required"], trim: true }],
  correctAnswer: { type: String, required: [true, "Correct answer is required"], trim: true }
});

module.exports = quizSchema;
