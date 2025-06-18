import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiClock,
  FiChevronRight,
  FiUsers,
  FiStar,
  FiPlay,
  FiBook,
  FiBarChart2,
  FiHome,
  FiCompass,
  FiUser,
  FiMenu
} from 'react-icons/fi';
import { FaGraduationCap, FaRegCheckCircle, FaRegCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Instructor {
  _id: string;
  name: string;
  avatar?: string;
  email?: string;
}

interface CourseContentItem {
  _id: string;
  type: string;
  title: string;
  duration: string;
  completed?: boolean;
  preview?: boolean;
  videoUrl?: string;
  notes?: string;
  resources?: string[];
  quizzes?: any[];
}

interface CourseSection {
  _id: string;
  title: string;
  description?: string;
  duration: string;
  lessons: number;
  completed: number;
  locked: boolean;
  content: CourseContentItem[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  subtitle?: string;
  thumbnail: string;
  instructor: Instructor;
  price: number;
  rating?: number;
  totalStudents?: number;
  duration?: string;
  category?: string;
  level?: string;
  content: CourseSection[];
  progress?: {
    completionPercentage: number;
    lastAccessed?: string;
    currentVideoId?: string;
    currentVideoProgress?: number;
  };
}

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  path: string;
}

const EnrolledCoursesPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { token } = useAuth();
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('my-learning');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  useEffect(() => {
    let abortController: AbortController;
    let isMounted = true;

    const fetchEnrolledCourses = async () => {
      abortController = new AbortController();
      const startTime = Date.now();

      try {
        if (!token) {
          throw new Error('Authentication token is missing');
        }

        setLoading(true);
        setLoadingProgress(0);
        setError('');

        const response = await axios.get(`http://localhost:8000/api/courses/enrolled`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: abortController.signal,
          onDownloadProgress: (progressEvent) => {
            if (isMounted && progressEvent.total) {
              const percentComplete = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setLoadingProgress(percentComplete);
            }
          }
        });

        if (!isMounted) return;

        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch courses');
        }

        // Transform the data to match our interface
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
            email: course.instructor.email
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
            currentVideoProgress: 0
          }
        }));

        setCourses(coursesData);
        setLoadingProgress(100);

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsed);

        await new Promise(resolve => setTimeout(resolve, remainingTime));

      } catch (err) {
        if (!isMounted || axios.isCancel(err)) return;
        
        const errorMessage = axios.isAxiosError(err) 
          ? err.response?.data?.error || err.message
          : err instanceof Error 
            ? err.message 
            : 'Failed to load courses';
        
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();

    return () => {
      isMounted = false;
      abortController?.abort();
    };
  }, [token]);

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
      (activeFilter === 'in-progress' && (course?.progress?.completionPercentage || 0) > 0 && (course?.progress?.completionPercentage || 0) < 100) ||
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

  const navItems: NavigationItem[] = [
    { icon: <FiHome size={isMobile ? 20 : 16} />, label: 'Home', value: 'home', path: "/home" },
    { icon: <FiCompass size={isMobile ? 20 : 16} />, label: 'Discover', value: 'discover', path: "/browse-courses" },
    { icon: <FiBook size={isMobile ? 20 : 16} />, label: 'My Learning', value: 'my-learning', path: "/my-learning" },
    { icon: <FiUser size={isMobile ? 20 : 16} />, label: 'Profile', value: 'profile', path: "/profile" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaGraduationCap className="text-orange-500 text-4xl mb-4" />
          </motion.div>

          <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 100,
                duration: 0.5
              }}
            />
          </div>

          <motion.p
            className="text-gray-400 text-sm"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {loadingProgress < 30 && "Preparing courses..."}
            {loadingProgress >= 30 && loadingProgress < 70 && "Loading content..."}
            {loadingProgress >= 70 && loadingProgress < 100 && "Almost there..."}
            {loadingProgress === 100 && "Finishing up..."}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0F0F0F] text-white">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Error Loading Courses</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <p className="mt-4 text-sm text-gray-400">
            Or <Link to="/login" className="text-orange-400 hover:underline">login</Link> again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900 text-white min-h-screen relative">
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg shadow-lg md:hidden"
        >
          <FiMenu size={24} className="text-orange-500" />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { x: 0 }}
            animate={isMobile ? { x: sidebarOpen ? 0 : -300 } : { x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`w-64 bg-[#1D1D1D] p-6 h-screen fixed md:sticky top-0 z-40 ${isMobile ? 'shadow-2xl' : ''}`}
          >
            <motion.div
              className="flex items-center mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
              <h1 className="font-bold text-xl">GyaanDeepika</h1>
            </motion.div>

            <motion.nav
              className="space-y-1 mb-8"
              initial="hidden"
              animate="visible"
            >
              {navItems.map((tab, index) => (
                <motion.button
                  key={tab.value}
                  variants={slideUp}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === tab.value ? 'bg-gray-800 text-orange-500' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  onClick={() => {
                    setActiveTab(tab.value);
                    navigate(tab.path);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 p-4 transition-all ${isMobile ? 'pt-16 pb-20' : 'md:ml-64'}`}>
        {/* Search and Filter Section */}
        <section className="mb-6" data-aos="fade-down">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
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
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${activeFilter === filter.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Continue Learning Section */}
        {filteredCourses.length > 0 && continueLearning && (
          <section className="mb-8" data-aos="fade-up">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FiPlay className="mr-2 text-orange-500" />
              Continue Learning
            </h2>
            <div
              className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 shadow-lg border border-gray-700 cursor-pointer transition-transform hover:scale-[1.005]"
              onClick={() => handleCourseNavigation(continueLearning._id)}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full sm:w-1/4 aspect-video">
                  <img
                    src={continueLearning.thumbnail || '/placeholder-course.jpg'}
                    alt={continueLearning.title || 'Course'}
                    className="w-full h-full rounded-lg object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{continueLearning.title || 'Untitled Course'}</h3>
                      <p className="text-gray-400 text-sm">{continueLearning.instructor.name || 'Unknown Instructor'}</p>
                    </div>
                    <span className="bg-gray-700 text-orange-400 text-xs px-3 py-1 rounded-full self-start sm:self-auto">
                      {continueLearning.category || 'Uncategorized'}
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-300 h-2.5 rounded-full"
                      style={{ width: `${continueLearning.progress?.completionPercentage || 0}%` }}
                    ></div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:py-1 rounded-lg text-sm flex items-center justify-center transition-colors"
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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
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
              {filteredCourses.map(course => (
                <div
                  key={course._id}
                  className={`bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all ${expandedCourse === course._id ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
                    }`}
                  data-aos="zoom-in"
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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-2">
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
                    <div className="border-t border-gray-700 p-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
                                      {item.completed ? <FaRegCheckCircle /> : <FaRegCircle />}
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

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 sm:py-2 rounded-lg font-medium flex-1 text-center transition-colors"
                          onClick={() => handleCourseNavigation(course._id)}
                        >
                          Continue Learning
                        </button>
                        <button
                          className="border border-gray-600 hover:bg-gray-700 text-white px-4 py-3 sm:py-2 rounded-lg font-medium flex-1 text-center transition-colors"
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] flex justify-around py-3 border-t border-gray-800 z-10">
          {navItems.map(item => (
            <button
              key={item.value}
              onClick={() => {
                setActiveTab(item.value);
                navigate(item.path);
              }}
              className={`flex flex-col items-center p-2 transition-colors rounded-lg ${activeTab === item.value ? 'text-orange-500 bg-gray-800' : 'text-gray-400 hover:text-white'
                }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;