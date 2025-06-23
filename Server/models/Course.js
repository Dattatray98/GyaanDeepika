const mongoose = require("mongoose");
const courseSectionSchema = require("./CourseModels/CourseSectionSchema");
const resourceSchema = require("./CourseModels/ResourceSchema");
const announcementSchema = require("./CourseModels/AnnouncementSchema");

const courseSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  thumbnail: {
    type: String,
    required: true,
    default: "https://via.placeholder.com/300x200"
  },
  instructor: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', auto: true},
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: "https://via.placeholder.com/150" },
    bio: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    students: { type: Number, min: 0, default: 0 }
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalStudents: { type: Number, min: 0, default: 0 },
  duration: { type: String, default: "0 seconds" },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  language: { type: String, default: "English" },
  lastUpdated: { type: String, default: () => new Date().toISOString() },
  category: { type: String, trim: true },
  price: { type: Number, min: 0, default: 0 },
  learningOutcomes: [{ type: String, trim: true }],
  requirements: [{ type: String, trim: true }],
  content: [courseSectionSchema],
  resources: [resourceSchema],
  announcements: [announcementSchema],
  totalProgress: { type: Number, min: 0, max: 100, default: 0 },
  completedLessons: { type: Number, min: 0, default: 0 },
  totalLessons: { type: Number, min: 0, default: 0 },
  estimatedTime: { type: String, default: "0 hours" }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.index({
  title: 'text',
  description: 'text',
  subtitle: 'text',
  'instructor.name': 'text'
});

courseSchema.virtual('formattedPrice').get(function () {
  return this.price === 0 ? 'Free' : `$${this.price.toFixed(2)}`;
});

courseSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.totalLessons = this.content.reduce((total, section) => {
      return total + (section.content?.length || 0);
    }, 0);
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema, "Courses");
