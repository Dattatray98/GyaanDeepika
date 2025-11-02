const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware.js");
const { UnEnrolledCourses, addCourse, UserEnrolment, AddCourseAnnouncement, AddCourseResourses, GetallCourses } = require("../Controllers/Course.controller.js");
const router = express.Router();

/**
 * @route   GET /api/courses/unenrolled
 * @desc    Get all courses that the authenticated user hasn't enrolled in
 * @access  Private
 * @returns {Array} List of unenrolled courses
 */
router.get("/unenrolled", verifyToken, UnEnrolledCourses);

/**
 * @route   POST /api/courses/addCourse
 * @desc    Create a new course (for instructors/admins)
 * @access  Private
 * @returns {Object} The newly created course
 */
router.post("/addCourse", verifyToken, addCourse);

/**
 * @route   POST /api/courses/enroll/:courseId
 * @desc    Enroll the authenticated user in a course
 * @access  Private
 * @returns {Object} Success message
 */
router.post("/enroll/:courseId", verifyToken, UserEnrolment);

router.get("/getallcourses", verifyToken, GetallCourses);




// GET /api/courses/search?query=html
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: "Query is required." });
  }

  try {
    const regex = new RegExp(query, "i");

    const courses = await Course.find({
      $or: [
        { title: regex },
        { category: regex },
        { "instructor.name": regex }, // comment this out if instructor is a ref
      ],
    }).populate("instructor"); // only if instructor is a reference

    res.json({ success: true, data: courses });
  } catch (err) {
    console.error("🔴 Server Error in /search route:", err); // LOG THE ERROR
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;