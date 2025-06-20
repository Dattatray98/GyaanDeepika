// services/generateSummary.js

const { InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const bedrockClient = require("../config/aws");

const generateSummaryFromTranscript = async (transcriptText) => {
  const input = {
    modelId: "anthropic.claude-3-sonnet-20240229",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `You are a helpful teaching assistant. Summarize this video transcript into simple, clear bullet points:\n\n${transcriptText}`,
        },
      ],
      max_tokens: 1000,
    }),
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    const rawBody = await response.body.transformToString();
    const parsed = JSON.parse(rawBody);

    const summary = parsed.content[0]?.text || null;

    return summary;
  } catch (error) {
    console.error("❌ Claude summary generation failed:", error);
    return null;
  }
};

module.exports = generateSummaryFromTranscript;
