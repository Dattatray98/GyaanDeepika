const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/video");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer to store files in uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Upload Route
router.post("/video", upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title,
      description,
      qualities,
      duration,
      durationFormatted,
      views,
      isPublic,
      tags,
      category
    } = req.body;

    const videoFile = req.files.video?.[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({ error: "Video or thumbnail file missing" });
    }

    // Upload video to Cloudinary
    const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: "gyaandeepika_videos"
    });

    // Upload thumbnail to Cloudinary
    const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile.path, {
      folder: "gyaandeepika_thumbnails"
    });

    // Delete local files
    try { fs.unlinkSync(videoFile.path); } catch (err) { console.warn("Video delete error:", err.message); }
    try { fs.unlinkSync(thumbnailFile.path); } catch (err) { console.warn("Thumbnail delete error:", err.message); }

    // Save to MongoDB
    const newVideo = new Video({
      id: uuidv4(),
      title,
      description,
      thumbnailUrl: thumbnailUpload.secure_url,
      videoUrl: videoUpload.secure_url,
      qualities,
      duration,
      durationFormatted,
      views,
      isPublic,
      tags,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await newVideo.save();

    res.status(201).json({ message: "✅ Video uploaded successfully", video: newVideo });

  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
