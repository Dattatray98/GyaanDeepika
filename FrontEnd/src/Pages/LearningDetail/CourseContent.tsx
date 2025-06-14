import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiClock, 
  FiBookmark, 
  FiHome,
  FiCompass,
  FiBook,
  FiUser,
  FiFilter,
  FiX,
  FiEye,
  FiBell
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

interface Quality {
  quality: string;
  url: string;
  bitrate?: number;
  codec?: string;
  filesize?: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  qualities?: Quality[];
  duration?: number;
  views?: number;
  isPublic?: boolean;
  tags?: string[];
  category?: string;
  instructor?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string | Date;
}

const CourseContent = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: '-createdAt',
    level: ''
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('learning');
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.level) params.append('level', filters.level);

        const response = await axios.get<{ success: boolean; data: Video[] }>(
          `http://localhost:8000/videos?${params.toString()}`
        );
        
        if (response.data.success) {
          setVideos(response.data.data);
        } else {
          throw new Error('Failed to fetch videos');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch videos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [filters]);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const formatDate = (date?: string | Date): string => {
    if (!date) return 'New';
    const dateObj = new Date(date);
    const diffDays = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
    return dateObj.toLocaleDateString();
  };

  const getLevelBadge = (level?: string) => {
    switch (level) {
      case 'beginner':
        return <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">Beginner</span>;
      case 'intermediate':
        return <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full">Intermediate</span>;
      case 'advanced':
        return <span className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded-full">Advanced</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-lg text-gray-400">Loading educational content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white">
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-300">Error loading content</h3>
              <div className="mt-2 text-sm text-red-400">
                <p>{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-medium text-red-400 hover:text-red-300"
              >
                Try again →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile View
  const MobileView = () => (
    <div className="bg-gray-900 text-white min-h-screen pb-16">
      {/* Header */}
      <header className="bg-[#1D1D1D] p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="font-bold">GyaanDeepika</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="text-white"
            >
              <FiFilter className="text-xl" />
            </button>
            <FiSearch className="text-xl" />
            <FiBell className="text-xl" />
          </div>
        </div>
      </header>

      {/* Mobile Filter Panel */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-30 bg-[#1D1D1D] p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="p-2 text-gray-400"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {['science', 'mathematics', 'technology', 'engineering', 'arts', 'language'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilters({...filters, category: cat})}
                    className={`py-2 px-3 rounded-lg text-sm ${
                      filters.category === cat
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Level</h3>
              <div className="flex space-x-2">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFilters({...filters, level})}
                    className={`py-2 px-3 rounded-lg text-sm ${
                      filters.level === level
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] p-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setFilters({ category: '', search: '', sort: '-createdAt', level: '' });
                  setShowMobileFilters(false);
                }}
                className="w-full py-3 bg-gray-800 text-gray-300 rounded-lg font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4">
        {/* Search and Tabs */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        <div className="flex border-b border-gray-800 mb-4">
          <button
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'all' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('all')}
          >
            All Courses
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'saved' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-4">
          {videos.filter(video => video.isPublic !== false).map((video) => (
            <div
              key={video.id}
              onClick={() => navigate(`/LearningPage`, { state: video })}
              className="bg-gray-800 rounded-lg overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                  <FiClock className="mr-1" />
                  {formatDuration(video.duration)}
                </div>
                {video.level && (
                  <div className="absolute top-2 left-2">
                    {getLevelBadge(video.level)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-orange-400 bg-orange-900/50 px-2 py-1 rounded">
                    {video.category || 'General'}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle save functionality
                    }}
                    className="text-gray-400 hover:text-orange-500"
                  >
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-white mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    <FiEye className="mr-1" />
                    {video.views?.toLocaleString() || 'No'} views
                  </span>
                  <span>{formatDate(video.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.filter(video => video.isPublic !== false).length === 0 && (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-300">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => setFilters({ category: '', search: '', sort: '-createdAt', level: '' })}
              className="mt-4 text-sm font-medium text-orange-500 hover:text-orange-400"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] flex justify-around py-3">
        {[
          { icon: <FiHome />, label: 'Home', value: 'home', path: "/" },
          { icon: <FiCompass />, label: 'Discover', value: 'discover', path: "/BrowseCourses" },
          { icon: <FiBook />, label: 'Learning', value: 'learning', path: "/LearningPage" },
          { icon: <FiUser />, label: 'Profile', value: 'profile', path: "/profile" }
        ].map(tab => (
          <button
            key={tab.value}
            className={`flex flex-col items-center p-2 ${activeNavTab === tab.value ? 'text-orange-500' : 'text-gray-400'}`}
            onClick={() => {
              setActiveNavTab(tab.value);
              navigate(tab.path);
            }}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  // Desktop View
  const DesktopView = () => (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D1D1D] p-6 sticky top-0 h-screen">
        <div className="flex items-center mb-8">
          <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
          <h1 className="font-bold text-xl">GyaanDeepika</h1>
        </div>

        <nav className="space-y-1 mb-8">
          {[
            { icon: <FiHome />, label: 'Home', value: 'home', path: "/" },
            { icon: <FiCompass />, label: 'Discover', value: 'discover', path: "/BrowseCourses" },
            { icon: <FiBook />, label: 'My Learning', value: 'learning', path: "/LearningPage" }
          ].map(tab => (
            <button
              key={tab.value}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeNavTab === tab.value 
                  ? 'bg-gray-800 text-orange-500' 
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
              onClick={() => {
                setActiveNavTab(tab.value);
                navigate(tab.path);
              }}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-gray-400 text-sm font-medium mb-3">FILTERS</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                <option value="science">Science</option>
                <option value="mathematics">Mathematics</option>
                <option value="technology">Technology</option>
                <option value="engineering">Engineering</option>
                <option value="arts">Arts</option>
                <option value="language">Language</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Level</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="flex items-center space-x-4">
            <FiBell className="text-xl text-gray-400 hover:text-white cursor-pointer" />
            <Link to="/profile" className="w-8 h-8 rounded-full bg-orange-500"></Link>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('all')}
          >
            All Courses
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'saved' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Courses
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.filter(video => video.isPublic !== false).map((video) => (
            <div
              key={video.id}
              onClick={() => navigate(`/LearningPage`, { state: video })}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                  <FiClock className="mr-1" />
                  {formatDuration(video.duration)}
                </div>
                {video.level && (
                  <div className="absolute top-2 left-2">
                    {getLevelBadge(video.level)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-orange-400 bg-orange-900/50 px-2 py-1 rounded">
                    {video.category || 'General'}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle save functionality
                    }}
                    className="text-gray-400 hover:text-orange-500"
                  >
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    <FiEye className="mr-1" />
                    {video.views?.toLocaleString() || 'No'} views
                  </span>
                  <span>{formatDate(video.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.filter(video => video.isPublic !== false).length === 0 && (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-300">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => setFilters({ category: '', search: '', sort: '-createdAt', level: '' })}
              className="mt-4 text-sm font-medium text-orange-500 hover:text-orange-400"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default CourseContent;