const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function summarizeResults(results, question) {
  const contextText = results.map((r, i) => `Result ${i + 1}:\n${r.snippet}`).join("\n\n");

  const prompt = `Based on the following web results, answer the question:\n\n${contextText}\n\nQuestion: ${question}`;

  const command = new InvokeModelCommand({
    modelId: "amazon.nova-lite-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inferenceConfig: {
        max_new_tokens: 400,
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
    const response = await client.send(command);
    const responseString = await response.body.transformToString();
    const parsed = JSON.parse(responseString);
    return parsed?.outputs?.[0]?.content?.[0]?.text || null;
  } catch (err) {
    console.error("❌ Summarize error:", err.message);
    return null;
  }
}

module.exports = summarizeResults;
