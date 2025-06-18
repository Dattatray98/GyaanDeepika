import { Link, useNavigate } from "react-router-dom";
import {
  FiHome, FiCompass, FiBook, FiUser, FiSettings,
  FiLogOut, FiLock, FiBell, FiHelpCircle
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Make sure this path is correct

const Settings = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get the logout function from your AuthContext

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    logout(); // This will clear the auth state
    navigate("/auth/login"); // Redirect to login page
  };

  // Rest of your component remains exactly the same
  const MobileView = () => (
    <div className="min-h-screen pb-16 bg-gray-900 text-white">
      <header className="p-4 sticky top-0 z-10 bg-[#1D1D1D]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="rounded-xl bg-gray-800 p-6 mb-4">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <div className="space-y-5">
            <Link to="/settings/notifications" className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg">
              <div className="flex items-center">
                <FiBell className="text-gray-400 mr-3" />
                <span>Notifications</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link to="/settings/privacy" className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg">
              <div className="flex items-center">
                <FiLock className="text-gray-400 mr-3" />
                <span>Privacy</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link to="/help" className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg">
              <div className="flex items-center">
                <FiHelpCircle className="text-gray-400 mr-3" />
                <span>Help Center</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-gray-800 p-6">
          <h2 className="text-xl font-bold mb-6">More Options</h2>
          <button onClick={handleLogout} className="w-full flex items-center p-2 rounded-lg text-red-500 hover:bg-gray-700">
            <FiLogOut className="mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around py-3 bg-[#1D1D1D]">
        {[
          { icon: <FiHome />, label: "Home", value: "home", path: "/" },
          { icon: <FiCompass />, label: "Discover", value: "discover", path: "/BrowseCourses" },
          { icon: <FiBook />, label: "Learning", value: "learning", path: "/LearningPage" },
          { icon: <FiUser />, label: "Profile", value: "profile", path: "/profile" },
          { icon: <FiSettings />, label: "Settings", value: "settings", path: "/settings" },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`flex flex-col items-center p-2 ${activeTab === tab.value ? "text-orange-500" : "text-gray-400"}`}
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

  const DesktopView = () => (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <aside className="w-64 p-6 sticky top-0 h-screen bg-[#1D1D1D]">
        <div className="flex items-center mb-8">
          <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
          <h1 className="font-bold text-xl">GyaanDeepika</h1>
        </div>

        <nav className="space-y-1 mb-8">
          {[
            { icon: <FiHome />, label: "Home", value: "home", path: "/" },
            { icon: <FiCompass />, label: "Discover", value: "discover", path: "/BrowseCourses" },
            { icon: <FiBook />, label: "My Learning", value: "learning", path: "/LearningPage" },
            { icon: <FiUser />, label: "Profile", value: "profile", path: "/profile" },
            { icon: <FiSettings />, label: "Settings", value: "settings", path: "/settings" },
          ].map((tab) => (
            <button
              key={tab.value}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeTab === tab.value ? "bg-gray-800 text-orange-500" : "text-gray-400 hover:bg-gray-800"
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

        <div className="rounded-xl bg-gray-800 p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/settings/notifications" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700">
              <div className="flex items-center">
                <FiBell className="text-gray-400 mr-3" />
                <span>Notification Preferences</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link to="/settings/privacy" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700">
              <div className="flex items-center">
                <FiLock className="text-gray-400 mr-3" />
                <span>Privacy Settings</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>

            <Link to="/help" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700">
              <div className="flex items-center">
                <FiHelpCircle className="text-gray-400 mr-3" />
                <span>Help Center</span>
              </div>
              <span className="text-gray-500">›</span>
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-gray-800 p-6">
          <h2 className="text-xl font-bold mb-6">Account</h2>
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg text-red-500 hover:bg-gray-700">
            <FiLogOut className="mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </main>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default Settings;