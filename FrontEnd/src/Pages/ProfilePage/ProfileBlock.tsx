import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { useTheme } from '../context/ThemeContext';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
    language?: string;
    location?: string;
}

const ProfileBlock: React.FC = () => {
    const { darkMode } = useTheme();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        axios.get("http://localhost:8000/users")
            .then((response) => {
                if (response.data.length > 0) {
                    setUser(response.data[0]);
                }
            })
            .catch((error) => {
                console.error("❌ Error fetching users:", error.message);
            });
    }, []);

    return (
        <div className={`rounded-xl p-6 w-full ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
            {/* Header */}
            <div className={`flex items-center gap-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 mb-4`}>
                <div className="relative">
                    <img
                        src="/user.png"
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-orange-500 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        <FiUser className="inline" />
                    </div>
                </div>
                <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user ? user.firstName + " " + user.lastName : "Loading..."}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rural Learner</p>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{user ? user.firstName + " " + user.lastName : "Loading..."}</p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{user ? user.email : "Loading..."}</p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{user?.mobile || "Not provided"}</p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Language</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{user?.language || "Marathi"}</p>
                </div>
                <div className={`p-3 rounded-lg md:col-span-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                    <p className={darkMode ? 'text-white' : 'text-gray-900'}>{user?.location || "Beed, Maharashtra"}</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                    to="/ProfileEdit" 
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                >
                    Edit Profile
                </Link>
                <Link 
                    to="/CourseDashboard" 
                    className={`border border-orange-600 text-orange-500 hover:bg-orange-600/10 px-4 py-2 rounded-lg text-center transition-colors ${darkMode ? 'hover:bg-orange-600/10' : 'hover:bg-orange-100'}`}
                >
                    View Dashboard
                </Link>
            </div>
        </div>
    );
};

export default ProfileBlock;