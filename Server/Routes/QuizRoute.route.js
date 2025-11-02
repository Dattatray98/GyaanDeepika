const express = require("express");
const { getQuizByCourseAndContent, submitQuizAnswers } = require('../Controllers/Quiz.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:courseId/:contentId/quiz', verifyToken, getQuizByCourseAndContent);


router.post('/:courseId/:contentId/quiz/submit', verifyToken, submitQuizAnswers);


module.exports = router;
