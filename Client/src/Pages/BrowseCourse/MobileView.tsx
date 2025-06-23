import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiSearch, FiClock } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import Footer from '../LandingPage/Footer.tsx';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.tsx';
import Loading from '../../components/Common/Loading.tsx';
import type { Course } from '../../components/Common/Types.ts';
import { fetchUnenrolledCourses } from '../../hooks/FetchBrowseCourses.ts';

const MobileView = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [error, setError] = useState('');

  const { token } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
    });

    if (!token) {
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, token]);

  useEffect(() => {
    if (token) {
      fetchUnenrolledCourses({
        navigate,
        setCourses,
        setLoading,
        setError,
        token,
      });
    }
  }, [token]);

  const handleEnroll = async (courseId: string) => {
    try {
      if (!token) {
        alert("Please login first.");
        return;
      }

      const api = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${api}/api/courses/enroll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Successfully enrolled!");
        setCourses(prev => prev.filter(course => course._id !== courseId));
        navigate(`/EnrolledCoursesPage`);
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Something went wrong during enrollment';
      alert(errorMessage);
    }
  };

  const categories = ['All', 'Programming', 'Design', 'Business', 'Language', 'Other'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.subtitle && course.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      (course.category && course.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesLevel =
      selectedLevel === 'All' ||
      (course.level && course.level.toLowerCase() === selectedLevel.toLowerCase());

    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return <Loading />;
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
    <div className="bg-black text-white min-h-screen">
      <section className="relative bg-gradient-to-b from-gray-800 to-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Browse <span className="text-orange-500">Courses</span>
          </h1>
          <div className="max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-gray-800 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex overflow-x-auto pb-2 gap-2 mb-4 scrollbar-hide">
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300'
                    }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            <div className="flex overflow-x-auto pb-2 gap-2 mb-4 scrollbar-hide">
              {levels.map(level => (
                <motion.button
                  key={level}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLevel(level)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${selectedLevel === level
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300'
                    }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-700 text-orange-400 text-xs px-2 py-1 rounded-full">
                        {course.category || 'General'}
                      </span>
                      <span className="bg-gray-700 text-blue-300 text-xs px-2 py-1 rounded-full">
                        {course.level || 'Beginner'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {course.subtitle || course.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-5 h-5 rounded-full mr-1"
                        />
                        <span>{course.instructor.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FaGraduationCap className="mr-1" size={12} />
                        <span>{course.totalStudents || 0} students</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center">
                        <FiClock className="mr-1" size={12} />
                        <span>{course.duration || 'Flexible'}</span>
                      </div>
                      {course.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1 text-xs">★</span>
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm"
                    >
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" data-aos="fade-up">
              <h3 className="text-lg font-medium text-gray-300 mb-2">No courses found</h3>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="text-orange-400 text-sm"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4" data-aos="fade-up">
            Ready to start learning?
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-white text-orange-600 px-6 py-2 rounded-lg font-medium"
            onClick={() => navigate('/home')}
          >
            Go to Dashboard
          </motion.button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default MobileView
