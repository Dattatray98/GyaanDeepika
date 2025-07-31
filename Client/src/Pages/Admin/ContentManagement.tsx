import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Video, 
  FileText, 
  Image,
  Edit,
  Trash2,
  Eye,
  Clock,
  Star,
  Users
} from 'lucide-react';
import type { CourseData } from '../../components/Common/Types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AvailableCourses from '../../hooks/AdminHooks/AvailableCourses';

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  views: number;
  readTime: string;
  publishDate?: string;
}

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [articles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useAuth();
  const navigate = useNavigate();

  AvailableCourses(setCourses, setLoading, setError);
  console.log(courses)


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
    { id: 'videos', label: 'Videos', icon: Video, count: 0 },
    { id: 'resources', label: 'Resources', icon: Image, count: 0 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

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
            
            <button 
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm touch-manipulation"
              onClick={() => navigate(`/admin/content/${activeTab}/new`)}
            >
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
          {courses.length > 0 ? (
            courses.map((course) => (
              
              <div key={course._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={course.image || '/default-course.jpg'}
                    alt={course.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status || 'draft')}`}>
                      {course.status || 'draft'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">{course.category || 'Uncategorized'}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{course.rating || '0'}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title || 'Untitled Course'}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || 'No description available'}</p>
                  
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4 space-x-2 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">{course.lessons || 0} lessons</span>
                      <span className="sm:hidden">{course.lessons || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration || '0h'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base sm:text-lg font-bold text-blue-600">{course.price || 'Free'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                        onClick={() => navigate(`/courses/${course._id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                        onClick={() => navigate(`/admin/content/courses/edit/${course._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Create your first course to get started</p>
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto touch-manipulation"
                onClick={() => navigate('/admin/content/courses/new')}
              >
                <Plus className="w-4 h-4" />
                <span>Create Course</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Other tabs content remains similar with proper null checks */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-xl shadow-sm">
          {articles.length > 0 ? (
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
          ) : (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto touch-manipulation">
                <Plus className="w-4 h-4" />
                <span>Create Article</span>
              </button>
            </div>
          )}
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