// routes/courseContent.js
const express = require('express');
const router = express.Router();
const {verifyToken} = require("../middleware/auth")
const { GetSingleContentItem, GetEnrolledCourses, EnrolledCourseContent, GetUserCourseProgressData, UpdateUserCourseProgress, GetCourseAnnouncement, GetCourseResoures } = require("../Controllers/Course")

/**
 * @route   GET /api/courses/enrolled
 * @desc    Get all courses the authenticated user is enrolled in
 * @access  Private
 * @returns {Array} List of enrolled courses with details
 */
router.get("/enrolled", verifyToken, GetEnrolledCourses);



/**
 * @route   GET /api/courses/:courseId/content
 * @desc    Get course content for an enrolled course
 * @access  Private
 * @returns {Object} Course content structure
 */
router.get("/:courseId/content", verifyToken, EnrolledCourseContent);


router.get('/:courseId/content/:contentId', verifyToken, GetSingleContentItem);



/**
 * @route   GET /api/courses/:courseId/announcements
 * @desc    Get announcements for a course
 * @access  Private
 * @returns {Array} List of announcements
 */
router.get("/:courseId/announcements", verifyToken, GetCourseAnnouncement);



/**
 * @route   GET /api/courses/:courseId/resources
 * @desc    Get resources for a course
 * @access  Private
 * @returns {Array} List of resources
 */
router.get("/:courseId/resources", verifyToken, GetCourseResoures);


module.exports = router;
