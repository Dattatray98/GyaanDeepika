import { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import CourseBlock from "./CourseBlock.tsx";
import ProfileBlock from "./ProfileBlock.tsx";
import Loading from "../../components/Common/Loading.tsx";
import Sidebar from "../../components/Common/SideBar.tsx";
import BottomNavigation from "../../components/Common/BottomNavigation.tsx";

const ProfilePage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
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
      <BottomNavigation />

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
