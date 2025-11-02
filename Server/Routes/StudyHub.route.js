const express = require("express");
const router = express.Router();
const uploaddata = require("../middleware/multer.middleware")
const {GetStudyMatterial, UploadStudymatterial, DeleteStudyMaterial, DownloadStudyMaterial} = require("../Controllers/StudyHub.controller")

router.get("/StudyHub", GetStudyMatterial)
router.post('/StudyHub/upload', uploaddata.single('file'), UploadStudymatterial);
router.delete('/StudyHub/:id', DeleteStudyMaterial)
router.get('/download/:id', DownloadStudyMaterial);
module.exports = router