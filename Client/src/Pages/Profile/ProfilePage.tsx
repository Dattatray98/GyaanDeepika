import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiHome, FiCompass, FiBook, FiUser } from "react-icons/fi";
import CourseBlock from "./CourseBlock.tsx";
import ProfileBlock from "./ProfileBlock.tsx";
import Loading from "../../components/Common/Loading.tsx";
import Sidebar from "../../components/Common/SideBar.tsx";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);
  
  // Loading Screen
  if (loading) {
    return (<Loading />);
  }
  

  const tabs = [
    { icon: <FiHome />, label: "Home", value: "home", path: "/" },
    { icon: <FiCompass />, label: "Discover", value: "discover", path: "/BrowseCousre" },
    { icon: <FiBook />, label: "Learning", value: "learning", path: "/LearningPage" },
    { icon: <FiUser />, label: "Profile", value: "profile", path: "/ProfilePage" },
  ];

 

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
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
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
