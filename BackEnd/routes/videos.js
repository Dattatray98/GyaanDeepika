// routes/video.js
const express = require("express");
const router = express.Router();
const { GetVideoContent, UploadVideoContent } = require("../controllers/video"); // ✅ Import properly

router.get("/", GetVideoContent);

router.post("/upload", UploadVideoContent);

module.exports = router;