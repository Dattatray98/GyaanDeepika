const { bedrockClient, rekognitionClient } = require("../config/awsConfig");
const { InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { DetectLabelsCommand } = require("@aws-sdk/client-rekognition");

// Text Generation with Amazon Bedrock (Claude)
exports.generateText = async (req, res) => {
  const { prompt } = req.body;

  const input = {
    modelId: "anthropic.claude-v2",
    body: JSON.stringify({ prompt, max_tokens_to_sample: 300 }),
  };

  try {
    const response = await bedrockClient.send(new InvokeModelCommand(input));
    const result = JSON.parse(Buffer.from(response.body).toString());
    res.json({ reply: result.completion });
  } catch (error) {
    res.status(500).json({ error: "AI request failed" });
  }
};

// Image Analysis with Amazon Rekognition
exports.analyzeImage = async (req, res) => {
  const { imageBase64 } = req.body;

  const input = {
    Image: { Bytes: Buffer.from(imageBase64, "base64") },
  };

  try {
    const response = await rekognitionClient.send(new DetectLabelsCommand(input));
    res.json({ labels: response.Labels });
  } catch (error) {
    res.status(500).json({ error: "Image analysis failed" });
  }
};