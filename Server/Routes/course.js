const express = require("express");
const mongoose = require("mongoose");
const { verifyToken } = require("../middleware/auth.js");
const User = require("../models/user.js");
const Course = require("../models/Course.js");

const router = express.Router();

/**
 * @route   GET /api/courses/unenrolled
 * @desc    Get all courses that the authenticated user hasn't enrolled in
 * @access  Private
 * @returns {Array} List of unenrolled courses
 */
router.get("/unenrolled", verifyToken, async (req, res) => {
  try {
    // Get user's enrolled courses to exclude them from results
    const user = await User.findById(req.user.id).select("enrolledCourses");
    const enrolledCourseIds = user?.enrolledCourses || [];

    // Find courses not in user's enrolled list with more details
    const unenrolledCourses = await Course.find({
      _id: { $nin: enrolledCourseIds }
    }).select("title description subtitle thumbnail instructor price rating level duration totalStudents");

    res.status(200).json({
      success: true,
      count: unenrolledCourses.length,
      data: unenrolledCourses
    });
  } catch (err) {
    console.error("Error fetching unenrolled courses:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching unenrolled courses" 
    });
  }
});

/**
 * @route   POST /api/courses/addCourse
 * @desc    Create a new course (for instructors/admins)
 * @access  Private
 * @returns {Object} The newly created course
 */
router.post("/addCourse", verifyToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      subtitle, 
      thumbnail, 
      price, 
      level, 
      language, 
      category,
      learningOutcomes,
      requirements,
      content
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        success: false,
        error: "Title and description are required fields" 
      });
    }

    // Get instructor details from user
    const instructor = await User.findById(req.user.id).select("firstName lastName avatar");
    if (!instructor) {
      return res.status(404).json({
        success: false,
        error: "Instructor not found"
      });
    }

    // Create new course document with enhanced structure
    const newCourse = new Course({
      title,
      description,
      subtitle: subtitle || "",
      thumbnail: thumbnail || "https://via.placeholder.com/300x200",
      instructor: {
        _id: req.user.id,
        name: `${instructor.firstName} ${instructor.lastName}`,
        avatar: instructor.avatar || "https://via.placeholder.com/150",
        bio: "",
        rating: 0,
        students: 0
      },
      price: price || 0,
      level: level || "beginner",
      language: language || "English",
      category: category || "",
      learningOutcomes: learningOutcomes || [],
      requirements: requirements || [],
      content: content || [],
      resources: [],
      announcements: []
    });

    // Save to database
    const savedCourse = await newCourse.save();
    
    res.status(201).json({
      success: true,
      data: savedCourse
    });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to create new course" 
    });
  }
});

/**
 * @route   POST /api/courses/enroll/:courseId
 * @desc    Enroll the authenticated user in a course
 * @access  Private
 * @returns {Object} Success message
 */
router.post("/enroll/:courseId", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: "Course not found" 
      });
    }

    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ 
        success: false,
        error: "User is already enrolled in this course" 
      });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Update course student count
    course.totalStudents += 1;
    await course.save();

    res.status(200).json({ 
      success: true, 
      message: "Successfully enrolled in course",
      courseId: courseId
    });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to enroll in course" 
    });
  }
});

/**
 * @route   GET /api/courses/enrolled
 * @desc    Get all courses the authenticated user is enrolled in
 * @access  Private
 * @returns {Array} List of enrolled courses with details
 */
router.get("/enrolled", verifyToken, async (req, res) => {
  try {
    // Get user with populated enrolled courses
    const user = await User.findById(req.user.id)
      .populate({
        path: "enrolledCourses",
        select: "title description subtitle thumbnail instructor price rating level duration totalStudents content",
        populate: {
          path: "instructor._id",
          select: "firstName lastName avatar email"
        }
      });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      count: user.enrolledCourses.length,
      data: user.enrolledCourses
    });
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching enrolled courses" 
    });
  }
});

/**
 * @route   GET /api/courses/:courseId/content
 * @desc    Get course content for an enrolled course
 * @access  Private
 * @returns {Object} Course content structure
 */
router.get("/:courseId/content", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled in the course
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        error: "You are not enrolled in this course"
      });
    }

    // Get course content
    const course = await Course.findById(courseId)
      .select("content title description instructor");

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    // Add progress information to each content item
    const userProgress = user.progress.get(courseId) || {};
    const completedVideos = userProgress.completedVideos || [];

    const contentWithProgress = course.content.map(section => {
      return {
        ...section.toObject(),
        content: section.content.map(item => {
          const videoProgress = completedVideos.find(v => v.videoId === item._id.toString());
          return {
            ...item.toObject(),
            completed: videoProgress?.isCompleted || false,
            watchedDuration: videoProgress?.watchedDuration || 0
          };
        })
      };
    });

    res.status(200).json({
      success: true,
      data: {
        courseTitle: course.title,
        courseDescription: course.description,
        instructor: course.instructor,
        content: contentWithProgress,
        overallProgress: userProgress.completionPercentage || 0
      }
    });
  } catch (err) {
    console.error("Error fetching course content:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching course content"
    });
  }
});

/**
 * @route   POST /api/courses/progress
 * @desc    Update user's progress in a course
 * @access  Private
 * @returns {Object} Updated progress data
 */
