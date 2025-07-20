const express = require("express");
const router = express.Router();
const {GetStudyMatterial} = require("../Controllers/StudyHub")

router.get("/StudyHub", GetStudyMatterial)

module.exports = router