const mongoose = require("mongoose");

// Define course progress sub-schema
const courseProgressSchema = new mongoose.Schema({
  completedVideos: [
    {
      contentId: { type: String, required: true },
      watchedDuration: { type: Number, default: 0 }, // seconds watched
      isCompleted: { type: Boolean, default: false },
    }
  ],
  lastAccessed: { type: Date, default: Date.now },
  currentcontentId: { type: String, default: null },
  currentVideoProgress: { type: Number, default: 0 }, // seconds watched
  completionPercentage: { type: Number, default: 0 }
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Core Identity Fields
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  avatar: { type: String },

  // Authentication Fields
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

  // Course Management
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: []
  }],

  // Course Progress Map: courseId -> progress object
  progress: {
    type: Map,
    of: courseProgressSchema,
    default: {}
  },

  // Roles & Timestamps
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

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
