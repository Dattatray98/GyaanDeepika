import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Users, Star, ChevronLeft,
    ChevronRight,
    Play, CheckCircle, Clock, FileText,
    BookOpen, X,
    ThumbsUp,
    Bookmark,
    Share2,
    Download
} from 'lucide-react';
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FaBrain } from 'react-icons/fa';
import { MdOutlineSummarize } from "react-icons/md";
import VideoPlayer from '../../components/VideoPlayer.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import Loading from '../../components/Common/Loading.tsx';
import type { CourseContent, Course } from '../../components/Common/Types.ts';
import { fetchCourseContent } from '../../hooks/useContentHandlers.ts';
import { handleAskQuestion, handleGenerateSummary } from '../../hooks/useAIHandlers.ts';
import AOS from 'aos'

const MobileView = () => {
    const { courseId, contentId } = useParams<{
        courseId: string;
        contentId: string;
    }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [notes, setNotes] = useState('');
    const [, setVideoProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState<Course | null>(null);
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
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isMarked, setIsMarked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);




    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });
    })


    useEffect(() => {
        if (courseId && contentId && token) {
            fetchCourseContent(
                token,
                courseId,
                contentId,
                setLoading,
                setError,
                setCourseData,
                setCurrentContent
            );
        }
    }, [courseId, contentId, token]);


    const onGenerateSummary = () => {
        if (token && contentId && courseId) {
            handleGenerateSummary(
                token,
                courseId,
                contentId,
                setSummaryText,
                setSummaryLoading,
                setSummaryError
            );
        }
    };

    const onAskQuestion = () => {
        if (token && courseId && contentId)
            handleAskQuestion(
                token,
                userQuestion,
                courseId,
                contentId,
                setChatHistory,
                setQaLoading,
                setQaError
            );
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const fetchVideoProgress = async (courseId: string, contentId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User not authenticated');

            const api = import.meta.env.VITE_API_URL;
            const response = await axios.get(
                `${api}/api/progress/progress/${courseId}/${contentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch video progress:', error);
            return null;
        }
    };

    const handleVideoProgress = async (
        currentTime: number,
        duration: number,
        courseId: string,
        contentId: string
    ) => {
        if (!courseId || !contentId) return;

        if (currentTime % 5 > 0.1) return; // Throttle updates

        const completionPercentage = Math.round((currentTime / duration) * 100);
        const isCompleted = completionPercentage >= 95;
        setVideoProgress(completionPercentage);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User not authenticated');

            const api = import.meta.env.VITE_API_URL;
            await axios.put(
                `${api}/api/progress`,
                {
                    courseId,
                    contentId,
                    watchedDuration: currentTime,
                    isCompleted,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    useEffect(() => {
        const initializeVideoProgress = async () => {
            const savedProgress = await fetchVideoProgress(courseId!, contentId!);
            if (savedProgress && videoRef.current) {
                const video = videoRef.current;

                video.addEventListener('loadedmetadata', () => {
                    video.currentTime = savedProgress.watchedDuration || 0;
                }, { once: true });

                setVideoProgress(
                    Math.round((savedProgress.watchedDuration / (video.duration || 1)) * 100
                    ));
            }
        };

        initializeVideoProgress();
    }, [courseId, contentId]);

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
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F0F0F] text-white">
                <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md" data-aos='zoom-in'>
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

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <header className="bg-gray-800 p-4 flex items-center justify-between sticky top-0 z-10" >
                <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:text-orange-500"
                    data-aos='zoom-in'
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-medium text-sm flex-1 mx-4 truncate" data-aos='zoom-in'>{currentContent.title}</h1>
                <button
                    className="text-white hover:text-orange-500"
                    onClick={() => setShowSidebar(!showSidebar)}
                    data-aos='zoom-in'
                >
                    {/* <Menu className="w-6 h-6" /> */}
                </button>
            </header>

            {showSidebar && (
                <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex" >
                    <div
                        className="bg-gray-800 w-4/5 h-full overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-4 flex items-center justify-between" data-aos='zoom-in'>
                                Course Content
                                <button onClick={() => setShowSidebar(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </h3>
                            <div className="space-y-3">
                                {courseData.contents.map((content, index) => (
                                    <button
                                        key={content._id}
                                        onClick={() => {
                                            navigateToContent(content._id);
                                            setShowSidebar(false);
                                        }}
                                        className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${content._id === contentId
                                            ? 'bg-orange-500/20 border border-orange-500/30'
                                            : 'hover:bg-gray-700'
                                            }`}
                                        data-aos='zoom-in'
                                    >
                                        <div className="flex items-center mr-3">
                                            {content.isCompleted ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : content._id === contentId ? (
                                                <Play className="w-5 h-5 text-orange-500" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-400" data-aos='zoom-in'></div>
                                            )}
                                        </div>
                                        <div className="flex-1" data-aos='zoom-in'>
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
            )}

            <div className="relative">
                <VideoPlayer
                    videoUrl={currentContent.videoUrl}
                    title={currentContent.title}
                    onTimeUpdate={(currentTime, duration) =>
                        handleVideoProgress(currentTime, duration, courseId!, contentId!)
                    }
                    onVideoEnd={handleVideoEnd}
                    data-aos='zoom-in'
                />
            </div>

            <div className="flex justify-between items-start mb-4 mt-4">
                <div className="flex items-center space-x-3 ml-3">
                    <button
                        onClick={() => setIsMarked(!isMarked)}
                        className={`flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors ${isMarked ? 'bg-green-800 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                        data-aos='zoom-in'
                    >
                        <IoCheckmarkDoneCircleOutline className="w-4 h-4" />

                    </button>
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center space-x-2 px-4 py-1 rounded-lg transition-colors ${isLiked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                        data-aos='zoom-in'
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span>124</span>
                    </button>
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`py-1 px-2 rounded-lg transition-colors ${isBookmarked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                        data-aos='zoom-in'
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="py-1 px-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" data-aos='zoom-in'>
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="py-1 px-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" data-aos='zoom-in'>
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex overflow-x-auto border-b border-gray-700 bg-gray-800 sticky top-14 z-10" data-aos='zoom-in'>
                {[
                    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
                    { id: 'Write Notes', label: 'Write Notes', icon: <FileText className="w-4 h-4" /> },
                    { id: 'Video Summary', label: 'Summary', icon: <MdOutlineSummarize className='w-4 h-4' /> },
                    { id: 'Ask Question', label: 'Q & A', icon: <FaBrain className='w-4 h-4' /> },
                    { id: 'Video Notes', label: 'Video Notes', icon: <FileText className="w-4 h-4" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-shrink-0 flex items-center space-x-1 px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-xs">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-4">
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2" data-aos='zoom-in'>{currentContent.title}</h2>
                        <p className="text-gray-400 text-sm mb-4" data-aos='zoom-in'>{currentContent.description}</p>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-gray-800 rounded-lg p-2 text-center" data-aos='zoom-in'>
                                <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Duration</p>
                                <p className="text-sm font-medium">{formatDuration(currentContent.duration)}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-2 text-center" data-aos='zoom-in'>
                                <Users className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Students</p>
                                <p className="text-sm font-medium">{courseData.students}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-2 text-center" data-aos='zoom-in'>
                                <Star className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                                <p className="text-xs text-gray-400">Rating</p>
                                <p className="text-sm font-medium">{courseData.rating}/5</p>
                            </div>
                        </div>

                        {currentContent.content && (
                            <div className="prose prose-invert max-w-none text-sm" data-aos='zoom-in'>
                                <h4 className="font-bold mb-2">Lesson Content</h4>
                                <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'Write Notes' && (
                    <div>
                        <h3 className="font-bold text-lg mb-3" data-aos='zoom-in'>My Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Take notes while watching the video..."
                            className="w-full h-48 bg-gray-800 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" data-aos='zoom-in'
                        />
                        <div className="flex justify-end mt-3" data-aos='zoom-in'>
                            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                Save Notes
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Video Summary' && (
                    <div className="p-3 bg-gray-800 rounded-lg" data-aos='zoom-in'>
                        <h3 className="font-bold text-lg mb-3" data-aos='zoom-in'>Video Summary</h3>

                        <button
                            onClick={onGenerateSummary}
                            disabled={summaryLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all disabled:opacity-50 mb-3" data-aos='zoom-in'
                        >
                            {summaryLoading ? "Generating..." : "Generate Summary"}
                        </button>

                        {summaryError && (
                            <p className="text-red-400 text-sm mb-2" data-aos='zoom-in'>{summaryError}</p>
                        )}

                        {summaryText && (
                            <div className="border-t border-gray-700 pt-3" data-aos='zoom-in'>
                                <h4 className="text-white font-semibold text-sm mb-2">AI Summary:</h4>
                                <p className="whitespace-pre-line text-gray-100 text-sm">{summaryText}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'Ask Question' && (
                    <div className="flex flex-col gap-3 p-3 bg-gray-800 rounded-lg max-h-[60vh] overflow-y-auto" data-aos='zoom-in'>
                        <h3 className="font-bold text-lg" data-aos='zoom-in'>Ask AI About This Video</h3>

                        <div className="flex flex-col gap-3 overflow-y-auto" data-aos='zoom-in'>
                            {chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap break-words text-sm ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                            }`}
                                        data-aos='zoom-in'
                                    >
                                        <div className="text-xs font-semibold mb-1 text-gray-300" data-aos='zoom-in'>
                                            {msg.sender === 'user' ? 'You' : 'AI'}
                                        </div>
                                        <div>{msg.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto flex flex-col gap-2">
                            <textarea
                                placeholder="Ask your question..."
                                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none resize-none text-sm"
                                rows={2}
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                                data-aos='zoom-in'
                            />

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={onAskQuestion}
                                    disabled={qaLoading || !userQuestion.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all disabled:opacity-50"
                                    data-aos='zoom-in'
                                >
                                    {qaLoading ? "Thinking..." : "Send"}
                                </button>
                                {qaError && <p className="text-red-400 text-xs">{qaError}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Video Notes' && (
                    <div>
                        <h3 className="font-bold text-lg mb-3" data-aos="zoom-in">Lecture Notes (PDF)</h3>

                        <iframe
                            src=""
                            className="w-full h-[500px] rounded-lg border border-gray-700"
                            title="Lecture PDF"
                            data-aos="zoom-in"
                        />
                    </div>
                )}


            </div>

            <div className="p-4 bg-gray-800" >
                <div data-aos='zoom-in' className=' sticky bottom-0 flex items-center justify-between'>
                    <button
                        onClick={goToPrevious}
                        disabled={!canGoToPrevious()}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${canGoToPrevious()
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}

                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Prev</span>
                    </button>

                    <span className="text-xs text-gray-400" >
                        {getCurrentContentIndex() + 1}/{courseData.contents.length}
                    </span>

                    <button
                        onClick={goToNext}
                        disabled={!canGoToNext()}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${canGoToNext()
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}

                    >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Show content */}

            <div className="w-full bg-gray-800 p-6 top-0 max-h-[70vh]">
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
                            data-aos='zoom-in'
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
            </div>

        </div>
    );
};

export default MobileView;