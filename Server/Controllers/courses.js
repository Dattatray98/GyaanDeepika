const { Courses } = require("../models/courses");

const { EnrolledCourses } = require("../models/EnrolledCourse")


async function GetCourseDetails(req, res) {
    try {
        const { category, search, sort = '-createdAt', limit = 10 } = req.query;

        const query = {};
        if (category) query.category = category;
        if (search) query.$text = { $search: search };

        const courses = await Courses.find(query)
            .sort(sort)
            .limit(Number(limit))
            .select('-__v -_id');

        const coursesWithFormattedData = courses.map(course => {
            const courseObj = course.toObject();
            return courseObj;
        });

        res.json({
            success: true,
            count: courses.length,
            data: coursesWithFormattedData
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

async function GetEnrolledCourses(req, res) {
    try {
        const { category, search, sort = '-createdAt', limit = 10 } = req.query;

        const query = {};
        if (category) query.category = category;
        if (search) query.$text = { $search: search };

        const enrolledCourses = await EnrolledCourses.find(query)
            .sort(sort)
            .limit(Number(limit))
            .select('-__v -_enrollId');

        const enrollcoursesWithFormattedData = enrolledCourses.map(course => {
            const courseObj = course.toObject(); // Changed from enrolledCourses to course
            return {
                id: courseObj._id, // Convert _id to id if needed
                ...courseObj,
                _id: undefined, // Remove _id if you don't want it in response
                __v: undefined // Remove version key
            };
        });

        res.json({
            success: true,
            count: enrolledCourses.length,
            data: enrollcoursesWithFormattedData
        });

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    GetCourseDetails,
    GetEnrolledCourses,
};
