const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { uploadToS3 } = require('../services/s3Uploader');

router.post('/upload-video', upload.single('video'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    const result = await uploadToS3(file.buffer, file.originalname, file.mimetype);

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      s3Url: result.Location,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "S3 upload failed",
      error: err.message,
    });
  }
});

module.exports = router;
