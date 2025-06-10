const express = require("express");
const cors = require("cors");


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


//mongoDB connection set up
const mongoose = require("mongoose");
require("dotenv").config(); // load from .env


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));




app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from backend again! agsin" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
