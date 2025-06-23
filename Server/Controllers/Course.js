const User = require("../models/user")
const Course = require("../models/Course")



async function UnEnrolledCourses(req, res) {
    try {

        const user = await User.findById(req.user.id).select("enrolledCourses");
        const enrolledCourseIds = user?.enrolledCourses || [];


        const unenrolledCourses = await Course.find({
            _id: { $nin: enrolledCourseIds }
        }).select("title description subtitle thumbnail instructor price rating level duration totalStudents");

        res.status(200).json({
            success: true,
            count: unenrolledCourses.length,
            data: unenrolledCourses
        });
    } catch (err) {
        console.error("Error fetching unenrolled courses:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching unenrolled courses"
        });
    }
};


async function addCourse(req, res) {
    try {
        const {
            title,
            description,
            subtitle,
            thumbnail,
            price,
            level,
            language,
            category,
            learningOutcomes,
            requirements,
            content
        } = req.body;


        if (!title || !description) {
            return res.status(400).json({
                success: false,
                error: "Title and description are required fields"
            });
        }


        const instructor = await User.findById(req.user.id).select("firstName lastName avatar");
        if (!instructor) {
            return res.status(404).json({
                success: false,
                error: "Instructor not found"
            });
        }


        const newCourse = new Course({
            title,
            description,
            subtitle: subtitle || "",
            thumbnail: thumbnail || "https://via.placeholder.com/300x200",
            instructor: {
                _id: req.user.id,
                name: `${instructor.firstName} ${instructor.lastName}`,
                avatar: instructor.avatar || "https://via.placeholder.com/150",
                bio: "",
                rating: 0,
                students: 0
            },
            price: price || 0,
            level: level || "beginner",
            language: language || "English",
            category: category || "",
            learningOutcomes: learningOutcomes || [],
            requirements: requirements || [],
            content: content || [],
            resources: [],
            announcements: []
        });


        const savedCourse = await newCourse.save();

        res.status(201).json({
            success: true,
            data: savedCourse
        });
    } catch (err) {
        console.error("Error adding course:", err);
        res.status(500).json({
            success: false,
            error: "Failed to create new course"
        });
    }
};



const UserEnrolment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized: User ID not found"
            });
        }

        const [course, user] = await Promise.all([
            Course.findById(courseId),
            User.findById(userId)
        ]);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const alreadyEnrolled = user.enrolledCourses.some(
            (id) => id.toString() === courseId
        );

        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                error: "User is already enrolled in this course"
            });
        }

        // Enroll the user
        user.enrolledCourses.push(courseId);
        course.totalStudents += 1;

        // Save both documents
        await Promise.all([user.save(), course.save()]);

        return res.status(200).json({
            success: true,
            message: "Successfully enrolled in course",
            courseId
        });

    } catch (err) {
        console.error("Enrollment error:", err);
        return res.status(500).json({
            success: false,
            error: "Failed to enroll in course"
        });
    }
};




async function GetEnrolledCourses(req, res) {
    try {
        // Get user with populated enrolled courses
        const user = await User.findById(req.user.id)
            .populate({
                path: "enrolledCourses",
                select: "title description subtitle thumbnail instructor price rating level duration totalStudents content",
                populate: {
                    path: "instructor._id",
                    select: "firstName lastName avatar email"
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            count: user.enrolledCourses.length,
            data: user.enrolledCourses
        });
    } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching enrolled courses"
        });
    }
};

async function EnrolledCourseContent(req, res) {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Check if user is enrolled in the course
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                error: "You are not enrolled in this course"
            });
        }

        // Get course content
        const course = await Course.findById(courseId)
            .select("content title description instructor");

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        // Add progress information to each content item
        const userProgress = user.progress.get(courseId) || {};
        const completedVideos = userProgress.completedVideos || [];

        const contentWithProgress = course.content.map(section => {
            return {
                ...section.toObject(),
                content: section.content.map(item => {
                    const videoProgress = completedVideos.find(v => v.videoId === item._id.toString());
                    return {
                        ...item.toObject(),
                        completed: videoProgress?.isCompleted || false,
                        watchedDuration: videoProgress?.watchedDuration || 0
                    };
                })
            };
        });

        res.status(200).json({
            success: true,
            data: {
                courseTitle: course.title,
                courseDescription: course.description,
                instructor: course.instructor,
                content: contentWithProgress,
                overallProgress: userProgress.completionPercentage || 0
            }
        });
    } catch (err) {
        console.error("Error fetching course content:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching course content"
        });
    }
};


// single content itmes 

