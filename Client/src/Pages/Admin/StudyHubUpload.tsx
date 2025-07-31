import React, { useState } from "react";
import axios from "axios";

const StudyHubUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    examType: "",
    subject: "",
    year: "",
    fileUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const extractFileId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileId = extractFileId(formData.fileUrl);
    if (!fileId) {
      return alert("Invalid Google Drive URL. Make sure it's in the format: https://drive.google.com/file/d/FILE_ID/view");
    }

    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
      const api = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        `${api}/api/StudyHub/upload`,
        { ...formData, fileUrl: directDownloadUrl },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Upload successful!");
      console.log("Uploaded:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Upload Study Material
      </h2>

      <div className="space-y-4">
        {["title", "examType", "subject", "year"].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              placeholder={`Enter ${field}`}
              required
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter description"
            rows={4}
            required
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Material Type
          </label>
          <select
            id="type"
            name="type"
            required
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Type</option>
            <option value="notes">Notes</option>
            <option value="question-paper">Question Paper</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="fileUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Google Drive File URL
          </label>
          <input
            id="fileUrl"
            name="fileUrl"
            placeholder="Paste Google Drive shareable link"
            required
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Upload Material
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudyHubUpload;
