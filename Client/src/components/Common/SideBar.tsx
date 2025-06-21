// src/components/Sidebar/Sidebar.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { FiBook, FiCompass, FiHome, FiSettings } from 'react-icons/fi';
import type { Course } from './Types.ts';

// Animation variants (can be moved to a separate animations file)
const sidebarAnimations = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    },
    item: {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    },
    tap: {
        scale: 0.98
    }
};

interface NavItem {
    icon: React.ReactNode;
    label: string;
    value: string;
    path: string;
}

interface SidebarProps {
    enrolledCourses?: Course[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

const Sidebar = ({
    enrolledCourses = [],
    activeTab = 'home',
    onTabChange
}: SidebarProps) => {
    const navigate = useNavigate();

    const navItems: NavItem[] = [
        { icon: <FiHome />, label: 'Home', value: 'home', path: "/home" },
        { icon: <FiCompass />, label: 'Discover', value: 'discover', path: "/BrowseCousre" },
        { icon: <FiBook />, label: 'My Learning', value: 'learning', path: "/courses/:courseId/content/:contentId" },
        { icon: <FiBook />, label: 'Upload', value: 'upload', path: "/upload" },
        { icon: <FiSettings />, label: "Settings", value: "settings", path: "/settings" }
  ];

const handleNavigation = (path: string, value: string) => {
    navigate(path);
    onTabChange?.(value);
};

return (
    <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-[#1D1D1D] p-6 sticky top-0 h-screen"
    >
        {/* Logo/Brand */}
        <motion.div
            className="flex items-center mb-8"
            whileHover={{ scale: 1.05 }}
        >
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold text-xl">GyaanDeepika</h1>
        </motion.div>

        {/* Main Navigation */}
        <motion.nav
            className="space-y-1 mb-8"
            variants={sidebarAnimations.container}
            initial="hidden"
            animate="visible"
        >
            {navItems.map((tab, index) => (
                <motion.button
                    key={tab.value}
                    variants={sidebarAnimations.item}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === tab.value
                            ? 'bg-gray-800 text-orange-500'
                            : 'text-gray-400 hover:bg-gray-800'
                        }`}
                    onClick={() => handleNavigation(tab.path, tab.value)}
                    whileHover={{ x: 5 }}
                    whileTap={sidebarAnimations.tap}
                    transition={{ delay: index * 0.1 }}
                >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                </motion.button>
            ))}
        </motion.nav>

        {/* Enrolled Courses Section */}
        <motion.div
            className="border-t border-gray-700 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            <h3 className="text-gray-400 text-sm font-medium mb-3">YOUR COURSES</h3>

            {enrolledCourses.length > 0 ? (
                <div className="space-y-2">
                    {enrolledCourses.slice(0, 3).map((course, index) => (
                        <motion.div
                            key={course._id}
                            className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                            whileHover={{ x: 5 }}
                            whileTap={sidebarAnimations.tap}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            onClick={() => navigate(`/courses/${course._id}`)}
                        >
                            <motion.img
                                src={course.thumbnail || '/default-course.jpg'}
                                alt={course.title}
                                className="w-8 h-8 rounded-md object-cover mr-3"
                                whileHover={{ rotate: 5 }}
                            />
                            <span className="text-sm truncate">{course.title}</span>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.p
                    className="text-gray-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    No enrolled courses
                </motion.p>
            )}
        </motion.div>
    </motion.aside>
);
};

export default Sidebar;