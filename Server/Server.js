const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const events = require('events');
const passport = require("passport");
const session = require("express-session");
require("./config/passport");

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


events.EventEmitter.defaultMaxListeners = 20; // Optional: Only if needed

const PORT = process.env.PORT || 8000;

// ───────────────────── MIDDLEWARE ─────────────────────
app.use(express.json({ limit: "100mb" })); // Increase limit if uploading large files
app.use(cors());

// ─────────────────── DATABASE CONNECTION ──────────────
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ─────────────────────── ROUTES ────────────────────────
app.use("/auth", require("./Routes/auth.js"));
app.use("/users", require("./Routes/user.js"));
app.use("/videos", require("./Routes/video.js"));
app.use("/upload", require("./CloudinaryRotes/video-upload.js"));
app.use("/api/ai", require("./Routes/ai.js"));
app.use("/Courses", require("./Routes/course.js"));
app.use("/EnrolledCourses", require("./Routes/EnrolledCourse.js"));


// ────────────────────── DEFAULT ROUTE ──────────────────
app.get("/", (req, res) => {
  res.send("🎓 GyaanDeepika Backend is Live");
});

// ────────────────────── START SERVER ───────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
