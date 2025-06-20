// services/transcribeService.js
const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");

const client = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function startTranscriptionJob(videoUrl, jobName) {
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    IdentifyLanguage: true,
    LanguageOptions: "hi-IN,en-IN,mr-IN",
    MediaFormat: "mp4", // or 'mp3' or whatever format you're using
    Media: { MediaFileUri: videoUrl },
    OutputBucketName: undefined, // We’ll get transcript from AWS-hosted URI
    Settings: {
      ShowSpeakerLabels: false,
    },
  });

  const response = await client.send(command);
  return response.TranscriptionJob;
}

async function getTranscriptionStatus(jobName) {
  const command = new GetTranscriptionJobCommand({
    TranscriptionJobName: jobName,
  });

  const response = await client.send(command);
  const job = response.TranscriptionJob;

  return {
    status: job.TranscriptionJobStatus,
    transcriptUrl: job.Transcript?.TranscriptFileUri || null,
  };
}

module.exports = {
  startTranscriptionJob,
  getTranscriptionStatus,
};