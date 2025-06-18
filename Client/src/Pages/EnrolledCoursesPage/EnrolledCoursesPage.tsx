import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiClock,
  FiChevronRight,
  FiUsers,
  FiStar,
  FiPlay,
  FiHome,
  FiBook,
  FiUser,
  FiDownload,
  FiAward,
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';
import { FaGraduationCap, FaRegCheckCircle, FaRegCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Module {
  id: string;
  name: string;
  duration: string;
  completed: boolean;
  resources: number;
}

interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  image: string;
  instructor: string;
  price: string;
  category: string;
  progress: number;
  lastAccessed: string;
  duration: string;
  rating: number;
  students: number;
  modules: Module[];
  certificates: number;
  deadline: string;
  nextLesson: string;
}

const EnrolledCoursesPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  // Initialize animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  // Set timeout to remove loading screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get('http://localhost:8000/api/courses/enrolled', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: (status) => status < 500
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        setCourses(response.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          const errorMessage = (err.response?.data as { message?: string })?.message || err.message;
          setError(errorMessage);
          console.error('Fetch error:', err);
        } else if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
    fetchEnrolledCourses();
  }, [navigate, token]);

  // Filter courses based on active filter and search query
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'in-progress' && course.progress > 0 && course.progress < 100) ||
      (activeFilter === 'completed' && course.progress === 100) ||
      (activeFilter === 'new' && course.progress === 0);

    return matchesSearch && matchesFilter;
  });

  // Get the most recently accessed course for "Continue Learning"
  const continueLearning = courses.reduce((prev, current) =>
    (new Date(prev.lastAccessed) > new Date(current.lastAccessed) ? prev : current), 
    courses[0]
  );

  // Toggle course expansion
  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
        <div className="animate-pulse flex flex-col items-center">
          <FaGraduationCap className="text-orange-500 text-4xl mb-4 animate-bounce" />
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-[progress_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
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
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      {/* Header */}
      <header className="bg-[#1D1D1D] p-4 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold text-lg">My Learning</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <FiSearch className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Search and Filter Section */}
        <section className="mb-6" data-aos="fade-down">
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your courses..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto pb-2 space-x-2">
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
        </section>

        {/* Continue Learning Section */}
        {filteredCourses.length > 0 && continueLearning && (
          <section className="mb-8" data-aos="fade-up">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FiPlay className="mr-2 text-orange-500" />
              Continue Learning
            </h2>
            <div
              className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 shadow-lg border border-gray-700 cursor-pointer transform hover:scale-[1.01] transition-transform"
              onClick={() => navigate(`/CourseContent`)}
            >
              <div className="flex items-start">
                <img
                  src={continueLearning.image || continueLearning.thumbnail}
                  alt={continueLearning.title}
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{continueLearning.title}</h3>
                      <p className="text-gray-400 text-sm">{continueLearning.instructor}</p>
                    </div>
                    <span className="bg-gray-700 text-orange-400 text-xs px-3 py-1 rounded-full">
                      {continueLearning.category}
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-300 h-2.5 rounded-full"
                      style={{ width: `${continueLearning.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-300">
                        <FiClock className="mr-1" />
                        {continueLearning.duration}
                      </span>
                      <span className="flex items-center text-gray-300">
                        <FiUsers className="mr-1" />
                        {/* {continueLearning.students.toLocaleString()} */}
                      </span>
                      <span className="flex items-center text-gray-300">
                        <FiStar className="text-yellow-400 mr-1" />
                        {continueLearning.rating}
                      </span>
                    </div>

                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/CourseContent")
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Courses</h2>
            <span className="text-orange-500 text-sm">
              {filteredCourses.length} of {courses.length} courses
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No courses match your filters</div>
              <button
                className="text-orange-500 hover:text-orange-400 font-medium"
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
                    <img
                      src={course.image || course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold">{course.title}</h3>
                          <p className="text-gray-400 text-sm">{course.instructor}</p>
                        </div>
                        <div className="flex space-x-2">
                          {course.certificates > 0 && (
                            <span className="bg-amber-900/50 text-amber-300 text-xs px-2 py-1 rounded-full flex items-center">
                              <FiAward className="mr-1" /> Certificate
                            </span>
                          )}
                          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-700 rounded-full h-2 my-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-amber-300 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">
                          {course.progress}% complete • Last accessed: {course.lastAccessed}
                        </span>
                        <FiChevronRight className={`text-gray-500 transition-transform ${expandedCourse === course._id ? 'transform rotate-90' : ''
                          }`} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Course Content */}
                  {expandedCourse === course._id && (
                    <div className="border-t border-gray-700 p-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex items-center text-gray-400 text-sm mb-1">
                            <FiBarChart2 className="mr-2" /> Progress
                          </div>
                          <div className="font-bold text-lg">{course.progress}%</div>
                        </div>

                        <div className="bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex items-center text-gray-400 text-sm mb-1">
                            <FiCalendar className="mr-2" /> Deadline
                          </div>
                          <div className="font-bold text-lg">{formatDate(course.deadline)}</div>
                        </div>

                        <div className="bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex items-center text-gray-400 text-sm mb-1">
                            <FiClock className="mr-2" /> Time Remaining
                          </div>
                          <div className="font-bold text-lg">
                            {Math.ceil((new Date(course.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold mb-3 flex items-center">
                        <FiBook className="mr-2 text-orange-500" />
                        Course Content
                      </h4>
                      <div className="space-y-2 mb-4">
                        {course.modules?.map((module) => (
                          <div
                            key={module.id}
                            className={`flex items-center p-3 rounded-lg ${module.completed ? 'bg-gray-700/30' : 'hover:bg-gray-700/50'
                              } cursor-pointer`}
                            onClick={() => navigate("/CourseContent")}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${module.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
                              }`}>
                              {module.completed ? <FaRegCheckCircle /> : <FaRegCircle />}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{module.name}</div>
                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                <FiClock className="mr-1" />
                                <span className="mr-3">{module.duration}</span>
                                <FiDownload className="mr-1" />
                                <span>{module.resources} resources</span>
                              </div>
                            </div>
                            <FiChevronRight className="text-gray-500" />
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-3">
                        <button
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex-1 text-center"
                          onClick={() => navigate("/CourseContent")}
                        >
                          Continue Learning
                        </button>
                        <button
                          className="border border-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex-1 text-center"
                          onClick={() => navigate("/CourseContent")}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] flex justify-around py-3 border-t border-gray-800 z-10">
        <Link
          to="/home"
          className="flex flex-col items-center p-2 text-gray-400 hover:text-white"
        >
          <FiHome className="text-xl" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/courses"
          className="flex flex-col items-center p-2 text-orange-500"
        >
          <FiBook className="text-xl" />
          <span className="text-xs mt-1">My Courses</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center p-2 text-gray-400 hover:text-white"
        >
          <FiUser className="text-xl" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default EnrolledCoursesPage;