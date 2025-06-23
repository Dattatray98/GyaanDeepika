const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
   contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
   UserNotes: { type: String, default: '' },
   completed: { type: Boolean, default: false },
   completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Note', noteSchema, "notes");
