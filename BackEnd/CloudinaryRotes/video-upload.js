const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dx1eoqsvt', 
  api_key: '115514661298733', 
  api_secret: 'oUh2upl78rAuMcBrVo3xbjItRW4'
});

// routes/upload.js




// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "hackathon_videos", // Optional folder
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          return res.status(500).json({ error: "Upload failed", details: error });
        }

        return res.json({
          message: "✅ Video uploaded successfully",
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );

    const stream = require("streamifier").createReadStream(req.file.buffer);
    stream.pipe(result);
  } catch (err) {
    console.error("❌ Upload failed", err);
    res.status(500).json({ error: "❌ Upload failed", details: err.message });
  }
});

module.exports = router;
