const express = require('express');
const router = express.Router();
const Note = require('../models/Notes.model');
const { verifyToken } = require('../middleware/auth.middleware'); // your auth middleware

// GET: Fetch note for a specific user/course/content
router.get('/:courseId/:contentId', verifyToken , async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ userId, courseId, contentId });

    if (!note) {
      return res.json({ note: '' }); // return empty if not found
    }

    return res.json({ note: note.UserNotes });
  } catch (err) {
    return res.status(500).json({ error: 'Server error while fetching notes.' });
  }
});

// POST: Save or update note
router.post('/:courseId/:contentId', verifyToken, async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;
    const { note } = req.body;

    let existingNote = await Note.findOne({ userId, courseId, contentId });

    if (existingNote) {
      existingNote.UserNotes = note;
      await existingNote.save();
    } else {
      existingNote = new Note({
        userId,
        courseId,
        contentId,
        UserNotes: note,
      });
      await existingNote.save();
    }

    return res.json({ message: 'Note saved successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error while saving note.' });
  }
});

module.exports = router;
