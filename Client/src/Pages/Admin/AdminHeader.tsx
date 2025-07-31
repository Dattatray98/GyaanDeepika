import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileFetchUser from "../../hooks/ProfileFetchUser.ts"
import type { UserData } from "../../components/Common/Types.ts";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();


  ProfileFetchUser(setUser, setLoading, setError);

  if (loading) {
    return (
      <div className="rounded-xl p-6 w-full bg-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-6 w-full bg-gray-800 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-orange-500 hover:text-orange-400"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-md mx-4 lg:mx-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              {user
                ? user.avatar
                  ? `${user.avatar}`
                  : <User className="w-4 h-4 text-white" />
                : ''
              }
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user
                ? user.firstName
                  ? `${user.firstName}`
                  : ''
                : ''}</p>
              <p className="text-xs text-gray-500">
                {user
                  ? user.email
                    ? `${user.email}`
                    : ''
                  : ''
                }
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;