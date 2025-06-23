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

async function askNova(question, context) {
  const prompt = `You are a helpful educational assistant. Use the following video transcript to answer the user's question accurately.\n\nTranscript:\n${context}\n\nQuestion:\n${question}`;

  const command = new InvokeModelCommand({
    modelId: "amazon.nova-lite-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inferenceConfig: {
        max_new_tokens: 300,
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

    
    const answer =
      parsed?.outputs?.[0]?.content?.[0]?.text?.trim() ||
      parsed?.output?.message?.content?.[0]?.text?.trim() ||
      null;

    if (!answer) {
      console.warn("⚠️ Nova returned an empty or unexpected response:", parsed);
    }

    return answer;
  } catch (err) {
    console.error("❌ askNova Bedrock error:", err);
    return null;
  }
}

module.exports = askNova;
