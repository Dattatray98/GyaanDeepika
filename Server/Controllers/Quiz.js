const User = require('../models/user');
const Course = require('../models/Course');

// GET quiz questions for a specific course and content
const getQuizByCourseAndContent = async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled
    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        error: "You are not enrolled in this course",
      });
    }

    // Find the course
    const course = await Course.findById(courseId).select("content");
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Locate the content item by contentId
    let targetContent = null;
    for (const section of course.content) {
      const found = section.content.find(item => item._id.toString() === contentId);
      if (found) {
        targetContent = found;
        break;
      }
    }

    if (!targetContent) {
      return res.status(404).json({
        success: false,
        error: "Content item not found",
      });
    }

    if (!targetContent.quizzes || targetContent.quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No quizzes found for this content item",
      });
    }

    const quizData = {
      courseId,
      contentId,
      title: targetContent.title,
      quizzes: targetContent.quizzes.map((quiz, index) => ({
        questionId: index + 1, // client-facing ID
        question: quiz.question,
        options: quiz.options,
      }))
    };

    return res.status(200).json({
      success: true,
      data: quizData
    });

  } catch (error) {
    console.error("Error fetching quiz:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching quiz"
    });
  }
};

// POST route for quiz submission
const submitQuizAnswers = async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;
    const { answers } = req.body; // [{ questionId: number, answer: string }]

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: "Invalid answers format"
      });
    }

    // Check enrollment
    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        error: "You are not enrolled in this course"
      });
    }

    const course = await Course.findById(courseId).select("content");
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found"
      });
    }

    let contentItem = null;
    for (const section of course.content) {
      const found = section.content.find(item => item._id.toString() === contentId);
      if (found) {
        contentItem = found;
        break;
      }
    }

    if (!contentItem) {
      return res.status(404).json({
        success: false,
        error: "Content item not found"
      });
    }

    if (!contentItem.quizzes || contentItem.quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No quizzes found for this content"
      });
    }

    let score = 0;
    const total = contentItem.quizzes.length;
    const results = [];

    for (let i = 0; i < contentItem.quizzes.length; i++) {
      const quiz = contentItem.quizzes[i];
      const submitted = answers.find(ans => ans.questionId === i + 1);

      if (submitted) {
        const isCorrect = submitted.answer === quiz.correctAnswer;
        if (isCorrect) score++;

        results.push({
          questionId: i + 1,
          question: quiz.question,
          yourAnswer: submitted.answer,
          correctAnswer: quiz.correctAnswer,
          isCorrect
        });
      }
    }

    return res.status(200).json({
      success: true,
      score,
      total,
      results
    });

  } catch (err) {
    console.error("Quiz submission error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while submitting quiz"
    });
  }
};

module.exports = {
  getQuizByCourseAndContent,
  submitQuizAnswers
};