const express = require("express");
const router = express.Router();

const { GetEnrolledCourses } = require("../Controllers/courses");

router.get("/", GetEnrolledCourses)




module.exports = router;