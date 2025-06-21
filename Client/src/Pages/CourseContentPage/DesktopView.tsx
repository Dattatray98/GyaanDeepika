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
    Share2,
    Bookmark,
    Award,
    Target,
    ChevronDown,
    ChevronRight,
    Lock,
    PlayCircle,
    PenTool,
    BarChart3,
    GraduationCap,
    Search,
    Filter,
    Grid,
    List
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Common/Loading';
import type { Course, CourseContentItem, } from '../../components/Common/Types';

const DesktopView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [] = useState('content');
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                setError('');
                if (!courseId || !token) {
                    throw new Error('Missing course ID or authentication token');
                }

                const response = await axios.get(`http://localhost:8000/api/enrolled/${courseId}/content`, {
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

            await axios.post(
                `http://localhost:8000/api/enrolled/${courseId}/bookmark`,
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
                const response = await axios.get(
                    `http://localhost:8000/api/enrolled/${courseId}/content/${content._id}`,
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
    // Desktop View
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Desktop Header */}
            <header className="bg-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
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
                                <h1 className="font-bold text-2xl">{courseData.title}</h1>
                                <p className="text-gray-400">{courseData.subtitle}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleBookmark}
                            className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                }`}
                        >
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-5 gap-6 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <p className="font-bold">{courseData.rating || 0}</p>
                        <p className="text-sm text-gray-400">Rating</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="font-bold">{courseData.totalStudents || 0}</p>
                        <p className="text-sm text-gray-400">Students</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="font-bold">{courseData.duration || 'N/A'}</p>
                        <p className="text-sm text-gray-400">Duration</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className="font-bold">{courseData.level || 'N/A'}</p>
                        <p className="text-sm text-gray-400">Level</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                        <Award className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <p className="font-bold">{courseData.price || 'Free'}</p>
                        <p className="text-sm text-gray-400">Price</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Your Progress</h3>
                        <span className="text-orange-500 font-bold">{courseData.totalProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                        <div
                            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${courseData.totalProgress || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-400">
                        {courseData.completedLessons || 0} of {courseData.totalLessons || 0} lessons completed •
                        Estimated time remaining: {courseData.estimatedTime || 'N/A'}
                    </p>
                </div>
            </header>

            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search course content..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Course Sections */}
                    <div className="space-y-6">
                        {filteredSections.map((section) => (
                            <div key={section._id} className="bg-gray-800 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleSection(section._id)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-xl font-bold mr-3">{section.title}</h3>
                                            {section.locked && <Lock className="w-5 h-5 text-gray-400" />}
                                            <div className="ml-auto flex items-center space-x-4 text-sm text-gray-400">
                                                <span>{section.content?.length || 0} lessons</span>
                                                <span>{section.duration}</span>
                                                <span className="text-orange-500 font-medium">
                                                    {(section.content?.filter(item => item.completed).length || 0)}/{section.content?.length || 0} completed
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400">{section.description}</p>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                                            <div
                                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${((section.content?.filter(item => item.completed).length || 0) / (section.content?.length || 1) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    {expandedSections.includes(section._id) ?
                                        <ChevronDown className="w-6 h-6 text-gray-400 ml-4" /> :
                                        <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
                                    }
                                </button>

                                {expandedSections.includes(section._id) && (
                                    <div className="border-t border-gray-700">
                                        {viewMode === 'list' ? (
                                            <div className="divide-y divide-gray-700">
                                                {section.content?.map((content) => (
                                                    <button
                                                        key={content._id}
                                                        onClick={() => !section.locked && handleContentClick(content, section._id)}
                                                        disabled={section.locked}
                                                        className={`w-full p-4 text-left flex items-center hover:bg-gray-700 transition-colors ${section.locked ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        <div className={`mr-4 ${getContentTypeColor(content.type)}`}>
                                                            {getContentIcon(content.type)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium mb-1">{content.title}</h4>
                                                            <p className="text-sm text-gray-400">{content.duration}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            {content.preview && (
                                                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                                                    Preview
                                                                </span>
                                                            )}
                                                            <span className={`text-xs px-2 py-1 rounded ${getContentTypeColor(content.type)
                                                                } bg-opacity-20`}>
                                                                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                                                            </span>
                                                            {content.completed ? (
                                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {section.content?.map((content) => (
                                                    <button
                                                        key={content._id}
                                                        onClick={() => !section.locked && handleContentClick(content, section._id)}
                                                        disabled={section.locked}
                                                        className={`p-4 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors ${section.locked ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className={`${getContentTypeColor(content.type)}`}>
                                                                {getContentIcon(content.type)}
                                                            </div>
                                                            {content.completed ? (
                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                            ) : (
                                                                <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium mb-2">{content.title}</h4>
                                                        <p className="text-sm text-gray-400 mb-2">{content.duration}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className={`text-xs px-2 py-1 rounded ${getContentTypeColor(content.type)
                                                                } bg-opacity-20`}>
                                                                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                                                            </span>
                                                            {content.preview && (
                                                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                                                    Preview
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="w-80 bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
                    {/* Instructor Info */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="font-bold mb-3">Instructor</h3>
                        <div className="flex items-center mb-3">
                            <img
                                src={courseData.instructor.avatar || 'https://via.placeholder.com/150'}
                                alt={courseData.instructor.name}
                                className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            <div>
                                <h4 className="font-medium">{courseData.instructor.name}</h4>
                                <div className="flex items-center text-sm text-gray-400">
                                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                    <span>{courseData.instructor.rating || 0}</span>
                                    <span className="mx-2">•</span>
                                    <span>{courseData.instructor.students || 0} students</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">{courseData.instructor.bio || 'No bio available'}</p>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
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

                    {/* Course Resources */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="font-bold mb-3">Resources</h3>
                        <div className="space-y-2">
                            {(courseData.resources || []).map(resource => (
                                <div key={resource._id} className="flex items-center justify-between p-2 hover:bg-gray-600 rounded">
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-blue-400 mr-2" />
                                        <span className="text-sm">{resource.title}</span>
                                    </div>
                                    <button className="text-orange-500 hover:text-orange-400">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-bold mb-3">Announcements</h3>
                        <div className="space-y-3">
                            {(courseData.announcements || []).map(announcement => (
                                <div key={announcement._id} className={`p-3 rounded ${announcement.important
                                    ? 'bg-orange-500/10 border border-orange-500/20'
                                    : 'bg-gray-600'
                                    }`}>
                                    <div className="flex items-start justify-between mb-1">
                                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                                        {announcement.important && (
                                            <span className="bg-orange-500 text-white text-xs px-1 py-0.5 rounded">!</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mb-1">{announcement.content}</p>
                                    <p className="text-xs text-gray-500">{announcement.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default DesktopView
