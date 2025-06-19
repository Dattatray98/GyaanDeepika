const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  date: { type: String, default: () => new Date().toISOString() },
  important: { type: Boolean, default: false }
}, { _id: true });

module.exports = announcementSchema;
