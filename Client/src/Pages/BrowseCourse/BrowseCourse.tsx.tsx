import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiSearch, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import Footer from '../LandingPage/Footer.tsx';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.tsx';
import Loading from '../../components/Common/Loading.tsx';
import type { Course } from '../../components/Common/Types.ts';

const BrowseCourses = () => {
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
    const fetchUnenrolledCourses = async () => {
      try {
        setLoading(true);
        if (!token) {
          throw new Error('Authentication required');
        }
        const api = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${api}/api/courses/unenrolled`, {
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

        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch courses');
        }

        // Transform the data to match our interface
        const formattedCourses = response.data.data.map((course: any) => ({
          _id: course._id,
          title: course.title,
          description: course.description,
          subtitle: course.subtitle,
          thumbnail: course.thumbnail,
          instructor: {
            _id: course.instructor._id,
            name: course.instructor.name,
            avatar: course.instructor.avatar
          },
          price: course.price,
          category: course.category,
          level: course.level,
          duration: course.duration,
          rating: course.rating,
          totalStudents: course.totalStudents
        }));

        setCourses(formattedCourses);
        setError('');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch courses';
          setError(errorMessage);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUnenrolledCourses();
  }, [navigate, token]);

  const handleEnroll = async (courseId: string) => {
    try {
      if (!token) {
        alert("Please login first.");
        return;
      }

      if (!courseId) {
        console.log("course id not found ")
      }
      else {
        console.log("course id found ", courseId)
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
        // Remove the enrolled course from the list
        setCourses(prev => prev.filter(course => course._id !== courseId));
        navigate(`/EnrolledCourses`);
      } else {
        alert("Enrollment failed.");
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
    return (<Loading />);
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
      <section className="relative bg-gradient-to-b from-gray-800 to-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6" data-aos="fade-up">
            Browse <span className="text-orange-500">Courses</span>
          </h1>
          <div className="max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-gray-800 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {levels.map(level => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedLevel === level
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/400x225'}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-700 text-orange-400 text-xs px-3 py-1 rounded-full">
                        {course.category || 'General'}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full mb-1">
                          {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                        </span>
                        <span className="bg-gray-700 text-blue-300 text-xs px-3 py-1 rounded-full">
                          {course.level || 'Beginner'}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {course.subtitle || course.description}
                    </p>
                    <div className="flex flex-wrap justify-between text-sm text-gray-400 mb-4 gap-2">
                      <div className="flex items-center">
                        <img
                          src={course.instructor.avatar || 'https://via.placeholder.com/150'}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span>{course.instructor.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FaGraduationCap className="mr-1" />
                        <span>{course.totalStudents || 0} students</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>{course.duration || 'Flexible'}</span>
                      </div>
                      {course.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      Enroll Now <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-aos="fade-up">
              <h3 className="text-xl font-medium text-gray-300 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search or check back later</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="mt-4 text-orange-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" data-aos="fade-up">
            Ready to start learning?
          </h2>
          <p className="text-orange-100 mb-8" data-aos="fade-up" data-aos-delay="100">
            Join thousands of students advancing their skills
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </motion.button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrowseCourses;