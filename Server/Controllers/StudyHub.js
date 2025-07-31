const StudyHub = require("../models/StudyHub");

// 📥 GET all study materials
const GetStudyMatterial = async (req, res) => {
    try {
        const resources = await StudyHub.find();
        res.status(200).json(resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📤 Upload study material with Google Drive URL
const UploadStudymatterial = async (req, res) => {
    try {
        const { title, description, type, examType, subject, year, fileUrl } = req.body;

        if (!fileUrl) {
            return res.status(400).json({ message: "Google Drive file URL is required" });
        }

        const newMaterial = new StudyHub({
            title,
            description,
            type,
            examType,
            subject,
            year,
            fileUrl
        });

        const saved = await newMaterial.save();
        res.status(201).json({ message: "Uploaded successfully", data: saved });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed", error });
    }
};

// ❌ Delete only from database (Google Drive files must be deleted manually)
const DeleteStudyMaterial = async (req, res) => {
    try {
        const resource = await StudyHub.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await StudyHub.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Resource deleted from database ✅" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Server error ❌" });
    }
};

// 📥 Download route — Redirects to Google Drive direct download link
const DownloadStudyMaterial = async (req, res) => {
    try {
        const resource = await StudyHub.findById(req.params.id);
        if (!resource || !resource.fileUrl) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.setHeader("Content-Disposition", `attachment; filename="${resource.title || "material"}"`);
        res.redirect(resource.fileUrl); // Google Drive direct download URL
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Download failed", error });
    }
};

module.exports = {
    GetStudyMatterial,
    UploadStudymatterial,
    DeleteStudyMaterial,
    DownloadStudyMaterial
};
