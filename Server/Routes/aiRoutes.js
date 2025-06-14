const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// POST /api/ai/generate-text
router.post("/generate-text", aiController.generateText);

// POST /api/ai/analyze-image
router.post("/analyze-image", aiController.analyzeImage);

module.exports = router;