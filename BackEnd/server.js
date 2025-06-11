// All imports
import express from "express";
import mongoose from "mongoose";
import { User } from "./models/user.js"; // Make sure this file exists
import cors from "cors";



const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://jojewardattatray:iftgrtpdUWrn4SV8@cluster0.grtadzq.mongodb.net/gyaandeepikaDB",
     {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "GyaanDeepika" // 👈 force the DB name
  }
)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// POST /users - to create a new user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "✅ User created successfully and this is from backend", user: newUser });
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    res.status(400).json({ message: "Error creating user", error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});


app.get("/users", (req, res) => {
    res.send("backend is working ")
})

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Server is ready");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
