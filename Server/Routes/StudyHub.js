const express = require("express");
const router = express.Router();
const uploaddata = require("../middleware/multer")
const {GetStudyMatterial, UploadStudymatterial} = require("../Controllers/StudyHub")

router.get("/StudyHub", GetStudyMatterial)
router.post('/StudyHub/upload', uploaddata.single('file'), UploadStudymatterial);

module.exports = router