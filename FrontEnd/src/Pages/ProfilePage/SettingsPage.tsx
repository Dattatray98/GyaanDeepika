import { Link } from "react-router-dom";
import { FiHome, FiCompass, FiBook, FiUser, FiSettings, FiSun, FiMoon, FiLogOut, FiLock, FiBell, FiHelpCircle } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext'; // Make sure this path is correct

const SettingsPage = () => {
  const { darkMode, toggleTheme } = useTheme(); // Using context instead of local state
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/auth/login");
  };

  // Mobile View - Maintained your exact UI structure
  const MobileView = () => (
    <div className={`min-h-screen pb-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`p-4 sticky top-0 z-10 ${darkMode ? 'bg-[#1D1D1D]' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'} p-6 mb-4`}>
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          
          <div className="space-y-5">
            {/* Theme Toggle - Now using context */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {darkMode ? (
                  <FiMoon className="text-orange-500 mr-3" />
                ) : (
                  <FiSun className="text-orange-500 mr-3" />
                )}
                <span>Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  darkMode ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Rest of your settings items remain exactly the same */}
            <Link to="/settings/notifications" className={`flex items-center justify-between ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2 rounded-lg`}>
              <div className="flex items-center">
                <FiBell className="text-gray-500 mr-3" />
                <span>Notifications</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link to="/settings/privacy" className={`flex items-center justify-between ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2 rounded-lg`}>
              <div className="flex items-center">
                <FiLock className="text-gray-500 mr-3" />
                <span>Privacy</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link to="/help" className={`flex items-center justify-between ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2 rounded-lg`}>
              <div className="flex items-center">
                <FiHelpCircle className="text-gray-500 mr-3" />
                <span>Help Center</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>
          </div>
        </div>

        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'} p-6`}>
          <h2 className="text-xl font-bold mb-6">More Options</h2>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center p-2 rounded-lg text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <FiLogOut className="mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation - Maintained your exact structure */}
      <nav className={`fixed bottom-0 left-0 right-0 flex justify-around py-3 ${darkMode ? 'bg-[#1D1D1D]' : 'bg-white border-t'}`}>
        {[
          { icon: <FiHome />, label: 'Home', value: 'home', path: "/" },
          { icon: <FiCompass />, label: 'Discover', value: 'discover', path: "/BrowseCourses" },
          { icon: <FiBook />, label: 'Learning', value: 'learning', path: "/LearningPage" },
          { icon: <FiUser />, label: 'Profile', value: 'profile', path: "/profile" },
          { icon: <FiSettings />, label: 'Settings', value: 'settings', path: "/settings" }
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

  // Desktop View - Maintained your exact UI structure
  const DesktopView = () => (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <aside className={`w-64 p-6 sticky top-0 h-screen ${darkMode ? 'bg-[#1D1D1D]' : 'bg-white shadow'}`}>
        <div className="flex items-center mb-8">
          <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
          <h1 className="font-bold text-xl">GyaanDeepika</h1>
        </div>

        <nav className="space-y-1 mb-8">
          {[
            { icon: <FiHome />, label: 'Home', value: 'home', path: "/" },
            { icon: <FiCompass />, label: 'Discover', value: 'discover', path: "/BrowseCourses" },
            { icon: <FiBook />, label: 'My Learning', value: 'learning', path: "/LearningPage" },
            { icon: <FiUser />, label: 'Profile', value: 'profile', path: "/profile" },
            { icon: <FiSettings />, label: 'Settings', value: 'settings', path: "/settings" }
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

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'} p-6 mb-6`}>
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Toggle - Now using context */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {darkMode ? (
                  <FiMoon className="text-orange-500 mr-3 text-lg" />
                ) : (
                  <FiSun className="text-orange-500 mr-3 text-lg" />
                )}
                <span className="font-medium">Appearance</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  darkMode ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Rest of your settings items remain exactly the same */}
            <Link 
              to="/settings/notifications" 
              className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <FiBell className="text-gray-500 mr-3" />
                <span>Notification Preferences</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link 
              to="/settings/privacy" 
              className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <FiLock className="text-gray-500 mr-3" />
                <span>Privacy Settings</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link 
              to="/help" 
              className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <div className="flex items-center">
                <FiHelpCircle className="text-gray-500 mr-3" />
                <span>Help Center</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>
          </div>
        </div>

        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow'} p-6`}>
          <h2 className="text-xl font-bold mb-6">Account</h2>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-lg text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <FiLogOut className="mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </main>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default SettingsPage;