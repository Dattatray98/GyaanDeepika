const { InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const bedrockClient = require("../lib/bedrockClient");
const Video = require("../models/video");

exports.summarizeVideo = async (req, res) => {
  const videoId = req.params.videoId;
  const video = await Video.findById(videoId);
  if (!video || !video.transcript) return res.status(404).json({ error: "Transcript not found" });

  const prompt = `Summarize this video transcript for students:\n\n${video.transcript}`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    }),
  });

  try {
    const response = await bedrockClient.send(command);
    const result = await response.body.transformToString();
    const summary = JSON.parse(result).content;

    video.summary = summary;
    await video.save();

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Summarization failed" });
  }
};

exports.askAI = async (req, res) => {
  const { videoId, question } = req.body;
  const video = await Video.findById(videoId);
  if (!video || !video.transcript) return res.status(404).json({ error: "Transcript not found" });

  const prompt = `Video transcript:\n${video.transcript}\n\nStudent asked: "${question}"\nAnswer clearly using only the transcript.`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    }),
  });

  try {
    const response = await bedrockClient.send(command);
    const result = await response.body.transformToString();
    const answer = JSON.parse(result).content;

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get answer" });
  }
};
