import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Eye,
  MessageSquare,
  Calendar,
  Download
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,345',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Courses',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-emerald-500'
    },
    {
      title: 'Monthly Views',
      value: '45.2K',
      change: '+18%',
      changeType: 'positive',
      icon: Eye,
      color: 'bg-purple-500'
    },
    {
      title: 'Certificates Issued',
      value: '2,847',
      change: '+23%',
      changeType: 'positive',
      icon: Award,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    { id: 1, user: 'Priya Sharma', action: 'completed', item: 'React Fundamentals', time: '2 hours ago' },
    { id: 2, user: 'Raj Kumar', action: 'enrolled in', item: 'JavaScript Mastery', time: '4 hours ago' },
    { id: 3, user: 'Anita Singh', action: 'posted in', item: 'Discussion Forum', time: '6 hours ago' },
    { id: 4, user: 'Vikram Patel', action: 'earned', item: 'HTML Expert Badge', time: '8 hours ago' },
    { id: 5, user: 'Neha Gupta', action: 'submitted', item: 'Final Project', time: '1 day ago' }
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with Gyaandeepika today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.color} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">User Engagement</h2>
            <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="sm:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Interactive Chart Placeholder</p>
              <p className="text-xs sm:text-sm text-gray-500">Real chart would be integrated here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
            View All Activity
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center justify-center sm:justify-start space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all touch-manipulation">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-gray-700 text-sm sm:text-base">Create New Course</span>
          </button>
          <button className="flex items-center justify-center sm:justify-start space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all touch-manipulation">
            <Users className="w-6 h-6 text-emerald-600" />
            <span className="font-medium text-gray-700 text-sm sm:text-base">Add New User</span>
          </button>
          <button className="flex items-center justify-center sm:justify-start space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all touch-manipulation sm:col-span-2 lg:col-span-1">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-gray-700 text-sm sm:text-base">Schedule Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;