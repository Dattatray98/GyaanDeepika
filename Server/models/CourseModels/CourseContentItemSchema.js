const mongoose = require("mongoose");
const quizSchema = require("./QuizSchema");

const courseContentItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  type: {
    type: String,
    enum: ['video', 'reading', 'quiz', 'assignment'],
    default: 'video',
    required: [true, "Content type is required"]
  },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  duration: { type: String, required: true, default: "0 min" },
  completed: { type: Boolean, default: false },
  preview: { type: Boolean, default: false },
  videoUrl: {
    type: String,
    required: function () { return this.type === 'video'; }
  },
  transcript:{type: String},
  notes: { type: String },
  PdfDownloadUrl: {type:String},
  PdfViewUrl: {type: String},
  resources: [{ type: String }],
  quizzes: [quizSchema]
}, { _id: true });

module.exports = courseContentItemSchema;
