const express = require("express");
const router = express.Router();

const {
  transcribeAndSummarize,
} = require("../services/transcribeService.service");

// ✅ Route to handle full process: transcription + summary
router.post("/transcribe", async (req, res) => {
  const { videoUrl, language } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ success: false, message: "Missing videoUrl" });
  }

  try {
    const { summary, transcriptText } = await transcribeAndSummarize(videoUrl, language);

    res.status(200).json({
      success: true,
      summary,
      transcript: transcriptText,
      message: "Transcript and summary generated successfully.",
    });
  } catch (err) {
    console.error("❌ Transcription + Summary Error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Server error during transcription.",
    });
  }
});

module.exports = router;
