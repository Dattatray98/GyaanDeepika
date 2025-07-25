import React, { useState } from "react";
import axios from "axios";

const StudyHubUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    examType: "",
    subject: "",
    year: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const api = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${api}/api/StudyHub/upload`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload successful!");
      console.log(res.data);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Upload Study Material</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
            name="title"
            placeholder="Enter title"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            name="description"
            rows={4}
            placeholder="Enter description"
            required
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Material Type</label>
          <select
            id="type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            name="type"
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="notes">Notes</option>
            <option value="question-paper">Question Paper</option>
          </select>
        </div>

        <div>
          <label htmlFor="examType" className="block text-sm font-medium text-gray-700">Exam Type</label>
          <input
            id="examType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
            name="examType"
            placeholder="e.g. Midterm, Final"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            id="subject"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
            name="subject"
            placeholder="Enter subject"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
          <input
            id="year"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
            name="year"
            placeholder="e.g. 2023"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">File</label>
          <div className="mt-1 flex items-center">
            <input
              id="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Upload Material
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudyHubUpload;
