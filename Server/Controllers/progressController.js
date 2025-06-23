const User = require("../models/user");
const Course = require("../models/Course");

// Update user's progress for a specific video
async function UpdateUserCourseProgress(req, res) {
    const { courseId, contentId, watchedDuration, isCompleted } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!courseId || !contentId || typeof watchedDuration !== "number") {
        return res.status(400).json({
            success: false,
            error: "courseId, contentId and watchedDuration are required"
        });
    }

    try {
        // Get user and course in parallel
        const [user, course] = await Promise.all([
            User.findById(userId),
            Course.findById(courseId)
        ]);

        if (!user) return res.status(404).json({ success: false, error: "User not found" });
        if (!course) return res.status(404).json({ success: false, error: "Course not found" });

        // Check enrollment
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                error: "You are not enrolled in this course"
            });
        }

        // Initialize or get progress
        let courseProgress = user.progress.get(courseId) || {
            completedVideos: [],
            startedAt: new Date(),
            lastAccessed: new Date(),
            currentcontentId: contentId,
            currentVideoProgress: watchedDuration,
            completionPercentage: 0
        };

        // Update progress data
        courseProgress.lastAccessed = new Date();
        courseProgress.currentcontentId = contentId;
        courseProgress.currentVideoProgress = watchedDuration;

        // Find or create video progress
        let videoProgress = courseProgress.completedVideos.find(v => v.contentId === contentId);
        if (!videoProgress) {
            videoProgress = {
                contentId,
                watchedDuration: 0,
                isCompleted: false,
                firstAccessedAt: new Date(),
                lastWatchedAt: new Date()
            };
            courseProgress.completedVideos.push(videoProgress);
        }

        // Update video progress
        videoProgress.watchedDuration = watchedDuration;
        videoProgress.lastWatchedAt = new Date();
        if (typeof isCompleted !== "undefined") {
            videoProgress.isCompleted = isCompleted;
        }

        // Calculate overall completion
        const totalVideos = course.content.reduce((total, section) => 
            total + (section.content?.filter(item => item.type === 'video').length || 0), 0);
        
        const completedVideos = courseProgress.completedVideos.filter(v => v.isCompleted).length;
        courseProgress.completionPercentage = totalVideos > 0 
            ? Math.min(100, Math.round((completedVideos / totalVideos) * 100))
            : 0;

        // Save updates
        user.progress.set(courseId, courseProgress);
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                courseId,
                contentId,
                watchedDuration,
                isCompleted: videoProgress.isCompleted,
                completionPercentage: courseProgress.completionPercentage,
                lastAccessed: courseProgress.lastAccessed
            }
        });
    } catch (err) {
        console.error("Progress update failed:", err);
        res.status(500).json({
            success: false,
            error: "Server error while updating progress"
        });
    }
}

// Get all progress data for a user
async function GetUserCourseProgressData(req, res) {
    try {
        const userId = req.user.id;
        
        // Get user with enrolled courses and detailed progress
        const user = await User.findById(userId)
            .populate({
                path: "enrolledCourses",
                select: "title thumbnail instructor description totalStudents rating"
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Transform progress data
        const progressData = user.enrolledCourses.map(course => {
            const courseProgress = user.progress.get(course._id.toString()) || {};
            
            return {
                courseId: course._id,
                courseTitle: course.title,
                courseThumbnail: course.thumbnail,
                instructor: course.instructor,
                description: course.description,
                rating: course.rating,
                totalStudents: course.totalStudents,
                startedAt: courseProgress.startedAt,
                lastAccessed: courseProgress.lastAccessed,
                completionPercentage: courseProgress.completionPercentage || 0,
                currentContentId: courseProgress.currentcontentId,
                videosCompleted: courseProgress.completedVideos 
                    ? courseProgress.completedVideos.filter(v => v.isCompleted).length
                    : 0,
                totalVideos: course.content.reduce((total, section) => 
                    total + (section.content?.filter(item => item.type === 'video').length || 0), 0)
            };
        });

        res.status(200).json({
            success: true,
            data: progressData
        });
    } catch (err) {
        console.error("Failed to fetch progress:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching progress"
        });
    }
}

// Get detailed progress for a specific course
async function GetCourseProgressDetails(req, res) {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Check enrollment
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                error: "You are not enrolled in this course"
            });
        }

        // Get course and progress
        const [course, progress] = await Promise.all([
            Course.findById(courseId).select("content title"),
            user.progress.get(courseId)
        ]);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        // Structure response
        const response = {
            courseId: course._id,
            courseTitle: course.title,
            totalVideos: course.content.reduce((total, section) => 
                total + (section.content?.filter(item => item.type === 'video').length || 0), 0),
            videosCompleted: progress?.completedVideos?.filter(v => v.isCompleted).length || 0,
            completionPercentage: progress?.completionPercentage || 0,
            startedAt: progress?.startedAt,
            lastAccessed: progress?.lastAccessed,
            videoProgress: []
        };

        // Add progress for each video
        if (progress?.completedVideos) {
            course.content.forEach(section => {
                section.content.forEach(item => {
                    if (item.type === 'video') {
                        const videoProgress = progress.completedVideos.find(v => v.contentId === item._id.toString());
                        response.videoProgress.push({
                            contentId: item._id,
                            sectionId: section._id,
                            sectionTitle: section.title,
                            videoTitle: item.title,
                            duration: item.duration,
                            isCompleted: videoProgress?.isCompleted || false,
                            watchedDuration: videoProgress?.watchedDuration || 0,
                            lastWatchedAt: videoProgress?.lastWatchedAt,
                            firstAccessedAt: videoProgress?.firstAccessedAt
                        });
                    }
                });
            });
        }

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (err) {
        console.error("Error fetching course progress:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching course progress"
        });
    }
}

// Get progress for a specific video
async function GetVideoProgress(req, res) {
    try {
        const { courseId, contentId } = req.params;
        const userId = req.user.id;

        // Check enrollment
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                error: "You are not enrolled in this course"
            });
        }

        // Get progress
        const progress = user.progress.get(courseId);
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: "No progress data found for this course"
            });
        }

        // Find the specific video progress
        const videoProgress = progress.completedVideos.find(v => v.contentId === contentId);
        if (!videoProgress) {
            return res.status(404).json({
                success: false,
                error: "No progress data found for this video"
            });
        }

        res.status(200).json({
            success: true,
            data: videoProgress
        });
    } catch (err) {
        console.error("Error fetching video progress:", err);
        res.status(500).json({
            success: false,
            error: "Server error while fetching video progress"
        });
    }
}

module.exports = {
    UpdateUserCourseProgress,
    GetUserCourseProgressData,
    GetCourseProgressDetails,
    GetVideoProgress
};