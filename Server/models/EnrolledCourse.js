const mongoose = require("mongoose");


const EnrolledCourseSchema = new mongoose.Schema({
    _EnrollId:{
        type: String,
        required: true
    },
    EnrollcourseImg:{
        type: String,
        required: true
    },
    Enrolltitle:{
        type: String,
        required: true
    },
    Enrolldescription:{
        type: String,
        required: true
    },
    Enrolllevel:{
        type: String,
        required: true
    },
    Enrollcategory:{
        type: String,
        required: true
    },
    Enrollrating:{
        type: Number,
        required: true
    },
    EnrolluploadDate:{
        type: String,
        required: true
    },
    EnrollpeopleEnrolled:{
        type: Number,
        required: true
    },
    Enrollduration:{
        type: Number,
        required: true
    }
})


const EnrolledCourses = mongoose.model("EnrolledCourses", EnrolledCourseSchema, "enrolledcourses")

module.exports = {EnrolledCourses};