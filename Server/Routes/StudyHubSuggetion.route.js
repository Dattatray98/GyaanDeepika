const express = require('express');
const router = express.Router();
const StudyHubSuggetion = require("../models/StudyHubSuggetion.model")

// Submit a new suggestion
router.post('/', async (req, res) => {
  try {
    const { name, email, requestType, examType, subject, description, isAnonymous } = req.body;
    
    const newSuggestion = new Suggestion({
      name: isAnonymous ? 'Anonymous' : name,
      email,
      requestType,
      examType,
      subject,
      description,
      isAnonymous,
      createdAt: new Date()
    });

    const savedSuggestion = await newSuggestion.save();
    res.status(201).json(savedSuggestion);
  } catch (error) {
    console.error('Error saving suggestion:', error);
    res.status(500).json({ message: 'Error submitting suggestion' });
  }
});

// Get all suggestions (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
});

module.exports = router;