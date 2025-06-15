const express = require("express");
const router = express.Router();

const {GetCourseDetails, GetEnrolledCourses} = require("../Controllers/courses");

router.get("/", GetCourseDetails)




module.exports = router;