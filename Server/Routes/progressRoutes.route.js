const express = require("express");
const router = express.Router();
const progressController = require("../Controllers/progressController.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Update course progress
router.put("/", verifyToken, progressController.UpdateUserCourseProgress);

// Get all progress data for user
router.get("/progress", verifyToken, progressController.GetUserCourseProgressData);

// Get detailed progress for a specific course
router.get("/progress/:courseId", verifyToken, progressController.GetCourseProgressDetails);

// Get progress for a specific video
router.get("/progress/:courseId/:contentId", verifyToken, progressController.GetVideoProgress);

module.exports = router; 