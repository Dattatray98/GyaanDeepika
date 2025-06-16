import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiClock, FiBookmark, FiEye, FiPlay, FiPause, 
  FiVolume2, FiVolumeX, FiMaximize, FiCheckCircle, 
  FiMessageSquare, FiArrowLeft, FiDownload, FiBookOpen,
  FiChevronDown, FiChevronUp, FiShare2
} from 'react-icons/fi';
import { FaGraduationCap, FaChalkboardTeacher, FaRegStar, FaStar } from 'react-icons/fa';
import { IoMdSpeedometer } from 'react-icons/io';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration?: number;
  views?: number;
  createdAt?: string;
  instructor?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  resources?: {
    notes?: string;
    poster?: string;
    slides?: string;
  };
  modules?: {
    id: string;
    name: string;
    duration: string;
    completed: boolean;
    locked: boolean;
  }[];
}

const LearningPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);

  // Initialize animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  // Load video data
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Video[]>("http://localhost:8000/videos");
        const videoData = Array.isArray(response.data) ? response.data : [];
        setVideos(videoData);
        
        // Set initial video from location state or first video
        const incomingVideo = location.state as Video | null;
        setSelectedVideo(incomingVideo || videoData[0]);
      } catch (err) {
        setError("Failed to fetch videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [location.state]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedVideo) return;

    const handlers = {
      timeupdate: () => setCurrentTime(video.currentTime),
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      ended: () => setIsPlaying(false),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, [selectedVideo]);

  // Formatting functions
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (date?: string): string => {
    if (!date) return 'Recently added';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Video controls
  const togglePlay = () => {
    videoRef.current?.[isPlaying ? 'pause' : 'play']();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSpeedOptions(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  // Module navigation
  const toggleModule = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const navigateToModule = (moduleId: string) => {
    // In a real app, you would load the specific module content
    console.log("Navigating to module:", moduleId);
    setActiveModule(moduleId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
        <div className="animate-pulse flex flex-col items-center">
          <FaGraduationCap className="text-orange-500 text-4xl mb-4 animate-bounce" />
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-[progress_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedVideo) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
        <div className="bg-[#1A1A1A] border-l-4 border-red-500 text-red-400 p-6 rounded-lg max-w-md">
          <h3 className="font-bold text-xl mb-2">Loading Error</h3>
          <p className="mb-4">{error || 'No video selected'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0F0F] text-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-orange-400 hover:text-orange-300 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            <span className="hidden sm:inline">Back to Courses</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-full ${bookmarked ? 'text-orange-400' : 'text-gray-400 hover:text-white'}`}
            >
              <FiBookmark className={`${bookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-full">
              <FiShare2 />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Video Player + Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Container */}
            <div 
              className="relative bg-black rounded-xl overflow-hidden border border-[#2A2A2A] shadow-2xl"
              data-aos="fade-up"
            >
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                className="w-full aspect-video object-cover cursor-pointer"
                onClick={togglePlay}
                poster={selectedVideo.thumbnailUrl}
              />
              
              {/* Custom Controls */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                {/* Progress Bar */}
                <div className="flex items-center mb-2 space-x-2">
                  <span className="text-xs text-gray-300 w-12 text-right">
                    {formatDuration(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={videoRef.current?.duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                  />
                  <span className="text-xs text-gray-300 w-12">
                    {formatDuration(selectedVideo.duration)}
                  </span>
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={togglePlay}
                      className="text-white hover:text-orange-400 transition-colors"
                    >
                      {isPlaying ? (
                        <FiPause className="w-6 h-6" />
                      ) : (
                        <FiPlay className="w-6 h-6" />
                      )}
                    </button>
                    
                    <button 
                      onClick={toggleMute}
                      className="text-white hover:text-orange-400 transition-colors"
                    >
                      {isMuted ? (
                        <FiVolumeX className="w-5 h-5" />
                      ) : (
                        <FiVolume2 className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowSpeedOptions(!showSpeedOptions)}
                        className="flex items-center text-white hover:text-orange-400 transition-colors"
                      >
                        <IoMdSpeedometer className="w-5 h-5 mr-1" />
                        <span className="text-sm">{playbackRate}x</span>
                      </button>
                      
                      {showSpeedOptions && (
                        <div className="absolute bottom-full mb-2 left-0 bg-[#2A2A2A] rounded-lg shadow-lg z-10 py-1">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                playbackRate === rate 
                                  ? 'bg-orange-500 text-white' 
                                  : 'text-gray-300 hover:bg-[#3A3A3A]'
                              }`}
                            >
                              {rate}x Speed
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={toggleFullscreen}
                    className="text-white hover:text-orange-400 transition-colors"
                  >
                    <FiMaximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Play/Pause Overlay */}
              {!isPlaying && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="bg-black/50 rounded-full p-4">
                    <FiPlay className="w-10 h-10 text-white" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Video Info */}
            <div 
              className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] shadow-lg"
              data-aos="fade-up"
            >
              <h1 className="text-2xl font-bold text-white mb-2">
                {selectedVideo.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {selectedVideo.instructor && (
                  <div className="flex items-center text-orange-400">
                    <FaChalkboardTeacher className="mr-2" />
                    <span>{selectedVideo.instructor}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-400">
                  <FiEye className="mr-2" />
                  <span>{selectedVideo.views?.toLocaleString() || 0} views</span>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <FiClock className="mr-2" />
                  <span>Released {formatDate(selectedVideo.createdAt)}</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                {selectedVideo.description}
              </p>
              
              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Rate this course:
                </h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-xl mr-1 focus:outline-none"
                    >
                      {(hoverRating || rating) >= star ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-gray-500 hover:text-yellow-400" />
                      )}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    ({rating > 0 ? `You rated ${rating} star${rating > 1 ? 's' : ''}` : 'Not rated'})
                  </span>
                </div>
              </div>
              
              {/* Resources */}
              {selectedVideo.resources && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <FiDownload className="mr-2 text-orange-400" />
                    Resources
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedVideo.resources.notes && (
                      <a
                        href={selectedVideo.resources.notes}
                        download
                        className="flex items-center p-3 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg transition-colors"
                      >
                        <FiBookOpen className="mr-3 text-orange-400" />
                        <span>Lecture Notes</span>
                      </a>
                    )}
                    {selectedVideo.resources.slides && (
                      <a
                        href={selectedVideo.resources.slides}
                        download
                        className="flex items-center p-3 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg transition-colors"
                      >
                        <FiBookOpen className="mr-3 text-orange-400" />
                        <span>Presentation Slides</span>
                      </a>
                    )}
                    {selectedVideo.resources.poster && (
                      <a
                        href={selectedVideo.resources.poster}
                        download
                        className="flex items-center p-3 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg transition-colors"
                      >
                        <FiBookOpen className="mr-3 text-orange-400" />
                        <span>Reference Poster</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Course Content Sidebar */}
          <div className="space-y-6" data-aos="fade-left">
            {/* Course Progress */}
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Progress
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Course Completion</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full" 
                    style={{ width: '25%' }}
                  ></div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                <FiCheckCircle className="mr-2" />
                Mark as Completed
              </button>
            </div>
            
            {/* Course Modules */}
            <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] shadow-lg overflow-hidden">
              <h3 className="text-lg font-semibold text-white p-6 border-b border-[#2A2A2A]">
                Course Content
              </h3>
              
              <div className="divide-y divide-[#2A2A2A]">
                {selectedVideo.modules?.map((module) => (
                  <div key={module.id} className="last:border-b-0">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#2A2A2A] transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          module.completed ? 'bg-green-500/20 text-green-400' : 'bg-[#2A2A2A] text-gray-400'
                        }`}>
                          {module.completed ? (
                            <FiCheckCircle className="text-sm" />
                          ) : (
                            <FiPlay className="text-xs" />
                          )}
                        </div>
                        <span className={`text-left ${
                          module.completed ? 'text-gray-400' : 'text-white'
                        }`}>
                          {module.name}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-3">{module.duration}</span>
                        {activeModule === module.id ? (
                          <FiChevronUp className="text-gray-400" />
                        ) : (
                          <FiChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {activeModule === module.id && (
                      <div className="px-4 pb-4 pt-2 bg-[#2A2A2A]">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-400">
                            {module.completed ? 'Completed' : 'Not started'}
                          </span>
                          <button
                            onClick={() => navigateToModule(module.id)}
                            className="text-sm text-orange-400 hover:text-orange-300"
                          >
                            Start Learning
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-300 mb-3">
                          This module covers the fundamental concepts of {module.name.toLowerCase()}.
                        </div>
                        
                        {!module.completed && (
                          <button
                            onClick={() => console.log("Mark as completed")}
                            className="text-sm text-green-400 hover:text-green-300 flex items-center"
                          >
                            <FiCheckCircle className="mr-1" />
                            Mark as completed
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Courses */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-6">More Courses</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos
              .filter(video => video.id !== selectedVideo.id)
              .slice(0, 4)
              .map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer bg-[#1A1A1A] rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-[#2A2A2A] hover:border-orange-500/30 active:scale-95"
                  data-aos="zoom-in"
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                      <FiClock className="mr-1" />
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-white mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center">
                        <FiEye className="mr-1" />
                        {video.views?.toLocaleString() || '0'} views
                      </span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Community Discussion */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FiMessageSquare className="mr-2 text-orange-400" />
            Community Discussion
          </h3>
          
          <div className="bg-[#2A2A2A] rounded-lg p-4 mb-4">
            <textarea
              placeholder="Ask a question or share your thoughts..."
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
              rows={3}
            ></textarea>
            <div className="flex justify-between items-center mt-2">
              <button className="text-sm text-gray-400 hover:text-white">
                Add attachment
              </button>
              <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium">
                Post Question
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Sample discussion thread */}
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3">
                  U
                </div>
                <div>
                  <div className="font-medium text-white">User123</div>
                  <div className="text-xs text-gray-400">2 hours ago</div>
                </div>
              </div>
              <p className="text-gray-300 mb-3">
                Has anyone completed the advanced exercises? I'm stuck on problem #3.
              </p>
              <button className="text-sm text-orange-400 hover:text-orange-300">
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;