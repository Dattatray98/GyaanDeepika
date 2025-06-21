import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Users,
    Star,
    BookOpen,
    FileText,
    Download,
    Bookmark,
    Target,
    ChevronDown,
    ChevronRight,
    Lock,
    PlayCircle,
    PenTool,
    BarChart3,
    Search
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.tsx';
import Loading from '../../components/Common/Loading.tsx';
import type { Course, CourseContentItem, } from '../../components/Common/Types.ts';


const MobileView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('content');
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    //   const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);
    //   const [showFilters, setShowFilters] = useState(false);
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    //   useEffect(() => {
    //     const checkScreenSize = () => {
    //       setIsMobile(window.innerWidth < 1024);
    //     };

    //     checkScreenSize();
    //     window.addEventListener('resize', checkScreenSize);
    //     return () => window.removeEventListener('resize', checkScreenSize);
    //   }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                setError('');
                if (!courseId || !token) {
                    throw new Error('Missing course ID or authentication token');
                }
                const api = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${api}/api/enrolled/${courseId}/content`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const courseData = response.data?.data?.course || response.data?.data;

                if (!courseData || !courseData.courseTitle || !courseData.courseDescription) {
                    throw new Error('Invalid course data structure');
                }
                setCourseData(courseData);

                const content = courseData.content || courseData.course?.content;
                if (content?.length) {
                    setExpandedSections([content[0]._id]);
                }
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorMessage = err.response?.data?.message || err.message || 'Request failed';
                    setError(errorMessage);
                    console.error('Axios error:', errorMessage);
                } else if (err instanceof Error) {
                    setError(err.message);
                    console.error('Error:', err.message);
                } else {
                    setError('An unknown error occurred');
                    console.error('Unknown error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId, token]);

    const toggleBookmark = async () => {
        try {
            if (!courseId || !token) return;
            const api = import.meta.env.VITE_API_URL;
            await axios.post(
                `${api}/api/enrolled/${courseId}/bookmark`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setIsBookmarked(!isBookmarked);
        } catch (err) {
            console.error('Error toggling bookmark:', err);
        }
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const getContentIcon = (type: string) => {
        switch (type) {
            case 'video': return <PlayCircle className="w-5 h-5" />;
            case 'reading': return <FileText className="w-5 h-5" />;
            case 'quiz': return <Target className="w-5 h-5" />;
            case 'assignment': return <PenTool className="w-5 h-5" />;
            default: return <BookOpen className="w-5 h-5" />;
        }
    };

    const getContentTypeColor = (type: string) => {
        switch (type) {
            case 'video': return 'text-blue-400';
            case 'reading': return 'text-green-400';
            case 'quiz': return 'text-purple-400';
            case 'assignment': return 'text-orange-400';
            default: return 'text-gray-400';
        }
    };

    const handleContentClick = async (content: CourseContentItem, sectionId: string) => {
        if (!courseData || !courseId) return;

        if (content.type === 'video') {
            try {
                const api = import.meta.env.VITE_API_URL;
                const response = await axios.get(
                    `${api}/api/enrolled/${courseId}/content/${content._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const videoContent = response.data.data;

                navigate(`/courses/${courseId}/content/${content._id}`, {
                    state: {
                        videoContent,
                        courseTitle: courseData.title,
                        sectionTitle: courseData.content?.find(s => s._id === sectionId)?.title || ''
                    }
                });
            } catch (err) {
                console.error('Error fetching video content:', err);
            }
        } else if (content.type === 'quiz') {
            navigate(`/courses/${courseId}/quiz/${content._id}`);
        } else if (content.type === 'reading') {
            navigate(`/courses/${courseId}/reading/${content._id}`);
        } else if (content.type === 'assignment') {
            navigate(`/courses/${courseId}/assignment/${content._id}`);
        }
    };

    const filteredSections = (courseData?.content || courseData?.course?.content || []).filter(section => {
        if (searchTerm) {
            return section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (section.content || []).some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return true;
    });

    if (loading) {
        return (<Loading />)
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <div className="max-w-md p-6 bg-gray-800 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Error Loading Course</h2>
                    <p className="mb-4">{error}</p>
                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Browse Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!courseData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <div className="max-w-md p-6 bg-gray-800 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Course Not Found</h2>
                    <p className="mb-6">The requested course could not be found or you don't have access.</p>
                    <button
                        onClick={() => navigate('/BrowseCourses')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Mobile Header */}
            <header className="bg-gray-800 p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-orange-500"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg flex-1 mx-4 text-center truncate">{courseData.title}</h1>
                    <button
                        onClick={toggleBookmark}
                        className={`${isBookmarked ? 'text-orange-500' : 'text-gray-400'}`}
                    >
                        <Bookmark className="w-6 h-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                    {[
                        { id: 'content', label: 'Content' },
                        { id: 'about', label: 'About' },
                        { id: 'resources', label: 'Resources' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Mobile Content */}
            <div className="p-4">
                {activeTab === 'content' && (
                    <div>
                        {/* Progress Overview */}
                        <div className="bg-gray-800 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold">Your Progress</h3>
                                <span className="text-orange-500 font-medium">{courseData.totalProgress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${courseData.totalProgress || 0}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-400">
                                {courseData.completedLessons || 0} of {courseData.totalLessons || 0} lessons completed
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            />
                        </div>

                        {/* Course Sections */}
                        <div className="space-y-4">
                            {filteredSections.map((section) => (
                                <div key={section._id} className="bg-gray-800 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection(section._id)}
                                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center mb-1">
                                                <h3 className="font-medium mr-2">{section.title}</h3>
                                                {section.locked && <Lock className="w-4 h-4 text-gray-400" />}
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2">{section.description}</p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span>{section.content?.length || 0} lessons</span>
                                                <span className="mx-2">•</span>
                                                <span>{section.duration}</span>
                                                <span className="mx-2">•</span>
                                                <span>
                                                    {(section.content?.filter(item => item.completed).length || 0)}/{section.content?.length || 0} completed
                                                </span>
                                            </div>
                                        </div>
                                        {expandedSections.includes(section._id) ?
                                            <ChevronDown className="w-5 h-5 text-gray-400" /> :
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        }
                                    </button>

                                    {expandedSections.includes(section._id) && (
                                        <div className="border-t border-gray-700">
                                            {section.content?.map((content, index) => (
                                                <button
                                                    key={content._id}
                                                    onClick={() => !section.locked && handleContentClick(content, section._id)}
                                                    disabled={section.locked}
                                                    className={`w-full p-4 text-left flex items-center hover:bg-gray-700 transition-colors ${section.locked ? 'opacity-50 cursor-not-allowed' : ''
                                                        } ${index !== (section.content?.length || 0) - 1 ? 'border-b border-gray-700' : ''
                                                        }`}
                                                >
                                                    <div className={`mr-3 ${getContentTypeColor(content.type)}`}>
                                                        {getContentIcon(content.type)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm">{content.title}</h4>
                                                        <p className="text-xs text-gray-400">{content.duration}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {content.preview && (
                                                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded mr-2">
                                                                Preview
                                                            </span>
                                                        )}
                                                        {content.completed ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-6">
                        {/* Course Info */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <img
                                src={courseData.thumbnail}
                                alt={courseData.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-xl font-bold mb-2">{courseData.title}</h2>
                            <p className="text-gray-400 mb-4">{courseData.subtitle}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                        <span className="font-medium">{courseData.rating || 0}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Rating</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <Users className="w-4 h-4 text-blue-400 mr-1" />
                                        <span className="font-medium">{courseData.totalStudents || 0}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Students</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <Clock className="w-4 h-4 text-green-400 mr-1" />
                                        <span className="font-medium">{courseData.duration || 'N/A'}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Duration</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                        <BarChart3 className="w-4 h-4 text-purple-400 mr-1" />
                                        <span className="font-medium">{courseData.level || 'N/A'}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Level</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm">{courseData.description}</p>
                        </div>

                        {/* Instructor */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-bold mb-3">Instructor</h3>
                            <div className="flex items-center">
                                <img
                                    src={courseData.instructor.avatar || 'https://via.placeholder.com/150'}
                                    alt={courseData.instructor.name}
                                    className="w-12 h-12 rounded-full object-cover mr-3"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{courseData.instructor.name}</h4>
                                    <p className="text-sm text-gray-400">{courseData.instructor.bio || 'No bio available'}</p>
                                    <div className="flex items-center mt-1 text-xs text-gray-400">
                                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                        <span>{courseData.instructor.rating || 0}</span>
                                        <span className="mx-2">•</span>
                                        <span>{courseData.instructor.students || 0} students</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Learning Outcomes */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-bold mb-3">What you'll learn</h3>
                            <ul className="space-y-2">
                                {(courseData.learningOutcomes || []).slice(0, 3).map((outcome, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-300">{outcome}</span>
                                    </li>
                                ))}
                            </ul>
                            {(courseData.learningOutcomes || []).length > 3 && (
                                <button className="text-orange-500 text-sm mt-2 hover:text-orange-400">
                                    Show all {courseData.learningOutcomes?.length} outcomes
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="space-y-6">
                        {/* Downloads */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-bold mb-4">Course Resources</h3>
                            <div className="space-y-3">
                                {(courseData.resources || []).map(resource => (
                                    <div key={resource._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            <FileText className="w-5 h-5 text-blue-400 mr-3" />
                                            <div>
                                                <h4 className="font-medium text-sm">{resource.title}</h4>
                                                <p className="text-xs text-gray-400">{resource.type} • {resource.size}</p>
                                            </div>
                                        </div>
                                        <button className="text-orange-500 hover:text-orange-400">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Announcements */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-bold mb-4">Announcements</h3>
                            <div className="space-y-3">
                                {(courseData.announcements || []).map(announcement => (
                                    <div key={announcement._id} className={`p-3 rounded-lg ${announcement.important
                                        ? 'bg-orange-500/10 border border-orange-500/20'
                                        : 'bg-gray-700'
                                        }`}>
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="font-medium text-sm">{announcement.title}</h4>
                                            {announcement.important && (
                                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Important</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-1">{announcement.content}</p>
                                        <p className="text-xs text-gray-500">{announcement.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MobileView
