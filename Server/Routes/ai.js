const express = require('express');
const router = express.Router();

const { askAI, summarizeVideo } = require('../Controllers/aiController');

router.post('/ask', askAI);
router.post('/summarize/:videoId', summarizeVideo);

module.exports = router;
