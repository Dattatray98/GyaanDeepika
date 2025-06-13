const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


const events = require('events');
events.EventEmitter.defaultMaxListeners = 20; // or higher


const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());

app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ Database connected"))
.catch((err) => console.error("❌ Error connecting to DB:", err));

// Import & Use Routes
const userRoutes = require("./routes/user.js");
app.use("/users", userRoutes); // All user-related routes (signup, login, etc.)

const VideoRoutes = require("./routes/videos.js")
app.use("/videos", VideoRoutes);


const uploadVideoRoute = require("./CloudinaryRotes/video-upload.js")
app.use("/vi", uploadVideoRoute)

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
