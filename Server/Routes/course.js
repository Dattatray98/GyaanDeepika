const express = require("express");
const { verifyToken } = require("../middleware/auth.js");
const { UnEnrolledCourses, addCourse, UserEnrolment, AddCourseAnnouncement, AddCourseResourses } = require("../Controllers/Course.js");
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






module.exports = router;