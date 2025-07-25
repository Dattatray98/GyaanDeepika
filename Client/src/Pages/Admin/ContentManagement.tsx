import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Video, 
  FileText, 
  Image,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  Star,
  Users
} from 'lucide-react';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    {
      id: 1,
      title: 'Complete React Development',
      description: 'Master React from basics to advanced concepts',
      instructor: 'Dr. Raj Patel',
      category: 'Web Development',
      status: 'published',
      students: 1250,
      lessons: 24,
      duration: '8 hours',
      rating: 4.8,
      price: '₹2,999',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis',
      instructor: 'Prof. Anita Sharma',
      category: 'Data Science',
      status: 'draft',
      students: 890,
      lessons: 32,
      duration: '12 hours',
      rating: 4.6,
      price: '₹3,999',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to digital marketing strategies',
      instructor: 'Mr. Vikram Singh',
      category: 'Marketing',
      status: 'published',
      students: 2100,
      lessons: 18,
      duration: '6 hours',
      rating: 4.9,
      price: '₹1,999',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'The Future of Artificial Intelligence in Education',
      author: 'Dr. Priya Gupta',
      category: 'Technology',
      status: 'published',
      views: 5420,
      publishDate: '2024-01-15',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: 'Best Practices for Online Learning',
      author: 'Prof. Suresh Kumar',
      category: 'Education',
      status: 'draft',
      views: 0,
      publishDate: '',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Career Opportunities in Data Science',
      author: 'Mrs. Neha Agarwal',
      category: 'Career',
      status: 'published',
      views: 3210,
      publishDate: '2024-01-20',
      readTime: '10 min read'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
    { id: 'articles', label: 'Articles', icon: FileText, count: articles.length },
    { id: 'videos', label: 'Videos', icon: Video, count: 12 },
    { id: 'resources', label: 'Resources', icon: Image, count: 8 },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Create, edit, and manage all your educational content</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm">
                  <option>All Categories</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>Marketing</option>
                  <option>Design</option>
                </select>
              </div>
            </div>
            
            <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm touch-manipulation">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create New {activeTab.slice(0, -1)}</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">{course.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4 space-x-2 sm:space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">{course.lessons} lessons</span>
                    <span className="sm:hidden">{course.lessons}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                    <p className="text-base sm:text-lg font-bold text-blue-600">{course.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors touch-manipulation">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-700 text-sm">Title</th>
                  <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-700 text-sm hidden sm:table-cell">Author</th>
                  <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-700 text-sm hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-700 text-sm">Status</th>
                  <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-700 text-sm hidden lg:table-cell">Views</th>
                  <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-700 text-sm hidden lg:table-cell">Published</th>
                  <th className="text-right py-3 px-4 sm:px-6 font-medium text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 sm:px-6">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">{article.title}</h4>
                        <p className="text-sm text-gray-500">{article.readTime}</p>
                        <p className="text-sm text-gray-600 sm:hidden">{article.author}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-gray-700 hidden sm:table-cell">{article.author}</td>
                    <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-gray-700 hidden lg:table-cell">{article.views.toLocaleString()}</td>
                    <td className="py-4 px-4 sm:px-6 text-gray-700 hidden lg:table-cell">{article.publishDate || 'Not published'}</td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600 rounded touch-manipulation">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-blue-600 rounded touch-manipulation">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-red-600 rounded touch-manipulation">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'videos' || activeTab === 'resources') && (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
          <div className="text-gray-400 mb-4">
            {activeTab === 'videos' ? <Video className="w-12 h-12 mx-auto" /> : <Image className="w-12 h-12 mx-auto" />}
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{activeTab === 'videos' ? 'Video' : 'Resource'} Management</h3>
          <p className="text-gray-600 mb-6">This section is coming soon. You'll be able to manage all your {activeTab} here.</p>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto touch-manipulation">
            <Plus className="w-4 h-4" />
            <span>Add New {activeTab.slice(0, -1)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;