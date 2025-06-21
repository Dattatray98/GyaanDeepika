const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const passport = require("passport");

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Passport
require('./config/passport');
app.use(passport.initialize());

// Database
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/users", require("./Routes/user"));
app.use("/auth", require("./Routes/auth"));
app.use("/api/courses", require("./Routes/course"))
app.use("/api/enrolled", require("./Routes/EnrolledCourse"))
app.use('/api', require("./Routes/uploadRoute"));
app.use('/api', require("./Routes/transcribeRoute"));
app.use("/api/summary", require("./Routes/summaryRoute"));
app.use("/api/qa", require("./Routes/qaRoutes"));
app.get("/", (req, res) => {
  res.send("🎓 GyaanDeepika Backend is Live");
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});