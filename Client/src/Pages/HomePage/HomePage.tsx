import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBookmark, FiUsers, FiStar, FiHome, FiCompass, FiBook, FiUser, FiBell } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <div className="bg-gray-900 text-white min-h-screen pb-16">
      {/* Header */}
      <header className="bg-[#1D1D1D] p-4 sticky top-0 z-10">
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
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, User!</h2>
          <p className="text-gray-400">Continue your learning journey</p>
        </section>

        {/* Enrolled Courses */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Your Courses</h3>
            <Link to="/courses" className="text-orange-500 text-sm">View All</Link>
          </div>
          
          <div className="space-y-4">
            {enrolledCourses.map(course => (
              <div key={course.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{course.category}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">Next: {course.nextLesson}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Courses */}
        <section className="mb-8">
          <h3 className="font-bold mb-4">Recommended For You</h3>
          <div className="grid grid-cols-2 gap-3">
            {recommendedCourses.map(course => (
              <div 
                key={course.id} 
                className="bg-gray-800 rounded-lg overflow-hidden"
                onClick={() => navigate(`/courses/${course.id}`)}
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
              </div>
            ))}
          </div>
        </section>

        {/* Announcements */}
        <section>
          <h3 className="font-bold mb-4">Announcements</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-gray-700 last:border-0">
                <h4 className="font-medium">{announcement.title}</h4>
                <p className="text-gray-400 text-sm mb-1">{announcement.content}</p>
                <p className="text-gray-500 text-xs">{announcement.date}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] flex justify-around py-3">
        {[
          { icon: <FiHome />, label: 'Home', value: 'home' },
          { icon: <FiCompass />, label: 'Discover', value: 'discover' },
          { icon: <FiBook />, label: 'Learning', value: 'learning' },
          { icon: <FiUser />, label: 'Profile', value: 'profile' }
        ].map(tab => (
          <button
            key={tab.value}
            className={`flex flex-col items-center p-2 ${activeTab === tab.value ? 'text-orange-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  // Desktop View
  const DesktopView = () => (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D1D1D] p-6 sticky top-0 h-screen">
        <div className="flex items-center mb-8">
          <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
          <h1 className="font-bold text-xl">GyaanDeepika</h1>
        </div>

        <nav className="space-y-1 mb-8">
          {[
            { icon: <FiHome />, label: 'Home', value: 'home' },
            { icon: <FiCompass />, label: 'Discover', value: 'discover' },
            { icon: <FiBook />, label: 'My Learning', value: 'learning' }
          ].map(tab => (
            <button
              key={tab.value}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === tab.value ? 'bg-gray-800 text-orange-500' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => setActiveTab(tab.value)}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-gray-400 text-sm font-medium mb-3">YOUR COURSES</h3>
          <div className="space-y-2">
            {enrolledCourses.map(course => (
              <div 
                key={course.id}
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
              >
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-8 h-8 rounded-md object-cover mr-3"
                />
                <span className="text-sm">{course.title}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <FiBell className="text-xl text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-orange-500"></div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, User!</h2>
          <p className="text-gray-400">Continue where you left off</p>
        </section>

        {/* Progress Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Your Courses</h3>
              <Link to="/courses" className="text-orange-500">View All</Link>
            </div>
            
            <div className="space-y-4">
              {enrolledCourses.map(course => (
                <div key={course.id} className="flex items-center bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{course.title}</h4>
                      <span className="text-sm text-gray-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400">Next: {course.nextLesson}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">Announcements</h3>
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className="pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                  <h4 className="font-medium mb-1">{announcement.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{announcement.content}</p>
                  <p className="text-gray-500 text-xs">{announcement.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Courses */}
        <section className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recommended For You</h3>
            <Link to="/courses" className="text-orange-500">Browse All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map(course => (
              <div 
                key={course.id}
                className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-600 text-orange-400 text-xs px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                    <button className="text-gray-400 hover:text-orange-500">
                      <FiBookmark />
                    </button>
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
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default HomePage;