import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineSummarize } from "react-icons/md";
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
import VideoPlayer from '../../components/VideoPlayer.tsx';
import { FaBrain } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.tsx';
import Loading from '../../components/Common/Loading.tsx';

interface CourseContent {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    isCompleted: boolean;
    contentType: string;
    content?: string;
}

interface CourseData {
    _id: string;
    title: string;
    instructor: string;
    rating: number;
    students: number;
    category: string;
    description: string;
    contents: CourseContent[];
}

interface ApiResponse {
    course: CourseData;
    content: CourseContent;
}

interface SummaryResponse {
    data: {
        summaryText: string;
    };
}

const VideoPlayerPage = () => {
    const { courseId, contentId } = useParams<{
        courseId: string;
        contentId: string;
    }>();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [notes, setNotes] = useState('');
    const [videoProgress, setVideoProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [currentContent, setCurrentContent] = useState<CourseContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const [summaryText, setSummaryText] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState('');
    const [userQuestion, setUserQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
    const [qaError, setQaError] = useState('');
    const [qaLoading, setQaLoading] = useState(false);


    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!courseId || !contentId) {
                    throw new Error('Course ID or Content ID is missing');

                }

                console.log("courseId = ", courseId, "contentId = ", contentId)

                const response = await axios.get<ApiResponse>(
                    `http://localhost:8000/api/enrolled/${courseId}/content/${contentId}`,
                    {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined
                    }
                );

                setCourseData(response.data.course);
                setCurrentContent(response.data.content);
            } catch (err) {
                const errorMessage = axios.isAxiosError(err)
                    ? err.response?.data?.message || err.message
                    : err instanceof Error
                        ? err.message
                        : 'An unknown error occurred';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseContent();
    }, [courseId, contentId, token]);



    const handleGenerateSummary = async () => {
        setSummaryLoading(true);
        setSummaryError('');

        try {
            const response = await axios.post<SummaryResponse>(
                `http://localhost:8000/api/summary/generate/${courseId}/${contentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSummaryText(response.data.data.summaryText);
        } catch (error) {
            console.error(error);
            setSummaryError("Failed to generate summary.");
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleAskQuestion = async () => {
        if (!userQuestion.trim()) {
            setQaError("Please enter a question");
            return;
        }

        // Push user's question to chat
        setChatHistory((prev) => [...prev, { sender: 'user', text: userQuestion }]);
        setQaLoading(true);
        setQaError('');
        setUserQuestion('');

        try {
            const response = await axios.post('http://localhost:8000/api/qa/ask', {
                question: userQuestion,
                courseId,     // 🔄 must be passed from props or context
                contentId,    // 🔄 must be passed from props or context
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${yourAuthToken}`,
                },
            });

            const answer = response.data?.answer;
            if (answer) {
                setChatHistory((prev) => [...prev, { sender: 'ai', text: answer }]);
            } else {
                setQaError("Unexpected response format from server.");
            }
        } catch (error: unknown) {
            let errorMessage = "Something went wrong.";
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                } else if (error.request) {
                    errorMessage = "No response from server. Please check your connection.";
                }
            }
            setQaError(errorMessage);
        } finally {
            setQaLoading(false);
        }
    };





    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleVideoProgress = (currentTime: number, duration: number) => {
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);
    };

    const handleVideoEnd = () => {
        if (!courseData || !contentId) return;

        const currentIndex = courseData.contents.findIndex(c => c._id === contentId);
        if (currentIndex < courseData.contents.length - 1) {
            const nextContent = courseData.contents[currentIndex + 1];
            navigate(`/courses/${courseId}/content/${nextContent._id}`);
        }
    };

    const navigateToContent = (contentId: string) => {
        navigate(`/courses/${courseId}/content/${contentId}`);
    };

    const getCurrentContentIndex = () => {
        if (!courseData || !contentId) return -1;
        return courseData.contents.findIndex(c => c._id === contentId);
    };

    const canGoToPrevious = () => {
        return getCurrentContentIndex() > 0;
    };

    const canGoToNext = () => {
        if (!courseData) return false;
        return getCurrentContentIndex() < courseData.contents.length - 1;
    };

    const goToPrevious = () => {
        const currentIndex = getCurrentContentIndex();
        if (currentIndex > 0 && courseData) {
            navigateToContent(courseData.contents[currentIndex - 1]._id);
        }
    };

    const goToNext = () => {
        const currentIndex = getCurrentContentIndex();
        if (currentIndex < (courseData?.contents.length || 0) - 1 && courseData) {
            navigateToContent(courseData.contents[currentIndex + 1]._id);
        }
    };


    if (loading) {
        return (<Loading />);
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F0F0F] text-white">
                <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-orange-500">Error</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!courseData || !currentContent) {
        return null;
    }

    const completedContents = courseData.contents.filter(c => c.isCompleted).length;
    const completionPercentage = Math.round((completedContents / courseData.contents.length) * 100);

    if (isMobile) {
        return (
            <div className="bg-gray-900 text-white min-h-screen">
                <header className="bg-gray-800 p-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-orange-500"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-medium text-sm flex-1 mx-4 truncate">{currentContent.title}</h1>
                    <button className="text-white hover:text-orange-500">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </header>

                <div className="relative">
                    <VideoPlayer
                        videoUrl={currentContent.videoUrl}
                        title={currentContent.title}
                        onTimeUpdate={handleVideoProgress}
                        onVideoEnd={handleVideoEnd}
                    />
                </div>

                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{currentContent.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{currentContent.description}</p>

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
                        <span className="text-sm text-gray-400">{formatDuration(currentContent.duration)}</span>
                    </div>

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
                            {getCurrentContentIndex() + 1} of {courseData.contents.length}
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

                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-4">Course Content</h3>
                        <div className="space-y-3">
                            {courseData.contents.map((content, index) => (
                                <button
                                    key={content._id}
                                    onClick={() => navigateToContent(content._id)}
                                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${content._id === contentId ? 'bg-orange-500/20 border border-orange-500/30' : 'hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center mr-3">
                                        {content.isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : content._id === contentId ? (
                                            <Play className="w-5 h-5 text-orange-500" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${content._id === contentId ? 'text-orange-500' : 'text-white'}`}>
                                            {index + 1}. {content.title}
                                        </h4>
                                        <p className="text-sm text-gray-400">{formatDuration(content.duration)}</p>
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
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <VideoPlayer
                            videoUrl={currentContent.videoUrl}
                            title={currentContent.title}
                            onTimeUpdate={handleVideoProgress}
                            onVideoEnd={handleVideoEnd}
                        />
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">{currentContent.title}</h2>
                                <p className="text-gray-400 mb-4">{currentContent.description}</p>
                            </div>
                            <div className="flex items-center space-x-3 ml-6">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                        }`}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Mark as Completed</span>
                                </button>
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
                                Lesson {getCurrentContentIndex() + 1} of {courseData.contents.length}
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

                    <div className="bg-gray-800 rounded-lg min-h-[40vh]">
                        <div className="flex border-b border-gray-700">
                            {[
                                { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
                                { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
                                { id: 'discussion', label: 'Discussion', icon: <MessageSquare className="w-4 h-4" /> },
                                { id: 'Video Summary', label: 'Video Summary', icon: <MdOutlineSummarize className='w-4 h-4' /> },
                                { id: 'Ask Question', label: 'Ask Question', icon: <FaBrain className='w-4 h-4' /> }
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
                                    <p className="text-gray-300 mb-6">{currentContent.description}</p>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                                            <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">Duration</p>
                                            <p className="font-medium">{formatDuration(currentContent.duration)}</p>
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

                                    {currentContent.content && (
                                        <div className="prose prose-invert max-w-none">
                                            <h4 className="font-bold mb-4">Lesson Content</h4>
                                            <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
                                        </div>
                                    )}
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
                                            <p className="text-gray-300">Great explanation of concepts! Really helped me understand the material better.</p>
                                        </div>

                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                                                <div>
                                                    <p className="font-medium">Sarah Smith</p>
                                                    <p className="text-xs text-gray-400">5 hours ago</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-300">Could you provide more examples? I'm still struggling with some parts.</p>
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

                            {activeTab === 'Video Summary' && (
                                <div className="p-4 bg-zinc-900 text-white rounded-lg shadow-md w-full">
                                    <h3 className="font-bold text-lg mb-4">Video Summary</h3>

                                    <button
                                        onClick={handleGenerateSummary}
                                        disabled={summaryLoading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50"
                                    >
                                        {summaryLoading ? "Generating..." : "Generate Summary"}
                                    </button>

                                    {summaryError && (
                                        <p className="text-red-400 mt-2">{summaryError}</p>
                                    )}

                                    {summaryText && (
                                        <div className="mt-4 border-t pt-3">
                                            <h4 className="text-white font-semibold mb-2">AI Summary:</h4>
                                            <p className="whitespace-pre-line text-gray-100">{summaryText}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'Ask Question' && (
                                <div className="flex flex-col gap-4 p-4 bg-zinc-900 text-white rounded-lg shadow-md max-h-[70vh] overflow-y-auto w-full">

                                    <h3 className="font-bold text-xl mb-2">💬 Ask AI About This Video</h3>

                                    {/* Chat Messages */}
                                    <div className="flex flex-col gap-4 overflow-y-auto ">
                                        {chatHistory.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-4 rounded-xl whitespace-pre-wrap break-words shadow-md ${msg.sender === 'user'
                                                            ? 'bg-blue-600 text-white rounded-br-none'
                                                            : 'bg-zinc-800 text-gray-100 border border-zinc-700 rounded-bl-none'
                                                        }`}
                                                >
                                                    <div className="text-xs font-semibold mb-1 text-gray-400">
                                                        {msg.sender === 'user' ? 'You' : 'AI'}
                                                    </div>
                                                    <div className="text-sm leading-relaxed">{msg.text}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Input Box */}
                                    <div className="mt-auto flex flex-col gap-2">
                                        <textarea
                                            placeholder="Ask your question about the video..."
                                            className="w-full p-3 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:border-blue-500 focus:outline-none resize-none"
                                            rows={2}
                                            value={userQuestion}
                                            onChange={(e) => setUserQuestion(e.target.value)}
                                        />

                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={handleAskQuestion}
                                                disabled={qaLoading || !userQuestion.trim()}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50"
                                            >
                                                {qaLoading ? "Thinking..." : "Send"}
                                            </button>
                                            {qaError && <p className="text-red-400 text-sm">{qaError}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </main>

                <aside className="w-80 bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
                    <h3 className="font-bold text-lg mb-6">Course Content</h3>

                    <div className="space-y-3">
                        {courseData.contents.map((content, index) => (
                            <button
                                key={content._id}
                                onClick={() => navigateToContent(content._id)}
                                className={`w-full flex items-center p-4 rounded-lg text-left transition-colors ${content._id === contentId
                                    ? 'bg-orange-500/20 border border-orange-500/30'
                                    : 'hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center mr-4">
                                    {content.isCompleted ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : content._id === contentId ? (
                                        <Play className="w-6 h-6 text-orange-500" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-medium mb-1 ${content._id === contentId ? 'text-orange-500' : 'text-white'}`}>
                                        {index + 1}. {content.title}
                                    </h4>
                                    <p className="text-sm text-gray-400">{formatDuration(content.duration)}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-medium mb-2">Course Progress</h4>
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>{completedContents} of {courseData.contents.length} completed</span>
                            <span>{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                    </div>
                </aside>
            </div >
        </div >
    );
};

export default VideoPlayerPage;