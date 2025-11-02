const mongoose = require("mongoose");
const courseContentItemSchema = require("./CourseContentItemSchema.model");

const courseSectionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true },
  duration: { type: String, default: "0 min" },
  lessons: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
  locked: { type: Boolean, default: false },
  content: [courseContentItemSchema]
}, { _id: true });

module.exports = courseSectionSchema;