router.post("/progress", verifyToken, async (req, res) => {
  const { courseId, videoId, watchedDuration, isCompleted } = req.body;

  // Validate required fields
  if (!courseId || !videoId || typeof watchedDuration !== "number") {
    return res.status(400).json({ 
      success: false,
      error: "courseId, videoId and watchedDuration are required" 
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Check if user is enrolled in the course
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        error: "You are not enrolled in this course"
      });
    }

    // Initialize progress object if it doesn't exist
    let courseProgress = user.progress.get(courseId) || {
      completedVideos: [],
      lastAccessed: new Date(),
      currentVideoId: videoId,
      currentVideoProgress: watchedDuration,
      completionPercentage: 0
    };

    // Update progress data
    courseProgress.lastAccessed = new Date();
    courseProgress.currentVideoId = videoId;
    courseProgress.currentVideoProgress = watchedDuration;

    // Find or create video progress entry
    const existingVideo = courseProgress.completedVideos.find(v => v.videoId === videoId);
    if (existingVideo) {
      existingVideo.watchedDuration = watchedDuration;
      if (typeof isCompleted !== "undefined") {
        existingVideo.isCompleted = isCompleted;
      }
    } else {
      courseProgress.completedVideos.push({
        videoId,
        watchedDuration,
        isCompleted: !!isCompleted
      });
    }

    // Calculate completion percentage
    const completedCount = courseProgress.completedVideos.filter(v => v.isCompleted).length;
    const totalVideos = await Course.findById(courseId).select("content");
    const videoCount = totalVideos.content.reduce((total, section) => {
      return total + section.content.filter(item => item.type === 'video').length;
    }, 0);
    
    courseProgress.completionPercentage = videoCount > 0 
      ? Math.round((completedCount / videoCount) * 100)
      : 0;

    // Save updated progress
    user.progress.set(courseId, courseProgress);
    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Progress updated successfully",
      data: courseProgress
    });
  } catch (err) {
    console.error("Progress update failed:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error while updating progress" 
    });
  }
});

/**
 * @route   GET /api/courses/progress
 * @desc    Get all progress data for the authenticated user
 * @access  Private
 * @returns {Object} All course progress data for the user
 */
router.get("/progress", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "enrolledCourses",
        select: "title thumbnail instructor"
      });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Convert Map to object for response and add course details
    const progressData = {};
    if (user.progress instanceof Map) {
      for (const [courseId, progress] of user.progress.entries()) {
        const course = user.enrolledCourses.find(c => c._id.toString() === courseId);
        progressData[courseId] = {
          ...progress,
          courseTitle: course?.title || "Unknown Course",
          courseThumbnail: course?.thumbnail || "https://via.placeholder.com/300x200",
          instructorName: course?.instructor?.name || "Unknown Instructor"
        };
      }
    } else {
      for (const courseId in user.progress) {
        const course = user.enrolledCourses.find(c => c._id.toString() === courseId);
        progressData[courseId] = {
          ...user.progress[courseId],
          courseTitle: course?.title || "Unknown Course",
          courseThumbnail: course?.thumbnail || "https://via.placeholder.com/300x200",
          instructorName: course?.instructor?.name || "Unknown Instructor"
        };
      }
    }

    res.status(200).json({ 
      success: true,
      data: progressData
    });
  } catch (err) {
    console.error("Failed to fetch progress:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching progress" 
    });
  }
});

/**
 * @route   POST /api/courses/:courseId/announcements
 * @desc    Add an announcement to a course (instructor only)
 * @access  Private
 * @returns {Object} The created announcement
 */
router.post("/:courseId/announcements", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content, important } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required"
      });
    }

    // Check if course exists and user is the instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    if (course.instructor._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Only the course instructor can add announcements"
      });
    }

    // Create new announcement
    const newAnnouncement = {
      title,
      content,
      important: important || false
    };

    course.announcements.push(newAnnouncement);
    await course.save();

    res.status(201).json({
      success: true,
      data: newAnnouncement
    });
  } catch (err) {
    console.error("Error adding announcement:", err);
    res.status(500).json({
      success: false,
      error: "Server error while adding announcement"
    });
  }
});

/**
 * @route   GET /api/courses/:courseId/announcements
 * @desc    Get announcements for a course
 * @access  Private
 * @returns {Array} List of announcements
 */
router.get("/:courseId/announcements", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled in the course
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        error: "You are not enrolled in this course"
      });
    }

    // Get course announcements
    const course = await Course.findById(courseId)
      .select("announcements title instructor");

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseTitle: course.title,
        instructor: course.instructor,
        announcements: course.announcements
      }
    });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching announcements"
    });
  }
});

/**
 * @route   POST /api/courses/:courseId/resources
 * @desc    Add a resource to a course (instructor only)
 * @access  Private
 * @returns {Object} The created resource
 */
router.post("/:courseId/resources", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type, size, downloadUrl } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title || !type || !downloadUrl) {
      return res.status(400).json({
        success: false,
        error: "Title, type, and downloadUrl are required"
      });
    }

    // Check if course exists and user is the instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    if (course.instructor._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Only the course instructor can add resources"
      });
    }

    // Create new resource
    const newResource = {
      title,
      type,
      size: size || "0 MB",
      downloadUrl
    };

    course.resources.push(newResource);
    await course.save();

    res.status(201).json({
      success: true,
      data: newResource
    });
  } catch (err) {
    console.error("Error adding resource:", err);
    res.status(500).json({
      success: false,
      error: "Server error while adding resource"
    });
  }
});

/**
 * @route   GET /api/courses/:courseId/resources
 * @desc    Get resources for a course
 * @access  Private
 * @returns {Array} List of resources
 */
router.get("/:courseId/resources", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled in the course
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        error: "You are not enrolled in this course"
      });
    }

    // Get course resources
    const course = await Course.findById(courseId)
      .select("resources title instructor");

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseTitle: course.title,
        instructor: course.instructor,
        resources: course.resources
      }
    });
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching resources"
    });
  }
});

module.exports = router;