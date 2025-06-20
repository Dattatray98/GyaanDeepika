const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  summaryText: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
});

// TTL: Delete summary 2 days after it's marked completed
summarySchema.index({ completedAt: 1 }, { expireAfterSeconds: 172800 });

module.exports = mongoose.model("Summary", summarySchema);
