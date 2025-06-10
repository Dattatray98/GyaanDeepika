import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";

const users = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

const app = express();
app.use(cors());

mongoose.connect("mongodb+srv://jojewardattatray:iftgrtpdUWrn4SV8@cluster0.grtadzq.mongodb.net/")
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log("Got an error", err));

app.get("/", (req, res) => {
  res.send("Server is ready");
  console.log("server is ready")
});

app.get("/users", (req, res) => {
  res.json(users);  // ✅ Corrected
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
