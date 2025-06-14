import CourseBlock from "./CourseBlock";
import ProfileBlock from "./ProfileBlock";
import { FiHome, FiCompass, FiBook, FiUser, FiSettings } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { darkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mobile View
  const MobileView = () => (
    <div className={`min-h-screen pb-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 sticky top-0 z-10 ${darkMode ? 'bg-[#1D1D1D]' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold">GyaanDeepika</h1>
          </div>

          <nav className={`rounded-xl ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>
            {[
              { icon: <FiSettings />, value: 'settings', path: "/SettingsPage" }
            ].map(tab => (
              <button
                key={tab.value}
                className={`flex items-center ${
                  activeTab === tab.value 
                    ? darkMode ? 'bg-gray-800 text-orange-500' : 'bg-gray-100 text-orange-500'
                    : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveTab(tab.value);
                  navigate(tab.path);
                }}
              >
                <span className="mr-3">{tab.icon}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <ProfileBlock />
          <CourseBlock />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 flex justify-around py-3 ${darkMode ? 'bg-[#1D1D1D]' : 'bg-white border-t'}`}>
        {[
          { icon: <FiHome />, label: 'Home', value: 'home', path: "/" },
          { icon: <FiCompass />, label: 'Discover', value: 'discover', path: "/BrowseCourses" },
          { icon: <FiBook />, label: 'Learning', value: 'learning', path: "/LearningPage" },
          { icon: <FiUser />, label: 'Profile', value: 'profile', path: "/profile" }
        ].map(tab => (
          <button
            key={tab.value}
            className={`flex flex-col items-center p-2 ${activeTab === tab.value ? 'text-orange-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            onClick={() => {
              setActiveTab(tab.value);
              navigate(tab.path);
            }}
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
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`w-64 p-6 sticky top-0 h-screen ${darkMode ? 'bg-[#1D1D1D]' : 'bg-white shadow'}`}>
        <div className="flex items-center mb-8">
          <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
          <h1 className="font-bold text-xl">GyaanDeepika</h1>
        </div>

        <nav className="space-y-1 mb-8">
          {[
            { icon: <FiHome />, label: 'Home', value: 'home', path: "/Home" },
            { icon: <FiCompass />, label: 'Discover', value: 'discover', path: "/BrowseCourses" },
            { icon: <FiBook />, label: 'My Learning', value: 'learning', path: "/LearningPage" },
            { icon: <FiUser />, label: 'Profile', value: 'profile', path: "/profile" },
          ].map(tab => (
            <button
              key={tab.value}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeTab === tab.value 
                  ? darkMode ? 'bg-gray-800 text-orange-500' : 'bg-gray-100 text-orange-500'
                  : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => {
                setActiveTab(tab.value);
                navigate(tab.path);
              }}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileBlock />
          <CourseBlock />
          <nav className={`rounded-xl p-1 w-[14vh] ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
            {[
              { icon: <FiSettings />, label: 'Settings', value: 'settings', path: "/SettingsPage" }
            ].map(tab => (
              <button
                key={tab.value}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === tab.value 
                    ? darkMode ? 'bg-gray-800 text-orange-500' : 'bg-gray-100 text-orange-500'
                    : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveTab(tab.value);
                  navigate(tab.path);
                }}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default Profile;