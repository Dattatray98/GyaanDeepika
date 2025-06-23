const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("../models/Course");

dotenv.config();

const mockCourse ={
  "title": "English Learning Bootcamp",
  "description": "Improve your English speaking, listening, reading, and writing skills from beginner to intermediate level.",
  "subtitle": "Master daily conversation, grammar, and vocabulary step by step.",
  "thumbnail": "https://res.cloudinary.com/dx1eoqsvt/image/upload/v1750602500/english_learning_bootcamp.jpg",
  "instructor": {
    "name": "Sarah Williams",
    "avatar": "https://via.placeholder.com/150",
    "bio": "Language Coach & Communication Trainer",
    "rating": 4.7,
    "students": 3400,
    "email": "sarah@example.com"
  },
  "rating": 4.7,
  "totalStudents": 3450,
  "duration": "25 hours",
  "level": "beginner",
  "language": "English",
  "lastUpdated": "Sun Jun 22 2025 13:00:00 GMT+0530 (India Standard Time)",
  "category": "Language Learning",
  "price": 499,
  "learningOutcomes": [
    "Speak confidently in everyday conversations",
    "Understand and use essential English grammar",
    "Expand vocabulary for personal and professional use",
    "Improve pronunciation and listening skills"
  ],
  "requirements": [
    "Willingness to practice daily",
    "Basic understanding of English letters and sounds",
    "Headphones or speakers for audio practice"
  ],
  "content": [
    {
      "title": "Getting Started with English",
      "description": "Start your journey by learning the basics of English",
      "duration": "40 min",
      "lessons": 2,
      "completed": 0,
      "locked": false,
      "content": [
        {
          "type": "video",
          "title": "Introduction to English",
          "duration": "18 min",
          "completed": false,
          "preview": true,
          "videoUrl": "https://res.cloudinary.com/dx1eoqsvt/video/upload/v1749802000/intro_english.mp4",
          "notes": "Understand what to expect and how to stay motivated.",
          "resources": [],
          "quizzes": [],
          "transcript": "Welcome to your English learning journey! In this course..."
        },
        {
          "type": "quiz",
          "title": "Getting Started Quiz",
          "duration": "6 min",
          "completed": false,
          "preview": false,
          "resources": [],
          "quizzes": [
            {
              "question": "What is the correct response to 'How are you?'",
              "options": ["I'm fine, thank you", "Goodbye", "Yes", "Please"],
              "correctAnswer": "I'm fine, thank you"
            }
          ]
        }
      ]
    },
    {
      "title": "Essential Grammar",
      "description": "Learn basic English grammar rules",
      "duration": "1 hour",
      "lessons": 2,
      "completed": 0,
      "locked": false,
      "content": [
        {
          "type": "video",
          "title": "Simple Tenses",
          "duration": "30 min",
          "completed": false,
          "preview": false,
          "videoUrl": "https://example.com/english-tenses.mp4",
          "notes": "Start with Present, Past, and Future tense examples.",
          "resources": [],
          "quizzes": [],
          "transcript": "We’ll look at subject + verb + object sentence patterns..."
        },
        {
          "type": "quiz",
          "title": "Grammar Basics",
          "duration": "10 min",
          "completed": false,
          "preview": false,
          "resources": [],
          "quizzes": [
            {
              "question": "Which sentence is correct?",
              "options": [
                "She go to school.",
                "He goes to school.",
                "They goes to school.",
                "We goes to school."
              ],
              "correctAnswer": "He goes to school."
            }
          ]
        }
      ]
    },
    {
      "title": "Daily Conversations",
      "description": "Practice common English phrases for everyday use",
      "duration": "50 min",
      "lessons": 2,
      "completed": 0,
      "locked": false,
      "content": [
        {
          "type": "video",
          "title": "Common Greetings & Phrases",
          "duration": "20 min",
          "completed": false,
          "preview": false,
          "videoUrl": "https://example.com/english-greetings.mp4",
          "notes": "Learn how to greet and introduce yourself confidently.",
          "resources": [],
          "quizzes": [],
          "transcript": "Hello! Hi! Good morning! How are you? Let’s practice daily greetings..."
        },
        {
          "type": "quiz",
          "title": "Conversation Practice",
          "duration": "8 min",
          "completed": false,
          "preview": false,
          "resources": [],
          "quizzes": [
            {
              "question": "What do you say after someone says 'Thank you'?",
              "options": ["Please", "Excuse me", "You're welcome", "No"],
              "correctAnswer": "You're welcome"
            }
          ]
        }
      ]
    }
  ],
  "resources": [
    {
      "title": "English Grammar PDF",
      "type": "pdf",
      "size": "1.2 MB",
      "downloadUrl": "https://example.com/english-grammar.pdf"
    }
  ],
  "announcements": [
    {
      "title": "Welcome to the Bootcamp!",
      "content": "Get ready to speak English with confidence. Start from Lesson 1 now!",
      "date": "Sun Jun 22 2025 13:10:00 GMT+0530 (India Standard Time)",
      "important": true
    }
  ],
  "totalProgress": 0,
  "completedLessons": 0,
  "totalLessons": 6,
  "estimatedTime": "3.5 hours"
}

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

