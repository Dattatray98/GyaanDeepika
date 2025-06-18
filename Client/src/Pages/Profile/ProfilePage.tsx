import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiHome, FiCompass, FiBook, FiUser, FiSettings } from "react-icons/fi";
import CourseBlock from "./CourseBlock";
import ProfileBlock from "./ProfileBlock";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Set timeout to remove loading screen after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2500ms = 2.5 seconds

    return () => clearTimeout(timer); // cleanup on unmount
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
  

  const tabs = [
    { icon: <FiHome />, label: "Home", value: "home", path: "/" },
    { icon: <FiCompass />, label: "Discover", value: "discover", path: "/BrowseCousre" },
    { icon: <FiBook />, label: "Learning", value: "learning", path: "/LearningPage" },
    { icon: <FiUser />, label: "Profile", value: "profile", path: "/ProfilePage" },
  ];

  const settingsTab = { icon: <FiSettings />, label: "Settings", value: "settings", path: "/Settings" };

  const MobileView = () => (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Header */}
      <header className="p-4 sticky top-0 z-10 bg-[#1D1D1D]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold">GyaanDeepika</h1>
          </div>
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
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around py-3 bg-[#1D1D1D] border-t border-gray-800">
        {tabs.map((tab) => (
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
      {/* Sidebar */}
      <aside className="w-64 p-6 sticky top-0 h-screen bg-[#1D1D1D]">
        <div className="flex items-center mb-8">
          <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
          <h1 className="font-bold text-xl">GyaanDeepika</h1>
        </div>

        <nav className="space-y-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeTab === tab.value
                  ? "bg-gray-800 text-orange-500"
                  : "text-gray-400 hover:bg-gray-800"
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

        <div className="mt-8">
          <button
            className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-gray-800"
            onClick={() => {
              setActiveTab(settingsTab.value);
              navigate(settingsTab.path);
            }}
          >
            <span className="mr-3">{settingsTab.icon}</span>
            {settingsTab.label}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileBlock />
          <CourseBlock />
        </div>
      </main>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default ProfilePage;
