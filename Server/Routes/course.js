const express = require("express");
const mongoose = require("mongoose");
const { verifyToken } = require("../middleware/auth.js");
const User = require("../models/user.js");
const Course = require("../models/Course.js");

const router = express.Router();

// GET /api/courses/unenrolled - Get courses user hasn't enrolled in
router.get('/unenrolled', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('enrolledCourses');
    const enrolledCourseIds = user.enrolledCourses || [];
    
    const unenrolledCourses = await Course.find({
      _id: { $nin: enrolledCourseIds }
    }).select('title description thumbnail instructor price');

    res.json(unenrolledCourses);
  } catch (err) {
    console.error('Error fetching unenrolled courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/courses - Add new course
router.post('/addCourse', verifyToken, async (req, res) => {
  try {
    const { title, description, thumbnail, price } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        error: "Title and description are required" 
      });
    }

    const newCourse = new Course({
      title,
      description,
      thumbnail: thumbnail || "https://via.placeholder.com/300x200",
      instructor: req.user.id, // Now using user ID instead of name
      price: price || 0
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);

  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// POST /api/courses/enroll/:courseId - Enroll user in course
router.post('/enroll/:courseId', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 1. Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // 2. Check if already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // 3. Add to enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    res.json({ 
      success: true,
      message: "Successfully enrolled in course"
    });

  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Failed to enroll' });
  }
});


// Get all enrolled courses for logged-in user
router.get('/enrolled', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.enrolledCourses);
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST /api/courses/progress
router.post("/progress", auth, async (req, res) => {
  const { courseId, videoId, watchedDuration, isCompleted } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Get existing course progress or initialize
    let courseProgress = user.progress.get(courseId) || {
      completedVideos: [],
      lastAccessed: new Date(),
      currentVideoId: videoId,
      currentVideoProgress: watchedDuration,
      completionPercentage: 0
    };

    // Update current video info
    courseProgress.lastAccessed = new Date();
    courseProgress.currentVideoId = videoId;
    courseProgress.currentVideoProgress = watchedDuration;

    // Check if this video already exists in completedVideos
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

    // Optionally calculate completion percentage
    const completedCount = courseProgress.completedVideos.filter(v => v.isCompleted).length;
    const totalVideos = courseProgress.completedVideos.length;
    courseProgress.completionPercentage = totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0;

    // Set updated course progress
    user.progress.set(courseId, courseProgress);

    await user.save();

    res.status(200).json({ message: "Progress updated successfully", progress: courseProgress });
  } catch (err) {
    console.error("Progress update failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// GET /api/courses/progress
router.get("/progress", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    // Convert Map to object
    const progressData = {};
    if (user.progress instanceof Map) {
      for (const [courseId, progress] of user.progress.entries()) {
        progressData[courseId] = progress;
      }
    } else if (typeof user.progress === "object") {
      Object.assign(progressData, user.progress);
    }

    res.status(200).json({ progress: progressData });
  } catch (err) {
    console.error("Failed to fetch progress:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;