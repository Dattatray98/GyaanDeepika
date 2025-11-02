const express = require("express");
const router = express.Router();
const summarizeTranscript = require("../Services/summarizeService");

router.post("/summarize", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.length < 10) {
    return res.status(400).json({
      success: false,
      message: "Transcript text is required and must be at least 10 characters.",
    });
  }

  try {
    const summary = await summarizeTranscript(transcript);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to summarize transcript",
      error: error.message,
    });
  }
});

module.exports = router;
