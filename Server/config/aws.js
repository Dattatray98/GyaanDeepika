// config/aws.js
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});



const { BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");

// Create Bedrock client (Claude 3 Sonnet is only in us-east-1)
const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1", // Required for Claude models
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


module.exports = { s3Client, bedrockClient };
