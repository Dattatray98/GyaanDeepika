const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Summary = require("../models/Summary");
const Course = require("../models/Course");
const generateSummary = require("../services/generateSummary");
const { verifyToken } = require("../middleware/auth");

// 🔒 Protect all routes
router.use(verifyToken);

/**
 * @route POST /api/summary/generate/:courseId/:contentId
 */
router.post("/generate/:courseId/:contentId", async (req, res) => {
  const { courseId, contentId } = req.params;
  const userId = req.user.id;

  console.log("🧪 Summary Generation Request:");
  console.log("  ➤ courseId:", courseId);
  console.log("  ➤ contentId:", contentId);
  console.log("  ➤ userId:", userId);

  try {
    // Optional: Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ success: false, message: "Invalid courseId or contentId format." });
    }

    // ✅ Check if summary already exists
    const existing = await Summary.findOne({ userId, courseId, contentId });
    if (existing) {
      console.log("✅ Summary already exists.");
      return res.status(200).json({
        success: true,
        message: "Summary already exists",
        data: existing,
      });
    }

    // ✅ Fetch course
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("❌ Course not found");
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // ✅ Find the transcript in nested content
    let transcript = null;
    for (const section of course.content) {
      for (const item of section.content) {
        if (item._id.toString() === contentId) {
          console.log("✅ Found matching content item");
          transcript = item.transcript || item.Transcript || null;
          break;
        }
      }
      if (transcript) break;
    }

    if (!transcript) {
      console.log("❌ Transcript not found in content");
      return res.status(404).json({ success: false, message: "Transcript not found for this content item" });
    }

    // ✅ Generate summary using AI service
    const summaryText = await generateSummary(transcript);
    if (!summaryText) {
      return res.status(500).json({ success: false, message: "Summary generation failed" });
    }

    // ✅ Save to database
    const summary = await Summary.create({ userId, courseId, contentId, summaryText });

    console.log("✅ Summary generated and saved");
    return res.status(201).json({
      success: true,
      message: "Summary generated successfully",
      data: summary,
    });
  } catch (err) {
    console.error("❌ Summary generation error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

/**
 * @route GET /api/summary/:courseId/:contentId
 */
router.get("/:courseId/:contentId", async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;

    const summary = await Summary.findOne({ userId, courseId, contentId });
    if (!summary) {
      return res.status(404).json({ success: false, message: "Summary not found" });
    }

    return res.status(200).json({ success: true, data: summary });
  } catch (err) {
    console.error("❌ Fetch summary error:", err.message);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

/**
 * @route PATCH /api/summary/complete/:courseId/:contentId
 */
router.patch("/complete/:courseId/:contentId", async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;

    const summary = await Summary.findOneAndUpdate(
      { userId, courseId, contentId },
      { completed: true, completedAt: new Date() },
      { new: true }
    );

    if (!summary) {
      return res.status(404).json({ success: false, message: "Summary not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Summary marked as completed. It will auto-delete in 2 days.",
      data: summary,
    });
  } catch (err) {
    console.error("❌ Error marking summary complete:", err.message);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

module.exports = router;
