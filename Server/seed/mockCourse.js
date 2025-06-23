const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("../models/Course");

dotenv.config();

const mockCourse = {
  "title": "Frontend Development Bootcamp",
  "description": "Learn to build responsive websites using HTML, CSS, and JavaScript.",
  "subtitle": "Master frontend skills and launch your web career.",
  "thumbnail": "https://res.cloudinary.com/dx1eoqsvt/image/upload/v1750598073/frontend_development_sozdup.jpg",
  "instructor": {
    "name": "Coding.cherry",
    "avatar": "https://via.placeholder.com/150",
    "bio": "Programming expert YouTube Link : https://www.youtube.com/@Codingcherry",
    "rating": 4.9,
    "students": 2100
  },
  "rating": 4.9,
  "totalStudents": 2102,
  "duration": "15 hours",
  "level": "beginner",
  "language": "English",
  "category": "Programming",
  "price": 599,
  "learningOutcomes": [
    "Build responsive layouts using Flexbox and Grid",
    "Understand HTML semantics and accessibility",
    "Use modern CSS for styling and animations",
    "Add interactivity with JavaScript and DOM manipulation"
  ],
  "requirements": [
    "Basic computer usage",
    "Access to code editor and browser"
  ],
  "content": [
    {
      "title": "Getting Started",
      "description": "Introduction to frontend development and Backend Development",
      "duration": "20 min",
      "lessons": 2,
      "completed": 0,
      "locked": false,
      "content": [
        {
          "type": "video",
          "title": "What is Frontend Development and Backend Development?",
          "description": "Learn how the CSS Box Model and Flexbox layout work.",
          "duration": "2:29",
          "completed": false,
          "preview": true,
          "videoUrl": "https://res.cloudinary.com/dx1eoqsvt/video/upload/v1750645077/jn0pnqlfcx7qxweod7wr.mp4",
          "notes": "Frontend is what users see and interact with.",
          "resources": [
            "https://example.com/frontend-intro.pdf"
          ],
          "quizzes": [
            {
              "title": "Basics of HTML",
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language",
                "Hyper Tool Multi Language"
              ],
              "correctAnswer": "Hyper Text Markup Language"
            },
            {
              "title": "HTML Tags",
              "question": "Which tag is used to create a hyperlink in HTML?",
              "options": [
                "<a>",
                "<link>",
                "<href>",
                "<hyper>"
              ],
              "correctAnswer": "<a>"
            },
            {
              "title": "HTML Structure",
              "question": "Which element is the root of an HTML document?",
              "options": [
                "<body>",
                "<head>",
                "<html>",
                "<root>"
              ],
              "correctAnswer": "<html>"
            },
            {
              "title": "HTML Media",
              "question": "Which tag is used to embed an image in HTML?",
              "options": [
                "<image>",
                "<img>",
                "<src>",
                "<pic>"
              ],
              "correctAnswer": "<img>"
            },
            {
              "title": "HTML Attributes",
              "question": "Which attribute is used to define the source of an image?",
              "options": [
                "src",
                "href",
                "alt",
                "link"
              ],
              "correctAnswer": "src"
            }
          ]
          ,
          "transcript": "Welcome to this beginner-friendly JavaScript tutorial. Today, we'll cover the fundamentals of JavaScript, including variables, data types, functions, and control flow. Let's start with variables. In JavaScript, you can declare variables using var, let, or const. Let and const were introduced in ES6 and are preferred over var.\n\nNext, let's talk about data types. JavaScript supports primitive data types like string, number, boolean, null, undefined, and symbol. It also supports objects and arrays.\n\nNow let's move on to functions. Functions in JavaScript can be declared using the function keyword or arrow syntax. Functions allow you to reuse code and make your programs more organized.\n\nControl flow in JavaScript includes if-else statements, switch cases, and loops like for, while, and do-while. These help you control the logic and behavior of your programs.\n\nThat’s it for today’s JavaScript basics. Practice these concepts to build a strong foundation. Thanks for watching!.",
          "PdfDownloadUrl": "https://drive.google.com/file/d/14QZVMBQPG_DV2iBBSprBd3Yj9hmwmdp5/view?usp=sharing",
          "PdfViewUrl": "https://drive.google.com/file/d/14QZVMBQPG_DV2iBBSprBd3Yj9hmwmdp5/preview"
        },
        {
          "type": "video",
          "title": "Box Model & Flexbox",
          "description": "Learn how the CSS Box Model and Flexbox layout work.",
          "duration": "18 min",
          "completed": false,
          "preview": false,
          "videoUrl": "https://example.com/flexbox.mp4",
          "notes": "Flexbox helps layout items in one direction.",
          "resources": [],
          "quizzes": [
            {
              "title": "Basics of HTML",
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language",
                "Hyper Tool Multi Language"
              ],
              "correctAnswer": "Hyper Text Markup Language"
            },
            {
              "title": "HTML Tags",
              "question": "Which tag is used to create a hyperlink in HTML?",
              "options": [
                "<a>",
                "<link>",
                "<href>",
                "<hyper>"
              ],
              "correctAnswer": "<a>"
            },
            {
              "title": "HTML Structure",
              "question": "Which element is the root of an HTML document?",
              "options": [
                "<body>",
                "<head>",
                "<html>",
                "<root>"
              ],
              "correctAnswer": "<html>"
            },
            {
              "title": "HTML Media",
              "question": "Which tag is used to embed an image in HTML?",
              "options": [
                "<image>",
                "<img>",
                "<src>",
                "<pic>"
              ],
              "correctAnswer": "<img>"
            },
            {
              "title": "HTML Attributes",
              "question": "Which attribute is used to define the source of an image?",
              "options": [
                "src",
                "href",
                "alt",
                "link"
              ],
              "correctAnswer": "src"
            }
          ]
          ,
          "transcript": "Understand margins, padding, borders, and layout."
        },
      ]
    },
    {
      "title": "HTML Essentials",
      "description": "Learn HTML structure and common tags",
      "duration": "35 min",
      "lessons": 2,
      "completed": 0,
      "locked": false,
      "content": [
        {
          "type": "video",
          "title": "HTML Tags & Structure",
          "description": "Learn how the CSS Box Model and Flexbox layout work.",
          "duration": "15 min",
          "completed": false,
          "preview": false,
          "videoUrl": "https://example.com/html-tags.mp4",
          "notes": "Structure is key to semantic HTML.",
          "resources": [
            "https://example.com/html-ref.pdf"
          ],
          "quizzes": [
            {
              "title": "Basics of HTML",
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language",
                "Hyper Tool Multi Language"
              ],
              "correctAnswer": "Hyper Text Markup Language"
            },
            {
              "title": "HTML Tags",
              "question": "Which tag is used to create a hyperlink in HTML?",
              "options": [
                "<a>",
                "<link>",
                "<href>",
                "<hyper>"
              ],
              "correctAnswer": "<a>"
            },
            {
              "title": "HTML Structure",
              "question": "Which element is the root of an HTML document?",
              "options": [
                "<body>",
                "<head>",
                "<html>",
                "<root>"
              ],
              "correctAnswer": "<html>"
            },
            {
              "title": "HTML Media",
              "question": "Which tag is used to embed an image in HTML?",
              "options": [
                "<image>",
                "<img>",
                "<src>",
                "<pic>"
              ],
              "correctAnswer": "<img>"
            },
            {
              "title": "HTML Attributes",
              "question": "Which attribute is used to define the source of an image?",
              "options": [
                "src",
                "href",
                "alt",
                "link"
              ],
              "correctAnswer": "src"
            }
          ]
          ,
          "transcript": "Learn basic tags like div, p, h1, a..."
        },
        {
          "type": "video",
          "title": "HTML Tags & Structure",
          "description": "Learn how the CSS Box Model and Flexbox layout work.",
          "duration": "15 min",
          "completed": false,
          "preview": false,
          "videoUrl": "https://example.com/html-tags.mp4",
          "notes": "Structure is key to semantic HTML.",
          "resources": [
            "https://example.com/html-ref.pdf"
          ],
          "quizzes": [
            {
              "title": "Basics of HTML",
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language",
                "Hyper Tool Multi Language"
              ],
              "correctAnswer": "Hyper Text Markup Language"
            },
            {
              "title": "HTML Tags",
              "question": "Which tag is used to create a hyperlink in HTML?",
              "options": [
                "<a>",
                "<link>",
                "<href>",
                "<hyper>"
              ],
              "correctAnswer": "<a>"
            },
            {
              "title": "HTML Structure",
              "question": "Which element is the root of an HTML document?",
              "options": [
                "<body>",
                "<head>",
                "<html>",
                "<root>"
              ],
              "correctAnswer": "<html>"
            },
            {
              "title": "HTML Media",
              "question": "Which tag is used to embed an image in HTML?",
              "options": [
                "<image>",
                "<img>",
                "<src>",
                "<pic>"
              ],
              "correctAnswer": "<img>"
            },
            {
              "title": "HTML Attributes",
              "question": "Which attribute is used to define the source of an image?",
              "options": [
                "src",
                "href",
                "alt",
                "link"
              ],
              "correctAnswer": "src"
            }
          ]
          ,
          "transcript": "Learn basic tags like div, p, h1, a..."
        },
      ]
    },
    {
      "title": "CSS for Styling",
      "description": "Style your site with modern CSS",
      "duration": "40 min",
      "lessons": 2,
      "completed": 0,
      "locked": false,
      "content": [
        {
          "type": "video",
          "title": "Box Model & Flexbox",
          "description": "Learn how the CSS Box Model and Flexbox layout work.",
          "duration": "18 min",
          "completed": false,
          "preview": false,
          "videoUrl": "https://example.com/flexbox.mp4",
          "notes": "Flexbox helps layout items in one direction.",
          "resources": [],
          "quizzes": [
            {
              "title": "Basics of HTML",
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language",
                "Hyper Tool Multi Language"
              ],
              "correctAnswer": "Hyper Text Markup Language"
            },
            {
              "title": "HTML Tags",
              "question": "Which tag is used to create a hyperlink in HTML?",
              "options": [
                "<a>",
                "<link>",
                "<href>",
                "<hyper>"
              ],
              "correctAnswer": "<a>"
            },
            {
              "title": "HTML Structure",
              "question": "Which element is the root of an HTML document?",
              "options": [
                "<body>",
                "<head>",
                "<html>",
                "<root>"
              ],
              "correctAnswer": "<html>"
            },
            {
              "title": "HTML Media",
              "question": "Which tag is used to embed an image in HTML?",
              "options": [
                "<image>",
                "<img>",
                "<src>",
                "<pic>"
              ],
              "correctAnswer": "<img>"
            },
            {
              "title": "HTML Attributes",
              "question": "Which attribute is used to define the source of an image?",
              "options": [
                "src",
                "href",
                "alt",
                "link"
              ],
              "correctAnswer": "src"
            }
          ]
          ,
          "transcript": "Understand margins, padding, borders, and layout."
        },
        {
          "type": "video",
          "title": "Box Model & Flexbox",
          "description": "Learn how the CSS Box Model and Flexbox layout work.",
          "duration": "18 min",
          "completed": false,
          "preview": false,
          "videoUrl": "https://example.com/flexbox.mp4",
          "notes": "Flexbox helps layout items in one direction.",
          "resources": [],
          "quizzes": [
            {
              "title": "Basics of HTML",
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language",
                "Hyper Tool Multi Language"
              ],
              "correctAnswer": "Hyper Text Markup Language"
            },
            {
              "title": "HTML Tags",
              "question": "Which tag is used to create a hyperlink in HTML?",
              "options": [
                "<a>",
                "<link>",
                "<href>",
                "<hyper>"
              ],
              "correctAnswer": "<a>"
            },
            {
              "title": "HTML Structure",
              "question": "Which element is the root of an HTML document?",
              "options": [
                "<body>",
                "<head>",
                "<html>",
                "<root>"
              ],
              "correctAnswer": "<html>"
            },
            {
              "title": "HTML Media",
              "question": "Which tag is used to embed an image in HTML?",
              "options": [
                "<image>",
                "<img>",
                "<src>",
                "<pic>"
              ],
              "correctAnswer": "<img>"
            },
            {
              "title": "HTML Attributes",
              "question": "Which attribute is used to define the source of an image?",
              "options": [
                "src",
                "href",
                "alt",
                "link"
              ],
              "correctAnswer": "src"
            }
          ]
          ,
          "transcript": "Understand margins, padding, borders, and layout."
        },
      ]
    }
  ],
  "resources": [
    {
      "title": "Frontend Cheat Sheet",
      "type": "pdf",
      "size": "1.5 MB",
      "downloadUrl": "https://example.com/frontend-cheatsheet.pdf"
    }
  ],
  "announcements": [
    {
      "title": "Course Kickoff!",
      "content": "Welcome to your frontend journey!",
      "date": "Fri Jun 20 2025 14:35:00 GMT+0530 (India Standard Time)",
      "important": true
    }
  ],
  "totalProgress": 0,
  "completedLessons": 0,
  "totalLessons": 6,
  "estimatedTime": "3 hours",
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

