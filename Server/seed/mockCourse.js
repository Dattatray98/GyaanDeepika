const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("../models/Course");

dotenv.config();

const mockCourse = {
  title: "Frontend Development Bootcamp",
  description: "Learn to build responsive websites using HTML, CSS, and JavaScript.",
  subtitle: "Master frontend skills and launch your web career.",
  thumbnail: "https://via.placeholder.com/300x200",
  instructor: {
    _id: new mongoose.Types.ObjectId(), // required if schema expects this
    name: "Jane Smith",
    avatar: "https://via.placeholder.com/150",
    bio: "Frontend Engineer & UI/UX Expert",
    rating: 4.9,
    students: 2100
  },
  rating: 4.9,
  totalStudents: 2101,
  duration: "15 hours",
  level: "beginner",
  language: "English",
  lastUpdated: new Date("2025-06-20T09:00:00.000Z"),
  category: "Web Development",
  price: 599,
  learningOutcomes: [
    "Build responsive layouts using Flexbox and Grid",
    "Understand HTML semantics and accessibility",
    "Use modern CSS for styling and animations",
    "Add interactivity with JavaScript and DOM manipulation"
  ],
  requirements: [
    "Basic computer usage",
    "Access to code editor and browser"
  ],
  content: [
    {
      title: "Getting Started",
      description: "Introduction to frontend development",
      duration: "20 min",
      lessons: 2,
      completed: 0,
      locked: false,
      content: [
        {
          type: "video",
          title: "What is Frontend Development?",
          duration: "10 min",
          completed: false,
          preview: true,
          videoUrl: "https://res.cloudinary.com/dx1eoqsvt/video/upload/v1749800762/twpaqoqrjrgwgywtdxsu.mp4",
          Transcript: "This video explains the role of a frontend developer.",
          notes: "Frontend is what users see and interact with.",
          resources: ["https://example.com/frontend-intro.pdf"],
          quizzes: []
        },
        {
          type: "quiz",
          title: "Web Tech Basics",
          duration: "10 min",
          completed: false,
          preview: false,
          resources: [],
          quizzes: [
            {
              question: "Which of the following is NOT a frontend language?",
              options: ["HTML", "CSS", "JavaScript", "Python"],
              correctAnswer: "Python"
            }
          ]
        }
      ]
    },
    {
      title: "HTML Essentials",
      description: "Learn HTML structure and common tags",
      duration: "35 min",
      lessons: 2,
      completed: 0,
      locked: false,
      content: [
        {
          type: "video",
          title: "HTML Tags & Structure",
          duration: "15 min",
          completed: false,
          preview: false,
          videoUrl: "https://example.com/html-tags.mp4",
          Transcript: "Learn basic tags like div, p, h1, a...",
          notes: "Structure is key to semantic HTML.",
          resources: ["https://example.com/html-ref.pdf"],
          quizzes: []
        },
        {
          type: "quiz",
          title: "HTML Quiz",
          duration: "8 min",
          completed: false,
          preview: false,
          quizzes: [
            {
              question: "What tag is used for paragraphs?",
              options: ["<div>", "<p>", "<span>", "<text>"],
              correctAnswer: "<p>"
            }
          ]
        }
      ]
    },
    {
      title: "CSS for Styling",
      description: "Style your site with modern CSS",
      duration: "40 min",
      lessons: 2,
      completed: 0,
      locked: false,
      content: [
        {
          type: "video",
          title: "Box Model & Flexbox",
          duration: "18 min",
          videoUrl: "https://example.com/flexbox.mp4",
          Transcript: "Understand margins, padding, borders, and layout.",
          completed: false,
          preview: false,
          notes: "Flexbox helps layout items in one direction.",
          resources: [],
          quizzes: []
        },
        {
          type: "quiz",
          title: "CSS Quiz",
          duration: "7 min",
          completed: false,
          preview: false,
          quizzes: [
            {
              question: "What does the 'margin' property control?",
              options: ["Text color", "Border width", "Space outside elements", "Padding inside box"],
              correctAnswer: "Space outside elements"
            }
          ]
        }
      ]
    }
  ],
  resources: [
    {
      title: "Frontend Cheat Sheet",
      type: "pdf",
      size: "1.5 MB",
      downloadUrl: "https://example.com/frontend-cheatsheet.pdf"
    }
  ],
  announcements: [
    {
      title: "Course Kickoff!",
      content: "Welcome to your frontend journey!",
      important: true,
      date: new Date("2025-06-20T09:05:00.000Z")
    }
  ],
  totalProgress: 0,
  completedLessons: 0,
  totalLessons: 6,
  estimatedTime: "3 hours"
};

async function seedMockCourse() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const exists = await Course.findOne({ title: mockCourse.title });
    if (exists) {
      console.log("⚠️ Course already exists. Skipping insertion.");
    } else {
      await Course.create(mockCourse);
      console.log("✅ Mock course inserted successfully");
    }
  } catch (error) {
    console.error("❌ Seeder Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
}

seedMockCourse();

