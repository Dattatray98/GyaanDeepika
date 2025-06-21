import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUsers, FiStar, FiHome, FiCompass, FiBook, FiUser, FiBell, FiX } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Loading from "../../components/Common/Loading.tsx";
import type { UserData, Course, Announcement } from '../../components/Common/Types.ts';

const MobileView = () => {
  const [, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');
const api = import.meta.env.VITE_API_URL;
        // 1. Fetch user data
        const userResponse = await axios.get<UserData>(`${api}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        });
        if (!isMounted) return;
        setUserData(userResponse.data);

        // 2. Fetch enrolled courses
        const enrolledResponse = await axios.get(`${api}/api/enrolled/enrolled`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
        });
        if (!isMounted) return;

        const enrolledCoursesData = Array.isArray(enrolledResponse.data?.courses)
          ? enrolledResponse.data.courses
          : [];

        const progressMap = userResponse.data?.progress || {};
        const coursesWithProgress = enrolledCoursesData.map((course: any) => ({
          ...course,
          totalProgress: progressMap[course._id]?.completionPercentage ?? 0,
        }));
        setEnrolledCourses(coursesWithProgress);

        // 3. Fetch recommended courses
        const recommendedResponse = await axios.get<{ courses: Course[] }>(
          `${api}/api/courses/unenrolled`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: abortController.signal,
          }
        );
        if (isMounted) setRecommendedCourses(recommendedResponse.data?.courses || []);

        // 4. Fetch announcements
        let allAnnouncements: Announcement[] = [];
        if (enrolledCoursesData.length > 0) {
          const announcementsPromises = enrolledCoursesData.map((course: any) =>
            axios
              .get<{ announcements: Announcement[] }>(
                `${api}/api/enrolled/${course._id}/content`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  signal: abortController.signal,
                }
              )
              .catch((err) => {
                console.warn(`Failed to fetch announcements for course ${course._id}`, err);
                return { data: { announcements: [] } };
              })
          );

          const announcementsResponses = await Promise.all(announcementsPromises);
          allAnnouncements = announcementsResponses.flatMap(
            (res) => res.data?.announcements || []
          );
          if (isMounted) setAnnouncements(allAnnouncements);
        }

      } catch (err) {
        if (!isMounted || axios.isCancel(err)) return;

        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : err instanceof Error
            ? err.message
            : 'Failed to load data';

        console.error('Fetch error:', err);
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await axios.get<Course[]>(
        `${api}/api/courses/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Error searching courses:', err);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleCourseClick = (courseId: string) => {
    const isEnrolled = enrolledCourses.some(course => course._id === courseId);
    if (isEnrolled) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate(`/BrowseCousre/${courseId}`);
    }
    setShowSearchResults(false);
    setShowMobileSearch(false);
  };

  // Animation variants
  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardHover = {
    scale: 1.03,
    transition: { duration: 0.3 }
  };

  const tap = {
    scale: 0.98
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F] text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Error Loading Data</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const MobileSearchBar = () => (
    <motion.div
      className="fixed top-0 left-0 right-0 bg-[#1D1D1D] p-4 z-20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
    >
      <div className="flex items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
              >
                <FiX />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </form>
        <button
          className="ml-2 text-gray-400 hover:text-white"
          onClick={() => setShowMobileSearch(false)}
        >
          <FiX size={24} />
        </button>
      </div>

      {showSearchResults && (
        <div className="mt-2 bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result._id}
                className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                onClick={() => handleCourseClick(result._id)}
              >
                <div className="flex items-center">
                  <img
                    src={result.thumbnail || '/default-course.jpg'}
                    alt={result.title}
                    className="w-10 h-10 rounded-md object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{result.title}</h4>
                    <p className="text-gray-400 text-sm">{result.category || 'General'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-400 text-center">No results found</div>
          )}
        </div>
      )}
    </motion.div>
  );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="bg-gray-900 text-white min-h-screen pb-16 relative"
        >
            {showMobileSearch && <MobileSearchBar />}

            <motion.header
                variants={slideUp}
                className={`bg-[#1D1D1D] p-4 sticky top-0 z-10 ${showMobileSearch ? 'hidden' : ''}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
                        <h1 className="font-bold">GyaanDeepika</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setShowMobileSearch(true)}>
                            <FiSearch className="text-xl" />
                        </button>
                        <FiBell className="text-xl" />
                    </div>
                </div>
            </motion.header>

            <main className={`p-4 ${showMobileSearch ? 'mt-16' : ''}`}>
                <motion.section variants={slideUp} className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                        Welcome back, {userData?.firstName || 'User'}!
                    </h2>
                    <p className="text-gray-400">Continue your learning journey</p>
                </motion.section>

                <motion.section variants={slideUp} className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Your Courses</h3>
                        <Link to="/courses" className="text-orange-500 text-sm">View All</Link>
                    </div>

                    {enrolledCourses.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            {enrolledCourses.map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    variants={slideUp}
                                    whileHover={{ y: -5 }}
                                    whileTap={tap}
                                    className="bg-gray-800 rounded-lg p-4"
                                    onClick={() => navigate(`/courses/${course._id}`)}
                                >
                                    <div className="flex items-start">
                                        <motion.img
                                            src={course.thumbnail || '/default-course.jpg'}
                                            alt={course.title}
                                            className="w-16 h-16 rounded-lg object-cover mr-4"
                                            whileHover={{ scale: 1.05 }}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{course.title}</h4>
                                            <p className="text-gray-400 text-sm mb-2">{course.category || 'General'}</p>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                                <motion.div
                                                    className="bg-orange-500 h-2 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${course.totalProgress || 0}%` }}
                                                    transition={{ duration: 1, delay: index * 0.2 }}
                                                />
                                            </div>
                                            {course.content?.[0]?.content?.[0] && (
                                                <p className="text-xs text-gray-400">Next: {course.content[0].content[0].title}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={slideUp}
                            className="bg-gray-800 rounded-lg p-4 text-center"
                        >
                            <p className="text-gray-400">You haven't enrolled in any courses yet</p>
                            <Link to="/BrowseCousre" className="text-orange-500 text-sm mt-2 inline-block">
                                Browse Courses
                            </Link>
                        </motion.div>
                    )}
                </motion.section>

                <motion.section variants={slideUp} className="mb-8">
                    <h3 className="font-bold mb-4">Recommended For You</h3>
                    {recommendedCourses.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 gap-3"
                        >
                            {recommendedCourses.slice(0, 4).map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    variants={slideUp}
                                    whileHover={cardHover}
                                    whileTap={tap}
                                    className="bg-gray-800 rounded-lg overflow-hidden"
                                    onClick={() => navigate(`/BrowseCousre/${course._id}`)}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <img
                                        src={course.thumbnail || '/default-course.jpg'}
                                        alt={course.title}
                                        className="w-full h-20 object-cover"
                                    />
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm mb-1">{course.title}</h4>
                                        <div className="flex items-center text-xs text-gray-400 mb-1">
                                            <FiUsers className="mr-1" />
                                            <span>{course.totalStudents || 0}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <FiStar className="text-yellow-400 mr-1" />
                                            <span>{course.rating || 'N/A'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={slideUp}
                            className="bg-gray-800 rounded-lg p-4 text-center"
                        >
                            <p className="text-gray-400">No recommended courses available</p>
                        </motion.div>
                    )}
                </motion.section>

                <motion.section variants={slideUp}>
                    <h3 className="font-bold mb-4">Announcements</h3>
                    {announcements.length > 0 ? (
                        <motion.div
                            className="bg-gray-800 rounded-lg p-4"
                            whileHover={{ scale: 1.01 }}
                        >
                            {announcements.slice(0, 2).map((announcement, index) => (
                                <motion.div
                                    key={announcement._id}
                                    className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-gray-700 last:border-0"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <h4 className="font-medium">{announcement.title}</h4>
                                    <p className="text-gray-400 text-sm mb-1">{announcement.content}</p>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(announcement.date).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="bg-gray-800 rounded-lg p-4 text-center"
                            variants={slideUp}
                        >
                            <p className="text-gray-400">No announcements available</p>
                        </motion.div>
                    )}
                </motion.section>
            </main>

            <motion.nav
                className={`fixed bottom-0 left-0 right-0 bg-[#1D1D1D] flex justify-around py-3 ${showMobileSearch ? 'hidden' : ''}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {[
                    { icon: <FiHome />, label: 'Home', value: 'home' },
                    { icon: <FiCompass />, label: 'Discover', value: 'discover' },
                    { icon: <FiBook />, label: 'Learning', value: 'learning' },
                    { icon: <FiUser />, label: 'Profile', value: 'profile' }
                ].map(tab => (
                    <motion.button
                        key={tab.value}
                        className={`flex flex-col items-center p-2 ${activeTab === tab.value ? 'text-orange-500' : 'text-gray-400'}`}
                        onClick={() => setActiveTab(tab.value)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tab.icon}
                        <span className="text-xs mt-1">{tab.label}</span>
                    </motion.button>
                ))}
            </motion.nav>
        </motion.div>
    );
};

export default MobileView
