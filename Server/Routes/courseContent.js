// routes/courseContent.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');

// GET /:courseId/content - Get course content by ID
router.get('/:courseId/content', async (req, res) => {
  const { courseId } = req.params;

  try {
    // ✅ Validate course ID format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format'
      });
    }

    // ✅ Fetch course with instructor populated
    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar email');

    // ✅ Course not found
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found'
      });
    }

    // ✅ Return course content with quiz info
    const courseObj = course.toObject(); // convert Mongoose doc to plain object
    const contentWithQuizFlag = courseObj.content?.map(item => ({
      ...item,
      hasQuiz: Array.isArray(item.quizzes) && item.quizzes.length > 0
    })) || [];

    return res.status(200).json({
      success: true,
      data: {
        ...courseObj,
        content: contentWithQuizFlag
      }
    });

  } catch (err) {
    console.error('Error fetching course content:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while fetching course content'
    });
  }
});

module.exports = router;
