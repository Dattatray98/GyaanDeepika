import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBookmark, FiUsers, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import Loading from "../../components/Common/Loading.tsx";
import type { UserData, Course, Announcement } from '../../components/Common/Types.ts';
import Sidebar from '../../components/Common/SideBar.tsx';
import FetchHomepageData from '../../hooks/FetchHomepageData.ts';

const DeskTopView = () => {
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
  const [, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();


 FetchHomepageData({
  setLoading,
  setError,
  setUserData,
  setEnrolledCourses,
  setRecommendedCourses,
  setAnnouncements
});

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
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-gray-900 text-white min-h-screen flex"
    >
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        enrolledCourses={enrolledCourses}
      />

      <main className="flex-1 p-8">
        <motion.header
          className="flex justify-between items-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative w-1/3"
            whileHover={{ scale: 1.02 }}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
                Search
              </button>
            </form>
            {showSearchResults && (
              <motion.div
                className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <motion.div
                      key={result._id}
                      className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
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
                    </motion.div>
                  ))
                ) : (
                  <div className="p-3 text-gray-400 text-center">No results found</div>
                )}
              </motion.div>
            )}
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={tap}
            >
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={tap}
            >
              <Link to="/ProfilePage" className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                {userData?.firstName?.charAt(0) || 'U'}
              </Link>
            </motion.div>
          </div>
        </motion.header>

        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userData?.firstName || 'User'}!</h2>
          <p className="text-gray-400">Continue where you left off</p>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={slideUp}
            className="lg:col-span-2 bg-gray-800 rounded-xl p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Your Courses</h3>
              <Link to="/EnrolledCoursesPage" className="text-orange-500">View All</Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    className="flex items-center bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={tap}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/CourseContent/${course._id}/content`)}
                  >
                    <motion.img
                      src={course.thumbnail || '/default-course.jpg'}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                      whileHover={{ rotate: 2 }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <span className="text-sm text-gray-400">{course.totalProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                        <motion.div
                          className="bg-orange-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${course.totalProgress || 0}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                      {course.content?.[0]?.content?.[0] && (
                        <p className="text-sm text-gray-400">Next: {course.content[0].content[0].title}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="bg-gray-700 rounded-lg p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-400 mb-4">You haven't enrolled in any courses yet</p>
                <Link
                  to="/BrowseCousre"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg inline-block"
                >
                  Browse Courses
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={slideUp}
            className="bg-gray-800 rounded-xl p-6"
            whileHover={{ rotate: 1 }}
          >
            <h3 className="text-xl font-bold mb-6">Announcements</h3>
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement, index) => (
                  <motion.div
                    key={announcement._id}
                    className="pb-4 border-b border-gray-700 last:border-0 last:pb-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4 className="font-medium mb-1">{announcement.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{announcement.content}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(announcement.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-400">No announcements available</p>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        <motion.section
          className="bg-gray-800 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recommended For You</h3>
            <Link to="/BrowseCousre" className="text-orange-500">Browse All</Link>
          </div>

          {recommendedCourses.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {recommendedCourses.slice(0, 4).map((course, index) => (
                <motion.div
                  key={course._id}
                  variants={slideUp}
                  className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => navigate(`/BrowseCousre`)}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                  }}
                  whileTap={tap}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.img
                    src={course.thumbnail || '/default-course.jpg'}
                    alt={course.title}
                    className="w-full h-32 object-cover"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <motion.span
                        className="bg-gray-600 text-orange-400 text-xs px-2 py-1 rounded-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        {course.category || 'General'}
                      </motion.span>
                      <motion.button
                        className="text-gray-400 hover:text-orange-500"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiBookmark />
                      </motion.button>
                    </div>
                    <h4 className="font-medium mb-2">{course.title}</h4>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span className="flex items-center">
                        <FiUsers className="mr-1" />
                        {course.totalStudents || 0}
                      </span>
                      <span className="flex items-center">
                        <FiStar className="text-yellow-400 mr-1" />
                        {course.rating || 'N/A'}
                      </span>
                      <span>{course.duration || 'N/A'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-gray-700 rounded-lg p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400">No recommended courses available</p>
            </motion.div>
          )}
        </motion.section>
      </main>
    </motion.div>
  );
}
export default DeskTopView
