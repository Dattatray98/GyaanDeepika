const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const passport = require("passport");
require('./config/passport');
app.use(passport.initialize());


const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Passport initialization
app.use(passport.initialize());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/users", require("./Routes/user.js"));
app.use("/auth", require("./Routes/auth.js"));
app.use("/videos", require("./Routes/video.js"));
app.use("/upload", require("./CloudinaryRotes/video-upload.js"));
app.use("/api/ai", require("./Routes/ai.js"));
app.use("/Courses", require("./Routes/course.js"));
app.use("/EnrolledCourses", require("./Routes/EnrolledCourse.js"));

// Default Route
app.get("/", (req, res) => {
  res.send("🎓 GyaanDeepika Backend is Live");
});

app.use('/api', require("./Routes/user.js"));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});