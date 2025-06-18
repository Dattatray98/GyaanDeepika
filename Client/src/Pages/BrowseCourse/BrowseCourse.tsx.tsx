import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiSearch, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import Footer from '../LandingPage/Footer';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  price: string;
  category: string;
}

const BrowseCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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
  }, [navigate]);

  useEffect(() => {
    const fetchUnenrolledCourses = async () => {
      try {

        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get('http://localhost:8000/api/courses/unenrolled', {
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
        }
      }
    };

    fetchUnenrolledCourses();
  }, [navigate]);

  const handleEnroll = async (courseId: string) => {
    try {

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/courses/enroll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Successfully enrolled!");
        // 👇 Redirect to the course content page
        navigate(`/courses/${courseId}/content`);
      } else {
        alert("Enrollment failed.");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong during enrollment.");
    }
  };

  const categories = ['All', 'Programming', 'Design', 'Business', 'Language', 'Other'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
        <motion.div
          className="animate-pulse flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaGraduationCap className="text-orange-500 text-4xl mb-4" />
          </motion.div>
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </div>
          <motion.p
            className="mt-4 text-gray-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Courses...
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
            <div className="flex flex-wrap justify-center gap-3 mb-8">
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
                      <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                        ${course.price || 'Free'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>Instructor: {course.instructor || 'Staff'}</span>
                      </div>
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
