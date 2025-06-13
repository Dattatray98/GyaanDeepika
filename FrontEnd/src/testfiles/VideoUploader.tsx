import React, { useState } from "react";
import axios from "axios";

const VideoUploader: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
      setUploadedUrl(null); // reset previous upload
      setError(null); // reset error
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile); // must match backend: upload.single("video")

    try {
      setUploading(true);
      const response = await axios.post("http://localhost:8000/videos/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedUrl(response.data.url);
      setUploading(false);
    } catch (err: any) {
      setError("❌ Upload failed: " + (err.response?.data?.error || err.message));
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold">🎬 Upload Video to Cloudinary</h2>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full border p-2 rounded"
      />

      {videoFile && (
        <video controls className="w-full rounded mt-2 max-h-[300px]">
          <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
        </video>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-medium text-green-600">✅ Video uploaded successfully!</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View on Cloudinary
          </a>
        </div>
      )}

      {error && <p className="text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default VideoUploader;
