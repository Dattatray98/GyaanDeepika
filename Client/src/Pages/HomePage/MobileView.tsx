import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUsers, FiStar, FiX } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Loading from "../../components/Common/Loading.tsx";
import type { UserData, Course, Announcement } from '../../components/Common/Types.ts';
import BottomNavigation from '../../components/Common/BottomNavigation.tsx';
import FetchHomepageData from '../../hooks/FetchHomepageData.ts';

const MobileView = () => {
  const [, setIsMobile] = useState(window.innerWidth < 768);
  const [] = useState('home');
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

 FetchHomepageData({
  setLoading,
  setError,
  setUserData,
  setEnrolledCourses,
  setRecommendedCourses,
  setAnnouncements
});

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(query); 

    if (!trimmedQuery) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setShowSearchResults(false);
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${api}/api/courses/search?query=${trimmedQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

     
      const results = Array.isArray(response.data?.data) ? response.data.data : [];

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('❌ Error searching courses:', err);
      setSearchResults([]);
      setShowSearchResults(false);
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
      navigate(`/BrowseCourse/${courseId}`); 
    }

    setShowSearchResults(false);

  
    try {
      setShowMobileSearch(false);
    } catch (e) {
      console.warn('setShowMobileSearch not initialized');
    }
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
            <Link to="/EnrolledCoursesPage" className="text-orange-500 text-sm">View All</Link>
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

      <BottomNavigation />

    </motion.div>
  );
};

export default MobileView
