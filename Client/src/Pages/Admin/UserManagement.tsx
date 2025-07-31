import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import AccessUsers from "../../hooks/AdminHooks/AccessUsers.ts";
import type { UserData } from "../../components/Common/Types.ts";

type UserStatus = 'active' | 'inactive' | 'pending';

// top of file remains the same...

const UserManagement: React.FC = () => {
  const [searchTerm] = useState('');
  const [filterStatus] = useState<UserStatus | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<String[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  AccessUsers(setUsers, setLoading, setError);

  if (loading) {
    return (
      <div className="rounded-xl p-6 w-full bg-transparent text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-6 w-full bg-transparent text-center">
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

  const filteredUsers = users.filter(user => {
    const firstName =
      typeof user.firstName === 'string'
        ? user.firstName
        : typeof user.name === 'string'
          ? user.name
          : '';

    const email = typeof user.email === 'string' ? user.email : '';

    const matchesSearch =
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesFilter;
  });


  const handleSelectUser = (userId: String) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Calendar className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      {/* ... unchanged control section ... */}

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {user.avatar || (user.firstName?.[0] ?? user.firstName?.[0] ?? '?')}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                  {getStatusIcon(user.status)}
                  <span className="capitalize">{user.status}</span>
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                {user.firstName || user.name || "Unnamed"}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email ?? "No email"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{user.courses ?? 0}</p>
                <p className="text-xs text-gray-600">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{user.certificates ?? 0}</p>
                <p className="text-xs text-gray-600">Certificates</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
