const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'zip', 'link', 'other'],
    default: 'pdf',
    required: true
  },
  size: { type: String, default: "0 MB" },
  downloadUrl: { type: String, required: true }
}, { _id: true });

module.exports = resourceSchema;
