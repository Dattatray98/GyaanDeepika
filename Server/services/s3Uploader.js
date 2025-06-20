// services/s3Uploader.js
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/aws');

async function uploadToS3(fileBuffer, fileName, mimeType) {
  const key = `${Date.now()}-${fileName}`;

  const uploadParams = {
    Bucket: 'gyandipika-videos',
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read', // Optional: public access
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    const s3Url = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return { Location: s3Url };
  } catch (err) {
    throw new Error(`S3 upload failed: ${err.message}`);
  }
}

module.exports = { uploadToS3 };
