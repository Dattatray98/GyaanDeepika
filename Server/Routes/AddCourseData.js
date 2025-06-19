const express = require("express");
const { verifyToken } = require("../middleware/auth.js");
const { AddCourseAnnouncement, AddCourseResourses } = require("../Controllers/Course.js");
const router = express.Router();


/**
 * @route   POST /api/courses/:courseId/announcements
 * @desc    Add an announcement to a course (instructor only)
 * @access  Private
 * @returns {Object} The created announcement
 */
router.post("/:courseId/announcements", verifyToken, AddCourseAnnouncement);


/**
 * @route   POST /api/courses/:courseId/resources
 * @desc    Add a resource to a course (instructor only)
 * @access  Private
 * @returns {Object} The created resource
 */
router.post("/:courseId/resources", verifyToken, AddCourseResourses);
