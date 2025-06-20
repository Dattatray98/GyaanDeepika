const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1", // ✅ Your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generateSummaryFromTranscript(transcript) {
  const messages = [
    {
      role: "user",
      content: `Please summarize the following transcript:\n\n${transcript}`,
    },
  ];

  const input = {
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      messages: messages,
      max_tokens: 500,
      temperature: 0.5,
    }),
  };

  const command = new InvokeModelCommand(input);

  try {
    const response = await bedrockClient.send(command);

    const responseBody = await streamToString(response.body);
    const parsed = JSON.parse(responseBody);

    return parsed.content?.[0]?.text || null;
  } catch (error) {
    console.error("Claude summary generation failed:", error);
    return null;
  }
}

// Helper: convert stream to string
function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

module.exports = generateSummaryFromTranscript;
