import express from "express";
import cors from "cors";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const app = express();
app.use(cors());
app.use(express.json());

const client = new BedrockRuntimeClient({
  region: "us-east-1", // your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  const command = new InvokeModelCommand({
    modelId: "amazon.titan-text-lite-v1",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: prompt,
    }),
  });

  try {
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    res.json(responseBody);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
