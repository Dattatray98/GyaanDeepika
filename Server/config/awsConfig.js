const { BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");
const { RekognitionClient } = require("@aws-sdk/client-rekognition");

const awsConfig = {
  region: "us-east-1", // Change to your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const bedrockClient = new BedrockRuntimeClient(awsConfig);
const rekognitionClient = new RekognitionClient(awsConfig);

module.exports = { bedrockClient, rekognitionClient };