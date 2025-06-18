const mongoose = require("mongoose");

// Sub-schema for Quiz
const quizSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: [true, "Question is required"],
    trim: true
  },
  options: [{ 
    type: String, 
    required: [true, "Options are required"],
    trim: true 
  }],
  correctAnswer: { 
    type: String, 
    required: [true, "Correct answer is required"],
    trim: true
  }
}, { _id: false });

// Sub-schema for Course Content Items
const courseContentItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  type: { 
    type: String, 
    required: [true, "Content type is required"],
    enum: ['video', 'reading', 'quiz', 'assignment'],
    default: 'video'
  },
  title: { 
    type: String, 
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  duration: { 
    type: String, 
    required: [true, "Duration is required"],
    default: "0 min"
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  preview: { 
    type: Boolean, 
    default: false 
  },
  videoUrl: { 
    type: String,
    required: function() { return this.type === 'video'; }
  },
  notes: { 
    type: String 
  },
  resources: [{ 
    type: String 
  }],
  quizzes: [quizSchema]
}, { _id: true });

// Sub-schema for Course Sections
const courseSectionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { 
    type: String, 
    required: [true, "Section title is required"],
    trim: true,
    maxlength: [100, "Section title cannot exceed 100 characters"]
  },
  description: { 
    type: String,
    trim: true
  },
  duration: { 
    type: String,
    default: "0 min"
  },
  lessons: { 
    type: Number,
    default: 0
  },
  completed: { 
    type: Number,
    default: 0
  },
  locked: { 
    type: Boolean,
    default: false
  },
  content: [courseContentItemSchema]
}, { _id: true });

// Sub-schema for Resources
const resourceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { 
    type: String, 
    required: [true, "Resource title is required"],
    trim: true
  },
  type: { 
    type: String,
    required: [true, "Resource type is required"],
    enum: ['pdf', 'doc', 'zip', 'link', 'other'],
    default: 'pdf'
  },
  size: { 
    type: String,
    default: "0 MB"
  },
  downloadUrl: { 
    type: String,
    required: [true, "Download URL is required"]
  }
}, { _id: true });

// Sub-schema for Announcements
const announcementSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { 
    type: String, 
    required: [true, "Announcement title is required"],
    trim: true
  },
  content: { 
    type: String, 
    required: [true, "Announcement content is required"],
    trim: true
  },
  date: { 
    type: String,
    default: () => new Date().toISOString()
  },
  important: { 
    type: Boolean,
    default: false
  }
}, { _id: true });

// Main Course Schema
const courseSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { 
    type: String, 
    required: [true, "Course title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: { 
    type: String,
    required: [true, "Course description is required"],
    trim: true
  },
  subtitle: { 
    type: String,
    trim: true
  },
  thumbnail: { 
    type: String,
    required: [true, "Thumbnail URL is required"],
    default: "https://via.placeholder.com/300x200"
  },
  instructor: {
    _id: { 
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Instructor ID is required"],
      ref: 'User'
    },
    name: { 
      type: String,
      required: [true, "Instructor name is required"],
      trim: true
    },
    avatar: { 
      type: String,
      default: "https://via.placeholder.com/150"
    },
    bio: { 
      type: String,
      trim: true
    },
    rating: { 
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0
    },
    students: { 
      type: Number,
      min: [0, "Student count cannot be negative"],
      default: 0
    }
  },
  rating: { 
    type: Number,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
    default: 0
  },
  totalStudents: { 
    type: Number,
    min: [0, "Student count cannot be negative"],
    default: 0
  },
  duration: { 
    type: String,
    default: "0 hours"
  },
  level: { 
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  language: { 
    type: String,
    default: "English"
  },
  lastUpdated: { 
    type: String,
    default: () => new Date().toISOString()
  },
  category: { 
    type: String,
    trim: true
  },
  price: { 
    type: Number, 
    min: [0, "Price cannot be negative"],
    default: 0
  },
  learningOutcomes: [{ 
    type: String,
    trim: true
  }],
  requirements: [{ 
    type: String,
    trim: true
  }],
  content: [courseSectionSchema],
  resources: [resourceSchema],
  announcements: [announcementSchema],
  totalProgress: { 
    type: Number,
    min: [0, "Progress cannot be less than 0"],
    max: [100, "Progress cannot exceed 100"],
    default: 0
  },
  completedLessons: { 
    type: Number,
    min: [0, "Completed lessons cannot be negative"],
    default: 0
  },
  totalLessons: { 
    type: Number,
    min: [0, "Total lessons cannot be negative"],
    default: 0
  },
  estimatedTime: { 
    type: String,
    default: "0 hours"
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search functionality
courseSchema.index({
  title: 'text',
  description: 'text',
  subtitle: 'text',
  'instructor.name': 'text'
});

// Virtual for formatted price
courseSchema.virtual('formattedPrice').get(function() {
  return this.price === 0 ? 'Free' : `$${this.price.toFixed(2)}`;
});

// Middleware to update totalLessons when content changes
courseSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.totalLessons = this.content.reduce((total, section) => {
      return total + (section.content?.length || 0);
    }, 0);
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema, "Courses");