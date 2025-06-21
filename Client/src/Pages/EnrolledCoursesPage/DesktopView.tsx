import React from 'react'

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiSearch, FiUsers, FiStar,
    FiBook, FiClock,
    FiPlay,
    FiChevronRight,
    FiBarChart2,
    FiCircle,
    FiCheckCircle
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import type { Course, CourseSection } from '../../components/Common/Types.ts';
import Sidebar from '../../components/Common/SideBar.tsx';

const DesktopView = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('my-learning');
    const [courses, setCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
        });
    });

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const fetchEnrolledCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication token is missing');

                setLoading(true);
                setError('');

                const response = await axios.get('http://localhost:8000/api/enrolled/enrolled', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    signal: abortController.signal
                });

                if (!isMounted) return;

                if (!response.data.success) {
                    throw new Error(response.data.error || 'Failed to fetch courses');
                }

                const coursesData = response.data.data.map((course: any) => ({
                    _id: course._id,
                    title: course.title,
                    description: course.description,
                    subtitle: course.subtitle,
                    thumbnail: course.thumbnail,
                    instructor: {
                        _id: course.instructor._id,
                        name: course.instructor.name,
                        avatar: course.instructor.avatar,
                        email: course.instructor.email,
                    },
                    price: course.price,
                    rating: course.rating,
                    totalStudents: course.totalStudents,
                    duration: course.duration,
                    category: course.category,
                    level: course.level,
                    content: course.content,
                    progress: {
                        completionPercentage: course.totalProgress || 0,
                        lastAccessed: course.lastUpdated,
                        currentVideoId: null,
                        currentVideoProgress: 0,
                    },
                }));

                setCourses(coursesData);
            } catch (err) {
                if (!isMounted || axios.isCancel(err)) return;

                const message = axios.isAxiosError(err)
                    ? err.response?.data?.error || err.message
                    : err instanceof Error
                        ? err.message
                        : 'Failed to load courses';

                console.error('Fetch error:', err);
                setError(message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchEnrolledCourses();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, []);

    const handleCourseNavigation = (courseId: string) => {
        navigate(`/CourseContent/${courseId}/content`);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder-course.jpg';
        target.onerror = null;
    };

    const filteredCourses = courses.filter(course => {
        const title = course?.title?.toLowerCase() || '';
        const instructor = course?.instructor?.name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        const matchesSearch = title.includes(query) || instructor.includes(query);

        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'in-progress' && (course?.progress?.completionPercentage || 0) > 0 &&
                (course?.progress?.completionPercentage || 0) < 100) ||
            (activeFilter === 'completed' && (course?.progress?.completionPercentage || 0) === 100) ||
            (activeFilter === 'new' && (course?.progress?.completionPercentage || 0) === 0);

        return matchesSearch && matchesFilter;
    });

    const continueLearning = courses.length > 0
        ? courses.reduce((prev, current) => {
            const prevDate = prev.progress?.lastAccessed ? new Date(prev.progress.lastAccessed).getTime() : 0;
            const currentDate = current.progress?.lastAccessed ? new Date(current.progress.lastAccessed).getTime() : 0;
            return prevDate > currentDate ? prev : current;
        })
        : null;

    const toggleCourseExpansion = (courseId: string) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never accessed';
        try {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return 'Invalid date';
        }
    };

    const calculateTotalDuration = (sections: CourseSection[]) => {
        return sections.reduce((total, section) => {
            return total + (parseInt(section.duration) || 0);
        }, 0);
    };

    const countTotalLessons = (sections: CourseSection[]) => {
        return sections.reduce((total, section) => {
            return total + (section.content?.length || 0);
        }, 0);
    };

    const countCompletedLessons = (sections: CourseSection[]) => {
        return sections.reduce((total, section) => {
            return total + (section.content?.filter(item => item.completed).length || 0);
        }, 0);
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
                <div className="animate-pulse flex flex-col items-center">
                    <FaGraduationCap className="text-orange-500 text-4xl mb-4" />
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 animate-pulse" style={{ width: '70%' }} />
                    </div>
                    <p className="mt-4 text-gray-400">Loading your courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F0F0F] text-white">
                <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md mx-4">
                    <h2 className="text-xl font-bold mb-4">Error Loading Courses</h2>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        // Desktop View Component
        <div className="flex bg-gray-900 text-white min-h-screen relative">
            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Main Content */}
            <main className="flex-1 p-4">
                {/* Search and Filter Section */}
                <section className="mb-6">
                    <div className="flex flex-row gap-4 mb-4">
                        <div className="relative flex-1" data-aos="fade-down">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your courses..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                            {[
                                { id: 'all', label: 'All Courses' },
                                { id: 'in-progress', label: 'In Progress' },
                                { id: 'completed', label: 'Completed' },
                                { id: 'new', label: 'Not Started' }
                            ].map((filter, index) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${activeFilter === filter.id
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    data-aos="fade-down"
                                    data-aos-delay={index * 50}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Continue Learning Section */}
                {filteredCourses.length > 0 && continueLearning && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center" data-aos="zoom-out">
                            <FiPlay className="mr-2 text-orange-500" />
                            Continue Learning
                        </h2>
                        <div
                            className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 shadow-lg border border-gray-700 cursor-pointer transition-transform hover:scale-[1.005]"
                            onClick={() => handleCourseNavigation(continueLearning._id)}
                            data-aos="fade-up"
                        >
                            <div className="flex flex-row items-start gap-4">
                                <div className="w-1/4 aspect-video">
                                    <img
                                        src={continueLearning.thumbnail || '/placeholder-course.jpg'}
                                        alt={continueLearning.title || 'Course'}
                                        className="w-full h-full rounded-lg object-cover"
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex flex-row justify-between items-start mb-2 gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg line-clamp-1">{continueLearning.title || 'Untitled Course'}</h3>
                                            <p className="text-gray-400 text-sm">{continueLearning.instructor.name || 'Unknown Instructor'}</p>
                                        </div>
                                        <span className="bg-gray-700 text-orange-400 text-xs px-3 py-1 rounded-full">
                                            {continueLearning.category || 'Uncategorized'}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-amber-300 h-2.5 rounded-full"
                                            style={{ width: `${continueLearning.progress?.completionPercentage || 0}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
                                            <span className="flex items-center text-gray-300">
                                                <FiClock className="mr-1" />
                                                {continueLearning.duration || 'No duration'}
                                            </span>
                                            <span className="flex items-center text-gray-300">
                                                <FiUsers className="mr-1" />
                                                {(continueLearning.totalStudents || 0).toLocaleString()} students
                                            </span>
                                            <span className="flex items-center text-gray-300">
                                                <FiStar className="text-yellow-400 mr-1" />
                                                {continueLearning.rating?.toFixed(1) || '0.0'}
                                            </span>
                                        </div>

                                        <button
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm flex items-center justify-center transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCourseNavigation(continueLearning._id);
                                            }}
                                        >
                                            Continue <FiChevronRight className="ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* All Enrolled Courses */}
                <section data-aos="fade-up">
                    <div className="flex flex-row justify-between items-center mb-4 gap-2">
                        <h2 className="text-xl font-bold">Your Courses</h2>
                        <span className="text-orange-500 text-sm">
                            {filteredCourses.length} of {courses.length} courses
                        </span>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 mb-4">
                                {searchQuery ? 'No courses match your search' : 'No courses match your filters'}
                            </div>
                            <button
                                className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                                onClick={() => {
                                    setActiveFilter('all');
                                    setSearchQuery('');
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCourses.map((course, index) => (
                                <div
                                    key={course._id}
                                    className={`bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all ${expandedCourse === course._id ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
                                        }`}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 50}
                                >
                                    {/* Course Header */}
                                    <div
                                        className="p-4 flex items-start cursor-pointer"
                                        onClick={() => toggleCourseExpansion(course._id)}
                                    >
                                        <div className="w-16 h-16 min-w-[64px] rounded-lg overflow-hidden mr-4">
                                            <img
                                                src={course.thumbnail || '/placeholder-course.jpg'}
                                                alt={course.title || 'Course'}
                                                className="w-full h-full object-cover"
                                                onError={handleImageError}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-row justify-between items-start mb-1 gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-bold truncate">{course.title || 'Untitled Course'}</h3>
                                                    <p className="text-gray-400 text-sm truncate">{course.instructor.name || 'Unknown Instructor'}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full shrink-0">
                                                        {course.level || 'All Levels'}
                                                    </span>
                                                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full shrink-0">
                                                        {course.category || 'Uncategorized'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full bg-gray-700 rounded-full h-2 my-2">
                                                <div
                                                    className="bg-gradient-to-r from-orange-500 to-amber-300 h-2 rounded-full"
                                                    style={{ width: `${course.progress?.completionPercentage || 0}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 truncate mr-2">
                                                    {course.progress?.completionPercentage || 0}% complete • Last accessed: {formatDate(course.progress?.lastAccessed)}
                                                </span>
                                                <FiChevronRight
                                                    className={`text-gray-500 transition-transform min-w-4 ${expandedCourse === course._id ? 'transform rotate-90' : ''
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Course Content */}
                                    {expandedCourse === course._id && (
                                        <div className="border-t border-gray-700 p-4">
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="bg-gray-700/50 p-3 rounded-lg">
                                                    <div className="flex items-center text-gray-400 text-sm mb-1">
                                                        <FiBarChart2 className="mr-2" /> Progress
                                                    </div>
                                                    <div className="font-bold text-lg">{course.progress?.completionPercentage || 0}%</div>
                                                </div>

                                                <div className="bg-gray-700/50 p-3 rounded-lg">
                                                    <div className="flex items-center text-gray-400 text-sm mb-1">
                                                        <FiBook className="mr-2" /> Lessons
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {countCompletedLessons(course.content)} / {countTotalLessons(course.content)}
                                                    </div>
                                                </div>

                                                <div className="bg-gray-700/50 p-3 rounded-lg">
                                                    <div className="flex items-center text-gray-400 text-sm mb-1">
                                                        <FiClock className="mr-2" /> Duration
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {calculateTotalDuration(course.content)} min
                                                    </div>
                                                </div>
                                            </div>

                                            <h4 className="font-bold mb-3 flex items-center">
                                                <FiBook className="mr-2 text-orange-500" />
                                                Course Content
                                            </h4>
                                            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                                {course.content?.length ? (
                                                    course.content.map(section => (
                                                        <div key={section._id} className="bg-gray-700/30 rounded-lg p-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h5 className="font-medium">{section.title}</h5>
                                                                <span className="text-xs text-gray-400">
                                                                    {section.completed}/{section.content.length} completed
                                                                </span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {section.content.map(item => (
                                                                    <div
                                                                        key={item._id}
                                                                        className={`flex items-center p-2 rounded transition-colors ${item.completed ? 'bg-green-500/10' : 'hover:bg-gray-600/50'
                                                                            } cursor-pointer`}
                                                                        onClick={() => navigate(`/CourseContent/${course._id}/content/${item._id}`)}
                                                                    >
                                                                        <div
                                                                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${item.completed ? 'text-green-400' : 'text-gray-400'
                                                                                }`}
                                                                        >
                                                                            {item.completed ? <FiCheckCircle /> : <FiCircle />}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-sm truncate">{item.title}</div>
                                                                            <div className="flex items-center text-xs text-gray-400 mt-1">
                                                                                <FiClock className="mr-1 min-w-4" />
                                                                                <span>{item.duration}</span>
                                                                            </div>
                                                                        </div>
                                                                        <FiChevronRight className="text-gray-500 min-w-4" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-500 text-center py-4">No content available</div>
                                                )}
                                            </div>

                                            <div className="flex flex-row gap-3">
                                                <button
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex-1 text-center transition-colors"
                                                    onClick={() => handleCourseNavigation(course._id)}
                                                >
                                                    Continue Learning
                                                </button>
                                                <button
                                                    className="border border-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex-1 text-center transition-colors"
                                                    onClick={() => navigate(`/CourseContent/${course._id}/resources`)}
                                                >
                                                    View Resources
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default DesktopView
