
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, BookOpen, Users, Star, ChevronLeft,
    ChevronRight, Download, Share2, Bookmark,
    ThumbsUp, GraduationCap,
    Play, CheckCircle, Clock, FileText
} from 'lucide-react';
import { FaBrain } from 'react-icons/fa';
import { MdOutlineSummarize } from "react-icons/md";
import VideoPlayer from '../../components/VideoPlayer.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import Loading from '../../components/Common/Loading.tsx';
import type { Course, CourseContent } from '../../components/Common/Types.ts';
import { fetchCourseContent } from '../../hooks/useContentHandlers.ts';
import { handleAskQuestion, handleGenerateSummary } from '../../hooks/useAIHandlers.ts';
import AOS from 'aos'


const DeskTopView = () => {
    const { courseId, contentId } = useParams<{
        courseId: string;
        contentId: string;
    }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [notes, setNotes] = useState('');
    const [videoProgress, setVideoProgress] = useState(0);
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

    const handleAskQuestionClick = () => {
        if (!userQuestion.trim()) {
            setQaError("Please enter a question");
            return;
        }

        setChatHistory((prev) => [...prev, { sender: 'user', text: userQuestion }]);
        setQaLoading(true);
        setQaError('');
        const question = userQuestion;
        setUserQuestion('');

        if (token && courseId && contentId) {
            handleAskQuestion(
                token,
                question,
                courseId,
                contentId,
                setChatHistory,
                setQaLoading,
                setQaError
            );
        }
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
                    Math.round((savedProgress.watchedDuration / (video.duration || 1)) * 100)
                );
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

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <header className="bg-gray-800 p-6 flex items-center justify-between" >
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-orange-500 mr-4"
                        data-aos='zoom-in'
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center" data-aos='zoom-in'>
                        <GraduationCap className="text-orange-500 text-2xl mr-3" />
                        <div>
                            <h1 className="font-bold text-lg">{courseData.title}</h1>
                            <p className="text-gray-400 text-sm">by {courseData.instructor.name}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400" data-aos='zoom-in'>
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
                    <div className="mb-6" data-aos='zoom-in'>
                        <VideoPlayer
                            videoUrl={currentContent.videoUrl}
                            title={currentContent.title}
                            onTimeUpdate={(currentTime, duration) =>
                                handleVideoProgress(currentTime, duration, courseId!, contentId!)
                            }
                            onVideoEnd={handleVideoEnd}
                        />
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1" data-aos='zoom-in'>
                                <h2 className="text-2xl font-bold mb-2">{currentContent.title}</h2>
                                <p className="text-gray-400 mb-4">{currentContent.description}</p>
                            </div>
                            <div className="flex items-center space-x-3 ml-6" data-aos='zoom-in'>
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
                            <div className="flex justify-between text-sm text-gray-400 mb-2" data-aos='zoom-in'>
                                <span>Your Progress</span>
                                <span>{Math.round(videoProgress)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2" data-aos='zoom-in'>
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${videoProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between" data-aos='zoom-in'>
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
                        <div className="flex border-b border-gray-700" data-aos='zoom-in'>
                            {[
                                { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
                                { id: 'Write Notes', label: 'Write Notes', icon: <FileText className="w-4 h-4" /> },
                                { id: 'Video Summary', label: 'Video Summary', icon: <MdOutlineSummarize className='w-4 h-4' /> },
                                { id: 'Ask Question', label: 'Ask Question', icon: <FaBrain className='w-4 h-4' /> },
                                { id: 'Video Notes', label: 'Video Notes', icon: <FileText className="w-4 h-4" /> }

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

                        <div className="p-6" >
                            {activeTab === 'overview' && (
                                <div>
                                    <h3 className="font-bold text-lg mb-4">About this lesson</h3>
                                    <p className="text-gray-300 mb-6">{currentContent.description}</p>

                                    <div className="grid grid-cols-3 gap-4 mb-6" data-aos='zoom-in'>
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

                            {activeTab === 'Write Notes' && (
                                <div>
                                    <h3 className="font-bold text-lg mb-4">My Notes</h3>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Take notes while watching the video..."
                                        className="w-full h-64 bg-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        data-aos='zoom-in'
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors" data-aos='zoom-in'>
                                            Save Notes
                                        </button>
                                    </div>
                                </div>
                            )}


                            {activeTab === 'Video Summary' && (
                                <div className="p-4 bg-zinc-900 text-white rounded-lg shadow-md w-full" data-aos='zoom-in'>
                                    <h3 className="font-bold text-lg mb-4">Video Summary</h3>

                                    <button
                                        onClick={onGenerateSummary}
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
                                <div className="flex flex-col gap-4 p-4 bg-zinc-900 text-white rounded-lg shadow-md max-h-[70vh] overflow-y-auto w-full" data-aos='zoom-in'>
                                    <h3 className="font-bold text-xl mb-2">💬 Ask AI About This Video</h3>

                                    <div className="flex flex-col gap-4 overflow-y-auto">
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
                                                onClick={handleAskQuestionClick}
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

                            {activeTab === 'Video Notes' && currentContent?.PdfViewUrl && (
                                <div>
                                    <div className="flex gap-4 mb-5 items-center">
                                        <h3 className="font-bold text-lg" data-aos="zoom-in">Lecture Notes (PDF)</h3>

                                        {currentContent?.PdfDownloadUrl && (
                                            <a
                                                href={currentContent.PdfDownloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <button
                                                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                                    aria-label="Download PDF"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </a>
                                        )}
                                    </div>

                                    <iframe
                                        src={currentContent.PdfViewUrl}
                                        onClick={()=>console.log(currentContent.PdfViewUrl)}
                                        className="w-full h-[80vh] rounded-lg border border-gray-700"
                                        title="Lecture PDF Preview"
                                        data-aos="zoom-in"
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                </main>

                <aside className="w-80 bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
                    <h3 className="font-bold text-lg mb-6">Course Content</h3>

                    <div className="space-y-3" data-aos='zoom-in'>
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

                    <div className="mt-8 p-4 bg-gray-700 rounded-lg" data-aos='zoom-in'>
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
            </div>
        </div>
    );

}

export default DeskTopView
