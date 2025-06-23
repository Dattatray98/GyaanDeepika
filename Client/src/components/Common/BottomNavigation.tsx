import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiBook, FiCompass, FiHome, FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <FiHome size={20} />, label: 'Home', value: 'home', path: '/home' },
    { icon: <FiCompass size={20} />, label: 'Discover', value: 'discover', path: '/BrowseCousre' },
    { icon: <FiBook size={20} />, label: 'My Learning', value: 'my-learning', path: '/courses/:courseId/content/:contentId' }, // Partial match
    { icon: <FiUser size={20} />, label: 'Profile', value: 'profile', path: '/ProfilePage' },
  ];


  const getActiveTab = () => {
    if (location.pathname.startsWith('/courses')) return 'my-learning';

    const match = navItems.find((item) => location.pathname.startsWith(item.path));
    return match ? match.value : 'home';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] flex justify-around py-3 border-t border-gray-800 z-10"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {navItems.map((item) => (
        <motion.button
          key={item.value}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center p-2 transition-colors rounded-lg ${
            activeTab === item.value
              ? 'text-orange-500 bg-gray-800'
              : 'text-gray-400 hover:text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </motion.button>
      ))}
    </motion.nav>
  );
};

export default BottomNavigation;
