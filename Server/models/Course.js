const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Course title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: { 
    type: String,
    required: [true, "Course description is required"]
  },
  thumbnail: { 
    type: String,
    default: "https://via.placeholder.com/300x200"
  },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId reference
    ref: 'User',
    required: true
  },
  price: { 
    type: Number, 
    default: 0,
    min: [0, "Price cannot be negative"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema, "Courses");