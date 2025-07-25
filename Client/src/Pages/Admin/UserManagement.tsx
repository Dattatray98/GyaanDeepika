import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const users = [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      joinDate: 'Jan 15, 2024',
      status: 'active',
      courses: 5,
      certificates: 3,
      avatar: 'PS'
    },
    {
      id: 2,
      name: 'Raj Kumar Singh',
      email: 'raj.kumar@email.com',
      phone: '+91 87654 32109',
      location: 'Delhi, India',
      joinDate: 'Feb 20, 2024',
      status: 'active',
      courses: 8,
      certificates: 6,
      avatar: 'RK'
    },
    {
      id: 3,
      name: 'Anita Patel',
      email: 'anita.patel@email.com',
      phone: '+91 76543 21098',
      location: 'Ahmedabad, India',
      joinDate: 'Mar 10, 2024',
      status: 'inactive',
      courses: 2,
      certificates: 1,
      avatar: 'AP'
    },
    {
      id: 4,
      name: 'Vikram Gupta',
      email: 'vikram.gupta@email.com',
      phone: '+91 65432 10987',
      location: 'Bangalore, India',
      joinDate: 'Apr 5, 2024',
      status: 'active',
      courses: 12,
      certificates: 9,
      avatar: 'VG'
    },
    {
      id: 5,
      name: 'Neha Agarwal',
      email: 'neha.agarwal@email.com',
      phone: '+91 54321 09876',
      location: 'Pune, India',
      joinDate: 'May 1, 2024',
      status: 'pending',
      courses: 1,
      certificates: 0,
      avatar: 'NA'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Calendar className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage and monitor all registered users</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm touch-manipulation">
              <span className="hidden sm:inline">Add New User</span>
              <span className="sm:hidden">Add User</span>
            </button>
            {selectedUsers.length > 0 && (
              <button className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm touch-manipulation">
                <span className="hidden sm:inline">Delete Selected ({selectedUsers.length})</span>
                <span className="sm:hidden">Delete ({selectedUsers.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

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
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 touch-manipulation"
                />
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {user.avatar}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                  {getStatusIcon(user.status)}
                  <span className="capitalize">{user.status}</span>
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded touch-manipulation">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{user.courses}</p>
                <p className="text-xs text-gray-600">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{user.certificates}</p>
                <p className="text-xs text-gray-600">Certificates</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors touch-manipulation">
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors touch-manipulation">
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