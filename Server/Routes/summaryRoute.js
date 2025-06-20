const express = require("express");
const router = express.Router();
const Summary = require("../models/Summary");
const Course = require("../models/Course");
const generateSummary = require("../services/generateSummary");

// Middleware to simulate logged-in user (Replace with actual auth middleware)
const mockUserMiddleware = (req, res, next) => {
  req.user = { id: "685151fce035ef445de572cb" }; // Replace with JWT middleware
  next();
};

router.use(mockUserMiddleware);

/**
 * @route POST /api/summary/generate/:courseId/:contentId
 * @desc Generate summary for a specific video content
 */
router.post("/generate/:courseId/:contentId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, contentId } = req.params;

    // Check if summary already exists
    const existing = await Summary.findOne({ userId, courseId, contentId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Summary already exists",
        data: existing,
      });
    }

    // Get the course and find the specific content item
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const contentItem = course.content.find(item => item._id.toString() === contentId);
    if (!contentItem)
      return res.status(404).json({ success: false, message: "Content not found in course" });

    if (!contentItem.Transcript)
      return res.status(404).json({ success: false, message: "Transcript not available" });

    // Generate summary from transcript
    const summaryText = await generateSummary(contentItem.Transcript);
    if (!summaryText)
      return res.status(500).json({ success: false, message: "Failed to generate summary" });

    // Save summary
    const summary = await Summary.create({ userId, courseId, contentId, summaryText });

    res.status(201).json({
      success: true,
      message: "Summary generated and saved successfully",
      data: summary,
    });
  } catch (err) {
    console.error("Summary generation error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @route GET /api/summary/:courseId/:contentId
 * @desc Fetch summary for a specific video content
 */
router.get("/:courseId/:contentId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, contentId } = req.params;

    const summary = await Summary.findOne({ userId, courseId, contentId });
    if (!summary) {
      return res.status(404).json({ success: false, message: "Summary not found" });
    }

    res.status(200).json({
      success: true,
      message: "Summary fetched successfully",
      data: summary,
    });
  } catch (err) {
    console.error("Fetch summary error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/**
 * @route PATCH /api/summary/complete/:courseId/:contentId
 * @desc Mark summary as completed (triggers TTL deletion after 2 days)
 */
router.patch("/complete/:courseId/:contentId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, contentId } = req.params;

    const summary = await Summary.findOneAndUpdate(
      { userId, courseId, contentId },
      { completed: true, completedAt: new Date() },
      { new: true }
    );

    if (!summary) {
      return res.status(404).json({ success: false, message: "Summary not found" });
    }

    res.status(200).json({
      success: true,
      message: "Summary marked as completed. It will auto-delete in 2 days.",
      data: summary,
    });
  } catch (err) {
    console.error("Error marking summary completed:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
