const { BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");
require("dotenv").config();

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1", // safer fallback
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

module.exports = bedrockClient;
