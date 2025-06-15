const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    courseImg:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    level:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    uploadDate:{
        type: String,
        required: true
    },
    peopleEnrolled:{
        type: Number,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    isPublic:{
        type: Boolean,
        required: true,
    },

})


const Courses = mongoose.model("Courses", CourseSchema, "courses");

module.exports = {
    Courses,
};