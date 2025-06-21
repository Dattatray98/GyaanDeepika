const askNova = require("../services/askNova");
const searchWeb = require("../services/searchWeb"); // ✅ Unified Bing + Google
const summarizeResults = require("../services/summarizeResults");
const Course = require("../models/Course");

exports.handleQuestion = async (req, res) => {
  const { courseId, contentId, question } = req.body;
  const userId = req.user?.id;

  try {
    // 1. Validation
    if (!question || !courseId || !contentId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // 2. Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 3. Find transcript in course content
    let transcript = null;
    for (const section of course.content) {
      for (const item of section.content) {
        if (item._id.toString() === contentId) {
          transcript = item.transcript || item.Transcript || null;
          break;
        }
      }
      if (transcript) break;
    }

    if (!transcript) {
      return res.status(404).json({ success: false, message: "Transcript not found" });
    }

    // 4. Ask Nova using transcript
    const localAnswer = await askNova(question, transcript);
    if (localAnswer && localAnswer.length > 50) {
      return res.status(200).json({ success: true, source: "transcript", answer: localAnswer });
    }

    // 5. Web fallback: search (Bing → Google)
    const searchResults = await searchWeb(question);
    if (!searchResults?.length) {
      return res.status(502).json({ success: false, message: "Web search failed" });
    }

    const webAnswer = await summarizeResults(searchResults, question);
    if (!webAnswer) {
      return res.status(502).json({ success: false, message: "Summarization failed" });
    }

    return res.status(200).json({ success: true, source: "web", answer: webAnswer });

  } catch (err) {
    console.error("❌ Q&A error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