async function GetSingleContentItem(req, res) {
    try {
        const { courseId, contentId } = req.params;
        const userId = req.user.id;

        // Check if user is enrolled
        const user = await User.findById(userId);
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                error: "You are not enrolled in this course",
            });
        }

        // Find course and populate instructor
        const course = await Course.findById(courseId)
            .select("_id title description instructor rating category content totalStudents")
            .populate("instructor", "name avatar bio students rating _id");

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found",
            });
        }

        let contentItem = null;

        for (const section of course.content) {
            const found = section.content.find(
                (item) => item._id.toString() === contentId
            );
            if (found) {
                contentItem = found;
                break;
            }
        }

        if (!contentItem) {
            return res.status(404).json({
                success: false,
                error: "Content item not found",
            });
        }

        // Structure flat list of content
        const flatContentList = course.content.flatMap((section) =>
            section.content.map((item) => ({
                _id: item._id,
                title: item.title,
                description: item.description || "", // Safe fallback
                videoUrl: item.videoUrl,
                duration: item.duration,
                isCompleted: false,
                contentType: item.type,
                content: item.content,
                resources: item.resources || [],
                quizzes: item.quizzes || [],
                PdfDownloadUrl: item.PdfDownloadUrl,
                PdfViewUrl: item.PdfViewUrl,
            }))
        );

        const responseCourse = {
            _id: course._id,
            title: course.title,
            instructor: {
                _id: course.instructor._id,
                name: course.instructor.name,
                avatar: course.instructor.avatar,
                bio: course.instructor.bio,
                rating: course.instructor.rating,
                students: course.instructor.students,
            },
            rating: course.rating || 0,
            students: course.totalStudents || 0,
            category: course.category || "Uncategorized",
            description: course.description,
            contents: flatContentList,
        };

        const responseContent = flatContentList.find(
            (item) => item._id.toString() === contentId
        );

        res.status(200).json({
            success: true,
            course: responseCourse,
            content: responseContent,
        });
    } catch (err) {
        console.error("Error fetching content item:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching content item",
        });
    }
}


async function AddCourseAnnouncement(req, res) {
    try {
        const { courseId } = req.params;
        const { title, content, important } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: "Title and content are required"
            });
        }

        // Check if course exists and user is the instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        if (course.instructor._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Only the course instructor can add announcements"
            });
        }

        // Create new announcement
        const newAnnouncement = {
            title,
            content,
            important: important || false
        };

        course.announcements.push(newAnnouncement);
        await course.save();

        res.status(201).json({
            success: true,
            data: newAnnouncement
        });
    } catch (err) {
        console.error("Error adding announcement:", err);
        res.status(500).json({
            success: false,
            error: "Server error while adding announcement"
        });
    }
};


async function GetCourseAnnouncement(req, res) {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Check if user is enrolled in the course
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                error: "You are not enrolled in this course"
            });
        }

        // Get course announcements
        const course = await Course.findById(courseId)
            .select("announcements title instructor");

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                courseTitle: course.title,
                instructor: course.instructor,
                announcements: course.announcements
            }
        });
    } catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching announcements"
        });
    }
};


async function AddCourseResourses(req, res) {
    try {
        const { courseId } = req.params;
        const { title, type, size, downloadUrl } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!title || !type || !downloadUrl) {
            return res.status(400).json({
                success: false,
                error: "Title, type, and downloadUrl are required"
            });
        }

        // Check if course exists and user is the instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        if (course.instructor._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Only the course instructor can add resources"
            });
        }

        // Create new resource
        const newResource = {
            title,
            type,
            size: size || "0 MB",
            downloadUrl
        };

        course.resources.push(newResource);
        await course.save();

        res.status(201).json({
            success: true,
            data: newResource
        });
    } catch (err) {
        console.error("Error adding resource:", err);
        res.status(500).json({
            success: false,
            error: "Server error while adding resource"
        });
    }
};

async function GetCourseResoures(req, res) {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Check if user is enrolled in the course
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                error: "You are not enrolled in this course"
            });
        }

        // Get course resources
        const course = await Course.findById(courseId)
            .select("resources title instructor");

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                courseTitle: course.title,
                instructor: course.instructor,
                resources: course.resources
            }
        });
    } catch (err) {
        console.error("Error fetching resources:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching resources"
        });
    }
};

module.exports = {
    UnEnrolledCourses,
    addCourse,
    UserEnrolment,
    GetEnrolledCourses,
    EnrolledCourseContent,
    AddCourseAnnouncement,
    GetCourseAnnouncement,
    AddCourseResourses,
    GetCourseResoures,
    GetSingleContentItem
}

