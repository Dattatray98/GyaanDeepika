const mongoose = require("mongoose");
const Course = require("../models/Course");
require("dotenv").config();

const mockCourse = {
  title: "Complete JavaScript Course",
  description: "Learn JavaScript from scratch to advanced with hands-on projects.",
  subtitle: "Master JavaScript with real-world applications.",
  thumbnail: "https://via.placeholder.com/300x200",
  instructor: {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    avatar: "https://via.placeholder.com/150",
    bio: "Senior Developer & JavaScript Enthusiast",
    rating: 4.7,
    students: 1250
  },
  rating: 4.8,
  totalStudents: 1250,
  duration: "12 hours",
  level: "beginner",
  language: "English",
  lastUpdated: new Date().toISOString(),
  category: "Web Development",
  price: 499,
  learningOutcomes: [
    "Understand JavaScript fundamentals",
    "Build dynamic web applications",
    "Work with APIs and asynchronous code"
  ],
  requirements: [
    "Basic computer knowledge",
    "Internet connection"
  ],
  content: [
    {
      title: "Introduction",
      description: "Welcome to the course",
      duration: "15 min",
      lessons: 2,
      completed: 0,
      locked: false,
      content: [
        {
          type: "video",
          title: "What is JavaScript?",
          duration: "7 min",
          preview: true,
          videoUrl: "https://example.com/video1.mp4",
          notes: "JavaScript is a scripting language...",
          resources: ["https://example.com/resource1.pdf"]
        },
        {
          type: "quiz",
          title: "Intro Quiz",
          duration: "8 min",
          quizzes: [
            {
              question: "What is JavaScript?",
              options: ["Programming language", "Database", "Browser", "Image format"],
              correctAnswer: "Programming language"
            }
          ]
        }
      ]
    }
  ],
  resources: [
    {
      title: "JS Cheat Sheet",
      type: "pdf",
      size: "1 MB",
      downloadUrl: "https://example.com/js-cheatsheet.pdf"
    }
  ],
  announcements: [
    {
      title: "Welcome!",
      content: "Glad to have you in this course.",
      important: true
    }
  ],
  totalProgress: 0,
  completedLessons: 0,
  totalLessons: 2,
  estimatedTime: "1 hour"
};

async function seedMockCourse() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    await Course.create(mockCourse);
    console.log("✅ Mock course inserted");

    await mongoose.disconnect();
    console.log("✅ Disconnected");
  } catch (error) {
    console.error("❌ Seeder Error:", error);
  }
}

seedMockCourse();
