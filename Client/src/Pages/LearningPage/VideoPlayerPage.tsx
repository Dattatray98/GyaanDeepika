import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Users,
    Star,
    ChevronLeft,
    ChevronRight,
    Download,
    Share2,
    Bookmark,
    MessageSquare,
    ThumbsUp,
    MoreVertical,
    GraduationCap,
    Play,
    CheckCircle,
    Clock,
    FileText
} from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';

const VideoPlayerPage = () => {
    const { courseId, videoId } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [] = useState(false);
    const [notes, setNotes] = useState('');
    const [videoProgress, setVideoProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);





    // Set timeout to remove loading screen after 2.5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2500ms = 2.5 seconds

        return () => clearTimeout(timer); // cleanup on unmount
    }, []);

    // Loading Screen
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
                <motion.div
                    className="animate-pulse flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <FaGraduationCap className="text-orange-500 text-4xl mb-4" />
                    </motion.div>
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                    <motion.p
                        className="mt-4 text-gray-400"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Loading GyaanDeepika...
                    </motion.p>
                </motion.div>
            </div>
        );
    }


    // Sample data - in real app, this would come from API
    const courseData = {
        id: courseId,
        title: "Mathematics Basics",
        instructor: "Dr. Sarah Johnson",
        rating: 4.7,
        students: 1842,
        category: "Education",
        description: "Master the fundamentals of mathematics with practical examples and exercises."
    };

    const currentVideo = {
        id: videoId,
        title: "Introduction to Algebra",
        duration: "12:45",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Sample video URL
        description: "Learn the basics of algebraic expressions and equations in this comprehensive introduction.",
        completed: false
    };

    const courseVideos = [
        {
            id: "1",
            title: "Introduction to Algebra",
            duration: "12:45",
            completed: true,
            current: videoId === "1"
        },
        {
            id: "2",
            title: "Linear Equations",
            duration: "15:30",
            completed: false,
            current: videoId === "2"
        },
        {
            id: "3",
            title: "Quadratic Functions",
            duration: "18:20",
            completed: false,
            current: videoId === "3"
        },
        {
            id: "4",
            title: "Systems of Equations",
            duration: "14:15",
            completed: false,
            current: videoId === "4"
        }
    ];

    const relatedCourses = [
        {
            id: "2",
            title: "Advanced Mathematics",
            instructor: "Prof. John Smith",
            rating: 4.8,
            students: 892,
            thumbnail: "https://images.pexels.com/photos/6238025/pexels-photo-6238025.jpeg"
        },
        {
            id: "3",
            title: "Statistics Fundamentals",
            instructor: "Dr. Emily Davis",
            rating: 4.6,
            students: 1205,
            thumbnail: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpg"
        }
    ];

    const handleVideoProgress = (currentTime: number, duration: number) => {
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);
    };

    const handleVideoEnd = () => {
        // Mark video as completed and move to next video
        const currentIndex = courseVideos.findIndex(v => v.id === videoId);
        if (currentIndex < courseVideos.length - 1) {
            const nextVideo = courseVideos[currentIndex + 1];
            navigate(`/courses/${courseId}/video/${nextVideo.id}`);
        }
    };

    const navigateToVideo = (newVideoId: string) => {
        navigate(`/courses/${courseId}/video/${newVideoId}`);
    };

    const getCurrentVideoIndex = () => {
        return courseVideos.findIndex(v => v.id === videoId);
    };

    const canGoToPrevious = () => {
        return getCurrentVideoIndex() > 0;
    };

    const canGoToNext = () => {
        return getCurrentVideoIndex() < courseVideos.length - 1;
    };

    const goToPrevious = () => {
        const currentIndex = getCurrentVideoIndex();
        if (currentIndex > 0) {
            navigateToVideo(courseVideos[currentIndex - 1].id);
        }
    };

    const goToNext = () => {
        const currentIndex = getCurrentVideoIndex();
        if (currentIndex < courseVideos.length - 1) {
            navigateToVideo(courseVideos[currentIndex + 1].id);
        }
    };

    if (isMobile) {
        return (
            <div className="bg-gray-900 text-white min-h-screen">
                {/* Mobile Header */}
                <header className="bg-gray-800 p-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-orange-500"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-medium text-sm flex-1 mx-4 truncate">{currentVideo.title}</h1>
                    <button className="text-white hover:text-orange-500">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </header>

                {/* Video Player */}
                <div className="relative">
                    <VideoPlayer
                        videoUrl={currentVideo.videoUrl}
                        title={currentVideo.title}
                        onTimeUpdate={handleVideoProgress}
                        onVideoEnd={handleVideoEnd}
                    />
                </div>

                {/* Video Info */}
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{currentVideo.description}</p>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center space-x-1 ${isLiked ? 'text-orange-500' : 'text-gray-400'}`}
                            >
                                <ThumbsUp className="w-5 h-5" />
                                <span className="text-sm">124</span>
                            </button>
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`${isBookmarked ? 'text-orange-500' : 'text-gray-400'}`}
                            >
                                <Bookmark className="w-5 h-5" />
                            </button>
                            <button className="text-gray-400">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-400">{currentVideo.duration}</span>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={goToPrevious}
                            disabled={!canGoToPrevious()}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${canGoToPrevious()
                                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        <span className="text-sm text-gray-400">
                            {getCurrentVideoIndex() + 1} of {courseVideos.length}
                        </span>

                        <button
                            onClick={goToNext}
                            disabled={!canGoToNext()}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${canGoToNext()
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Course Videos List */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-4">Course Content</h3>
                        <div className="space-y-3">
                            {courseVideos.map((video, index) => (
                                <button
                                    key={video.id}
                                    onClick={() => navigateToVideo(video.id)}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${video.current ? 'bg-orange-500/20 border border-orange-500/30' : 'hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center mr-3">
                                        {video.completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : video.current ? (
                                            <Play className="w-5 h-5 text-orange-500" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${video.current ? 'text-orange-500' : 'text-white'}`}>
                                            {index + 1}. {video.title}
                                        </h4>
                                        <p className="text-sm text-gray-400">{video.duration}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Desktop Header */}
            <header className="bg-gray-800 p-6 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-orange-500 mr-4"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center">
                        <GraduationCap className="text-orange-500 text-2xl mr-3" />
                        <div>
                            <h1 className="font-bold text-lg">{courseData.title}</h1>
                            <p className="text-gray-400 text-sm">by {courseData.instructor}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{courseData.rating}</span>
                        <span>•</span>
                        <Users className="w-4 h-4" />
                        <span>{courseData.students}</span>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Video Player */}
                    <div className="mb-6">
                        <VideoPlayer
                            videoUrl={currentVideo.videoUrl}
                            title={currentVideo.title}
                            onTimeUpdate={handleVideoProgress}
                            onVideoEnd={handleVideoEnd}
                        />
                    </div>

                    {/* Video Info & Controls */}
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                                <p className="text-gray-400 mb-4">{currentVideo.description}</p>
                            </div>
                            <div className="flex items-center space-x-3 ml-6">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                        }`}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>124</span>
                                </button>
                                <button
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                        }`}
                                >
                                    <Bookmark className="w-5 h-5" />
                                </button>
                                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Your Progress</span>
                                <span>{Math.round(videoProgress)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${videoProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={goToPrevious}
                                disabled={!canGoToPrevious()}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${canGoToPrevious()
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Previous Lesson</span>
                            </button>

                            <span className="text-gray-400">
                                Lesson {getCurrentVideoIndex() + 1} of {courseVideos.length}
                            </span>

                            <button
                                onClick={goToNext}
                                disabled={!canGoToNext()}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${canGoToNext()
                                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <span>Next Lesson</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-gray-800 rounded-lg">
                        <div className="flex border-b border-gray-700">
                            {[
                                { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
                                { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
                                { id: 'discussion', label: 'Discussion', icon: <MessageSquare className="w-4 h-4" /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                                            ? 'text-orange-500 border-b-2 border-orange-500'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <div>
                                    <h3 className="font-bold text-lg mb-4">About this lesson</h3>
                                    <p className="text-gray-300 mb-6">{currentVideo.description}</p>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                                            <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">Duration</p>
                                            <p className="font-medium">{currentVideo.duration}</p>
                                        </div>
                                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                                            <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">Students</p>
                                            <p className="font-medium">{courseData.students}</p>
                                        </div>
                                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                                            <Star className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">Rating</p>
                                            <p className="font-medium">{courseData.rating}/5</p>
                                        </div>
                                    </div>

                                    <h4 className="font-bold mb-4">Related Courses</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {relatedCourses.map(course => (
                                            <div
                                                key={course.id}
                                                className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/courses/${course.id}`)}
                                            >
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <div className="p-4">
                                                    <h5 className="font-medium mb-1">{course.title}</h5>
                                                    <p className="text-sm text-gray-400 mb-2">by {course.instructor}</p>
                                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                                        <span className="flex items-center">
                                                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                                            {course.rating}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Users className="w-3 h-3 mr-1" />
                                                            {course.students}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div>
                                    <h3 className="font-bold text-lg mb-4">My Notes</h3>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Take notes while watching the video..."
                                        className="w-full h-64 bg-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors">
                                            Save Notes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'discussion' && (
                                <div>
                                    <h3 className="font-bold text-lg mb-4">Discussion</h3>
                                    <div className="space-y-4">
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 bg-orange-500 rounded-full mr-3"></div>
                                                <div>
                                                    <p className="font-medium">John Doe</p>
                                                    <p className="text-xs text-gray-400">2 hours ago</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-300">Great explanation of algebraic concepts! Really helped me understand the fundamentals.</p>
                                        </div>

                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                                                <div>
                                                    <p className="font-medium">Sarah Smith</p>
                                                    <p className="text-xs text-gray-400">5 hours ago</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-300">Could you provide more examples for quadratic equations? I'm still struggling with those.</p>
                                        </div>

                                        <div className="mt-6">
                                            <textarea
                                                placeholder="Join the discussion..."
                                                className="w-full h-24 bg-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
                                            />
                                            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors">
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="w-80 bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
                    <h3 className="font-bold text-lg mb-6">Course Content</h3>

                    <div className="space-y-3">
                        {courseVideos.map((video, index) => (
                            <button
                                key={video.id}
                                onClick={() => navigateToVideo(video.id)}
                                className={`w-full flex items-center p-4 rounded-lg text-left transition-colors ${video.current
                                        ? 'bg-orange-500/20 border border-orange-500/30'
                                        : 'hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center mr-4">
                                    {video.completed ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : video.current ? (
                                        <Play className="w-6 h-6 text-orange-500" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-medium mb-1 ${video.current ? 'text-orange-500' : 'text-white'}`}>
                                        {index + 1}. {video.title}
                                    </h4>
                                    <p className="text-sm text-gray-400">{video.duration}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-medium mb-2">Course Progress</h4>
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>1 of {courseVideos.length} completed</span>
                            <span>25%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full w-1/4"></div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default VideoPlayerPage;