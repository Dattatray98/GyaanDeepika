const mongoose = require("mongoose");
const dotenv = require("dotenv");
const StudyHub = require("../models/StudyHub");

dotenv.config();

const mockCourse = {
  "title": "JEE 2022 Physics Chapter-wise Notes",
  "type": "notes",
  "examType": "JEE",
  "subject": "Physics",
  "year": "2022",
  "downloads": 0,
  "rating": 4.5,
  "description": "Complete chapter-wise short notes for JEE 2022 Physics."
}


async function seedMockCourse() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const exists = await StudyHub.findOne({ title: mockCourse.title });
    if (exists) {
      console.log("⚠️ Course already exists. Skipping insertion.");
    } else {
      await StudyHub.create(mockCourse);
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

