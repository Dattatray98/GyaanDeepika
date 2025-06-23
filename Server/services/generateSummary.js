const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const bedrockClient = new BedrockRuntimeClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generateSummary(transcript) {
  const prompt = `Summarize the following transcript:\n\n${transcript}`;

  const command = new InvokeModelCommand({
    modelId: "amazon.nova-lite-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inferenceConfig: {
        max_new_tokens: 500,
      },
      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],
    }),
  });

  try {
    const response = await bedrockClient.send(command);
    const responseString = await response.body.transformToString();

    const parsed = JSON.parse(responseString);

    
    const summaryText = parsed.output?.message?.content?.[0]?.text?.trim() || null;

    if (!summaryText) {
      console.warn("⚠️ Bedrock returned empty or unexpected response:", parsed);
    } else {
      console.log("🧠 Generated summaryText:", summaryText);
    }

    return summaryText;
  } catch (error) {
    console.error("❌ Nova summary generation failed:", error);
    return null;
  }
}

module.exports = generateSummary;
