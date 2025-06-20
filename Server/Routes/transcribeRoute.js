const express = require("express");
const router = express.Router();
const axios = require("axios");

const {
  startTranscriptionJob,
  getTranscriptionStatus,
} = require("../services/transcribeService");

// 1️⃣ Start transcription
router.post("/transcribe", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ success: false, message: "Missing videoUrl" });
  }

  const jobName = `transcribe-${Date.now()}`;

  try {
    await startTranscriptionJob(videoUrl, jobName);
    res.json({ success: true, jobName, message: "Transcription job started." });
  } catch (err) {
    console.error("Transcription Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2️⃣ Check job status + get transcript
router.get("/transcribe/status/:jobName", async (req, res) => {
  const { jobName } = req.params;

  try {
    const { status, transcriptUrl } = await getTranscriptionStatus(jobName);

    if (status === "COMPLETED" && transcriptUrl) {
      const { data } = await axios.get(transcriptUrl);
      const transcript = data.results.transcripts[0].transcript;
      return res.json({ success: true, status, transcript });
    }

    res.json({ success: true, status });
  } catch (err) {
    console.error("Status Check Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
