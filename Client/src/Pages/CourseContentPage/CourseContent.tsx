import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  FiEye
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";

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

const CourseContent: React.FC = () => {
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

  const navigate = useNavigate();

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
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Beginner</span>;
      case 'intermediate':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Intermediate</span>;
      case 'advanced':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Advanced</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-lg text-gray-600">Loading educational content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading content</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-20 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center">
            <FaGraduationCap className="mr-2" />
            LearnApp
          </h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="p-2 text-gray-600"
            >
              <FiFilter size={20} />
            </button>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Filter Panel */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-30 bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="p-2 text-gray-500"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {['science', 'mathematics', 'technology', 'engineering', 'arts', 'language'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilters({...filters, category: cat})}
                    className={`py-2 px-3 rounded-lg text-sm ${
                      filters.category === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Level</h3>
              <div className="flex space-x-2">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFilters({...filters, level})}
                    className={`py-2 px-3 rounded-lg text-sm ${
                      filters.level === level
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setFilters({ category: '', search: '', sort: '-createdAt', level: '' });
                  setShowMobileFilters(false);
                }}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <header className="hidden md:block bg-white shadow-sm p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-indigo-600 mb-2 flex items-center">
            <FaGraduationCap className="mr-2" />
            LearnApp - Education Platform
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, topics, instructors..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div className="flex space-x-2">
              <select
                className="bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <select
                className="bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 md:pb-4">
        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Courses
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'saved' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {videos.filter(video => video.isPublic !== false).map((video) => (
            <div
              key={video.id}
              onClick={() => navigate(`/course/${video.id}`, { state: video })}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 active:scale-[0.98] transition-transform"
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
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {video.category || 'General'}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle save functionality
                    }}
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
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
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => setFilters({ category: '', search: '', sort: '-createdAt', level: '' })}
              className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-10">
        <button className="flex flex-col items-center text-indigo-600 p-2">
          <FiHome size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-500 p-2">
          <FiCompass size={20} />
          <span className="text-xs mt-1">Discover</span>
        </button>
        <button className="flex flex-col items-center text-gray-500 p-2">
          <FiBook size={20} />
          <span className="text-xs mt-1">My Learning</span>
        </button>
        <button className="flex flex-col items-center text-gray-500 p-2">
          <FiUser size={20} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default CourseContent;