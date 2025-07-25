const mongoose = require("mongoose");

// Enhanced course progress sub-schema
const courseProgressSchema = new mongoose.Schema({
  completedVideos: [
    {
      contentId: { type: String, required: true },
      watchedDuration: { type: Number, default: 0 },
      isCompleted: { type: Boolean, default: false },
      firstAccessedAt: { type: Date, default: Date.now },
      lastWatchedAt: { type: Date, default: Date.now }
    }
  ],
  startedAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now },
  currentcontentId: { type: String, default: null },
  currentVideoProgress: { type: Number, default: 0 },
  completionPercentage: { type: Number, default: 0 }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  avatar: { type: String },
  bio: {
    type: String,
    maxlength: [150],
    default: ''
  },
  language: {
    type: String,
    default: 'English'
  },
  mobile: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    select: false,
    minlength: [8, "Password must be at least 8 characters"]
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },

  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: []
  }],

  progress: {
    type: Map,
    of: courseProgressSchema,
    default: {}
  },

  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
