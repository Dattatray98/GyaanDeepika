const { model } = require("mongoose");
const StudyHub = require("../models/StudyHub");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");



const GetStudyMatterial = async (req, res) => {
    try {
        const resources = await StudyHub.find();
        res.status(200).json(resources);
    }
    catch {
        res.status(500).json({ error: err.message });
    }
}

const UploadStudymatterial = async (req, res) => {
    try {
        const filePath = req.file?.path;


        if (!filePath) {
            return res.status(400).json({ message: 'File is required' });
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "StudyHub Material",
            resource_type: "auto",
        });

        fs.unlinkSync(filePath);

        const newMaterial = new StudyHub({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            examType: req.body.examType,
            subject: req.body.subject,
            year: req.body.year,
            fileUrl: result.secure_url,
        });

        const saved = await newMaterial.save();

        res.status(201).json({ message: 'Uploaded successfully', data: saved });


    }
    catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed', error });
    }
}


module.exports = {
    GetStudyMatterial,
    UploadStudymatterial
}