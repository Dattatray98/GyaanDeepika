const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");
const axios = require("axios");
const generateSummary = require("./generateSummary");

const client = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


async function startTranscriptionJob(videoUrl, jobName, languageCode = null) {
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    Media: { MediaFileUri: videoUrl },
    MediaFormat: "mp4",
    ...(languageCode
      ? { LanguageCode: languageCode }
      : {
          IdentifyLanguage: true,
          LanguageOptions: "hi-IN,en-IN,mr-IN",
        }),
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


async function fetchTranscriptText(transcriptUrl) {
  try {
    const res = await axios.get(transcriptUrl);
    return res.data.results.transcripts[0].transcript || null;
  } catch (err) {
    console.error("❌ Failed to fetch transcript text:", err);
    return null;
  }
}


async function transcribeAndSummarize(videoUrl, courseLanguage = null) {
  const jobName = `transcribe-${Date.now()}`;
  const languageCode = getAWSLanguageCode(courseLanguage);

  await startTranscriptionJob(videoUrl, jobName, languageCode);

 
  let transcriptUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((res) => setTimeout(res, 5000));

    const { status, transcriptUrl: url } = await getTranscriptionStatus(jobName);

    if (status === "COMPLETED") {
      transcriptUrl = url;
      break;
    } else if (status === "FAILED") {
      throw new Error("Transcription failed");
    }
  }

  if (!transcriptUrl) throw new Error("Transcript URL not found");

  const transcriptText = await fetchTranscriptText(transcriptUrl);

  if (!transcriptText) throw new Error("Empty transcript");

  const summary = await generateSummary(
    `The following is a ${courseLanguage || "multi-language"} transcript. Translate it to English and summarize:\n\n${transcriptText}`
  );

  return {
    summary,
    transcriptText,
  };
}


function getAWSLanguageCode(lang) {
  switch ((lang || "").toLowerCase()) {
    case "hindi":
      return "hi-IN";
    case "marathi":
      return "mr-IN";
    case "english":
      return "en-IN";
    default:
      return null;
  }
}

module.exports = {
  startTranscriptionJob,
  getTranscriptionStatus,
  fetchTranscriptText,
  transcribeAndSummarize,
};
