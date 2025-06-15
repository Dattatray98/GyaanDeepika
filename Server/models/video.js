const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  qualities: {
    type: [String], // example: ["360p", "480p", "720p"]
    required: true
  },
  duration: {
    type: Number, // store duration in seconds
    required: true
  },
  durationFormatted: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String], // example: ["math", "lecture"]
    default: []
  },
  category: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    default: ""
  },
  summary: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
