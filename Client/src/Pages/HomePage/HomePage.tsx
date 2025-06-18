import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBookmark, FiUsers, FiStar, FiHome, FiCompass, FiBook, FiUser, FiBell } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(timer);
    };
  }, []);

  // Loading Screen
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
            Loading GyaanDeepika...
          </motion.p>
        </motion.div>
      </div>
    );
  }

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

  // Sample data
  const enrolledCourses = [
    {
      id: 1,
      title: "Mathematics Basics",
      progress: 65,
      category: "Education",
      nextLesson: "Algebra Fundamentals",
      image: "/math-course.jpg"
    },
    {
      id: 2,
      title: "Health & Hygiene",
      progress: 30,
      category: "Health",
      nextLesson: "Sanitation Practices",
      image: "/health-course.jpg"
    }
  ];

  const recommendedCourses = [
    {
      id: 3,
      title: "English Communication",
      students: 1842,
      rating: 4.7,
      duration: "6 weeks",
      category: "Language",
      image: "/english-course.jpg"
    },
    {
      id: 4,
      title: "Digital Literacy",
      students: 892,
      rating: 4.5,
      duration: "4 weeks",
      category: "Technology",
      image: "/digital-course.jpg"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "New Course Available",
      content: "Agricultural Techniques course now live!",
      date: "2 hours ago"
    },
    {
      id: 2,
      title: "Maintenance Notice",
      content: "System upgrade on Saturday 10AM-12PM",
      date: "1 day ago"
    }
  ];

  // Mobile View
  const MobileView = () => (
    <motion.div 
      initial="hidden"
      animate="visible"

      className="bg-gray-900 text-white min-h-screen pb-16"
    >
      {/* Header */}
      <motion.header 
        variants={slideUp}
        className="bg-[#1D1D1D] p-4 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold">GyaanDeepika</h1>
          </div>
          <div className="flex items-center space-x-4">
            <FiSearch className="text-xl" />
            <FiBell className="text-xl" />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-4">
        {/* Welcome Section */}
        <motion.section 
          variants={slideUp}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome back, User!</h2>
          <p className="text-gray-400">Continue your learning journey</p>
        </motion.section>

        {/* Enrolled Courses */}
        <motion.section 
          variants={slideUp}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Your Courses</h3>
            <Link to="/courses" className="text-orange-500 text-sm">View All</Link>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {enrolledCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                variants={slideUp}
                whileHover={{ y: -5 }}
                whileTap={tap}
                className="bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <motion.img 
                    src={course.image} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{course.category}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <motion.div 
                        className="bg-orange-500 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      ></motion.div>
                    </div>
                    <p className="text-xs text-gray-400">Next: {course.nextLesson}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Recommended Courses */}
        <motion.section 
          variants={slideUp}
          className="mb-8"
        >
          <h3 className="font-bold mb-4">Recommended For You</h3>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {recommendedCourses.map((course, index) => (
              <motion.div 
                key={course.id} 
                variants={slideUp}
                whileHover={cardHover}
                whileTap={tap}
                className="bg-gray-800 rounded-lg overflow-hidden"
                onClick={() => navigate(`/courses/${course.id}`)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-20 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1">{course.title}</h4>
                  <div className="flex items-center text-xs text-gray-400 mb-1">
                    <FiUsers className="mr-1" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Announcements */}
        <motion.section
          variants={slideUp}
        >
          <h3 className="font-bold mb-4">Announcements</h3>
          <motion.div 
            className="bg-gray-800 rounded-lg p-4"
            whileHover={{ scale: 1.01 }}
          >
            {announcements.map((announcement, index) => (
              <motion.div 
                key={announcement.id} 
                className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-gray-700 last:border-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-medium">{announcement.title}</h4>
                <p className="text-gray-400 text-sm mb-1">{announcement.content}</p>
                <p className="text-gray-500 text-xs">{announcement.date}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] flex justify-around py-3"
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

  // Desktop View
  const DesktopView = () => (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="bg-gray-900 text-white min-h-screen flex"
    >
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-[#1D1D1D] p-6 sticky top-0 h-screen"
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
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: <FiHome />, label: 'Home', value: 'home', path:"/home" },
            { icon: <FiCompass />, label: 'Discover', value: 'discover', path:"/BrowseCousre" },
            { icon: <FiBook />, label: 'My Learning', value: 'learning', path:"/VideoPlayerPage" },
            { icon: <FiBook />, label: 'Upload', value: 'learning', path:"/VideoUploadPage" }
          ].map((tab, index) => (
            <motion.button
              key={tab.value}
              variants={slideUp}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === tab.value ? 'bg-gray-800 text-orange-500' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => {
                setActiveTab(tab.value);
                navigate(tab.path);
              }}
              whileHover={{ x: 5 }}
              whileTap={tap}
              transition={{ delay: index * 0.1 }}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.nav>

        <motion.div 
          className="border-t border-gray-700 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-gray-400 text-sm font-medium mb-3">YOUR COURSES</h3>
          <div className="space-y-2">
            {enrolledCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                whileHover={{ x: 5 }}
                whileTap={tap}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <motion.img 
                  src={course.image} 
                  alt={course.title}
                  className="w-8 h-8 rounded-md object-cover mr-3"
                  whileHover={{ rotate: 5 }}
                />
                <span className="text-sm">{course.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
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
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <motion.input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              whileFocus={{ scale: 1.03 }}
            />
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={tap}
            >
              <FiBell className="text-xl text-gray-400 hover:text-white cursor-pointer" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={tap}
            >
              <Link to="/ProfilePage" className="w-8 h-8 rounded-full bg-orange-500 block"></Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Welcome Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, User!</h2>
          <p className="text-gray-400">Continue where you left off</p>
        </motion.section>

        {/* Progress Section */}
        <motion.section 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Enrolled Courses */}
          <motion.div 
            variants={slideUp}
            className="lg:col-span-2 bg-gray-800 rounded-xl p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Your Courses</h3>
              <Link to="/EnrolledCoursesPage" className="text-orange-500">View All</Link>
            </div>
            
            <div className="space-y-4">
              {enrolledCourses.map((course, index) => (
                <motion.div 
                  key={course.id} 
                  className="flex items-center bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={tap}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.img 
                    src={course.image} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                    whileHover={{ rotate: 2 }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{course.title}</h4>
                      <span className="text-sm text-gray-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                      <motion.div 
                        className="bg-orange-500 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      ></motion.div>
                    </div>
                    <p className="text-sm text-gray-400">Next: {course.nextLesson}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div 
            variants={slideUp}
            className="bg-gray-800 rounded-xl p-6"
            whileHover={{ rotate: 1 }}
          >
            <h3 className="text-xl font-bold mb-6">Announcements</h3>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <motion.div 
                  key={announcement.id} 
                  className="pb-4 border-b border-gray-700 last:border-0 last:pb-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-medium mb-1">{announcement.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{announcement.content}</p>
                  <p className="text-gray-500 text-xs">{announcement.date}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Recommended Courses */}
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
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {recommendedCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                variants={slideUp}
                className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
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
                  src={course.image} 
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
                      {course.category}
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
                      {course.students}
                    </span>
                    <span className="flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      {course.rating}
                    </span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
    </motion.div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default HomePage;