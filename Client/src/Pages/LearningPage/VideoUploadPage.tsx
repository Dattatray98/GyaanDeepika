import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    Image,
    FileText,
    Plus,
    X,
    Save,
    Eye,
    Lock,
    Unlock,
    Clock,
    Video,
    Paperclip,
    Settings,
    CheckCircle,
    AlertCircle,
    Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';

interface VideoFormData {
    title: string;
    description: string;
    duration: number;
    displayDuration: string;
    thumbnail: string;
    courseId: string;
    sectionId: string;
    orderInSection: number;
    videoUrl: string;
    streamingUrls: { [key: string]: string };
    subtitles: Array<{ language: string; url: string }>;
    isPreview: boolean;
    isLocked: boolean;
    attachments: Array<{ name: string; url: string; type: string }>;
    relatedResources: string[];
}

interface Course {
    id: string;
    title: string;
    sections: Section[];
}

interface Section {
    id: string;
    title: string;
    videoCount: number;
}

const VideoUploadPage = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('basic');
    const [videoPreview, setVideoPreview] = useState<string>('');
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

    const [formData, setFormData] = useState<VideoFormData>({
        title: '',
        description: '',
        duration: 0,
        displayDuration: '00:00',
        thumbnail: '',
        courseId: '',
        sectionId: '',
        orderInSection: 1,
        videoUrl: '',
        streamingUrls: {},
        subtitles: [],
        isPreview: false,
        isLocked: false,
        attachments: [],
        relatedResources: []
    });



    // Sample data - in real app, this would come from API
    const courses: Course[] = [
        {
            id: '1',
            title: 'Mathematics Basics',
            sections: [
                { id: 'sec1', title: 'Introduction', videoCount: 3 },
                { id: 'sec2', title: 'Arithmetic Operations', videoCount: 5 },
                { id: 'sec3', title: 'Algebra Fundamentals', videoCount: 4 }
            ]
        },
        {
            id: '2',
            title: 'English Communication',
            sections: [
                { id: 'sec4', title: 'Grammar Basics', videoCount: 6 },
                { id: 'sec5', title: 'Speaking Skills', videoCount: 4 }
            ]
        }
    ];

    const qualityOptions = [
        { key: '240p', label: '240p (Low)' },
        { key: '360p', label: '360p (Medium)' },
        { key: '480p', label: '480p (Standard)' },
        { key: '720p', label: '720p (HD)' },
        { key: '1080p', label: '1080p (Full HD)' }
    ];

    const attachmentTypes = [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'slide', label: 'Presentation Slides' },
        { value: 'exercise', label: 'Exercise File' },
        { value: 'resource', label: 'Additional Resource' },
        { value: 'transcript', label: 'Video Transcript' }
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'bn', name: 'Bengali' },
        { code: 'te', name: 'Telugu' },
        { code: 'mr', name: 'Marathi' },
        { code: 'ta', name: 'Tamil' },
        { code: 'gu', name: 'Gujarati' },
        { code: 'kn', name: 'Kannada' }
    ];

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
            setFormData(prev => ({ ...prev, videoUrl: url }));

            // Get video duration
            const video = document.createElement('video');
            video.src = url;
            video.onloadedmetadata = () => {
                const duration = Math.floor(video.duration);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                const displayDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                setFormData(prev => ({
                    ...prev,
                    duration,
                    displayDuration
                }));
            };
        }
    };

    const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setThumbnailPreview(url);
            setFormData(prev => ({ ...prev, thumbnail: url }));
        }
    };

    const addSubtitle = () => {
        setFormData(prev => ({
            ...prev,
            subtitles: [...prev.subtitles, { language: 'en', url: '' }]
        }));
    };

    const removeSubtitle = (index: number) => {
        setFormData(prev => ({
            ...prev,
            subtitles: prev.subtitles.filter((_, i) => i !== index)
        }));
    };

    const updateSubtitle = (index: number, field: 'language' | 'url', value: string) => {
        setFormData(prev => ({
            ...prev,
            subtitles: prev.subtitles.map((sub, i) =>
                i === index ? { ...sub, [field]: value } : sub
            )
        }));
    };

    const addAttachment = () => {
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, { name: '', url: '', type: 'pdf' }]
        }));
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const updateAttachment = (index: number, field: 'name' | 'url' | 'type', value: string) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.map((att, i) =>
                i === index ? { ...att, [field]: value } : att
            )
        }));
    };

    const updateStreamingUrl = (quality: string, url: string) => {
        setFormData(prev => ({
            ...prev,
            streamingUrls: { ...prev.streamingUrls, [quality]: url }
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsUploading(true);

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
            setUploadProgress(i);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Here you would make the actual API call to save the video
        console.log('Video data to submit:', formData);

        setIsUploading(false);
        navigate('/admin/videos'); // Navigate to video management page
    };

    // Set timeout to remove loading screen after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2500ms = 2.5 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);
  
  // Loading Screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
        <motion.div 
          className="animate-pulse flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaGraduationCap className="text-orange-500 text-4xl mb-4" />
          </motion.div>
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </div>
          <motion.p 
            className="mt-4 text-gray-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading GyaanDeepika...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  

    const selectedCourse = courses.find(c => c.id === formData.courseId);

    if (isMobile) {
        return (
            <div className="bg-gray-900 text-white min-h-screen">
                {/* Mobile Header */}
                <header className="bg-gray-800 p-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-white hover:text-orange-500"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="font-bold text-lg">Upload Video</h1>
                        <button
                            onClick={handleSubmit}
                            disabled={isUploading || !formData.title || !formData.videoUrl}
                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                        </button>
                    </div>
                </header>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="bg-gray-800 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Uploading...</span>
                            <span className="text-sm text-orange-500">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Mobile Content */}
                <div className="p-4 space-y-6">
                    {/* Video Upload */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-4">Video File</h3>
                        {!videoPreview ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-orange-500 transition-colors"
                            >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-gray-400">Tap to upload video</span>
                            </button>
                        ) : (
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    src={videoPreview}
                                    className="w-full h-48 object-cover rounded-lg"
                                    controls
                                />
                                <button
                                    onClick={() => {
                                        setVideoPreview('');
                                        setFormData(prev => ({ ...prev, videoUrl: '', duration: 0, displayDuration: '00:00' }));
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter video title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    placeholder="Describe your video content"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Course *</label>
                                    <select
                                        value={formData.courseId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value, sectionId: '' }))}
                                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Section *</label>
                                    <select
                                        value={formData.sectionId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sectionId: e.target.value }))}
                                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        disabled={!selectedCourse}
                                    >
                                        <option value="">Select Section</option>
                                        {selectedCourse?.sections.map(section => (
                                            <option key={section.id} value={section.id}>{section.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Order in Section</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.orderInSection}
                                    onChange={(e) => setFormData(prev => ({ ...prev, orderInSection: parseInt(e.target.value) || 1 }))}
                                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-4">Video Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Preview Video</p>
                                    <p className="text-sm text-gray-400">Allow users to preview without enrollment</p>
                                </div>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, isPreview: !prev.isPreview }))}
                                    className={`p-2 rounded-lg transition-colors ${formData.isPreview ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
                                        }`}
                                >
                                    {formData.isPreview ? <Eye className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Lock Video</p>
                                    <p className="text-sm text-gray-400">Require previous videos to be completed</p>
                                </div>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, isLocked: !prev.isLocked }))}
                                    className={`p-2 rounded-lg transition-colors ${formData.isLocked ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                                        }`}
                                >
                                    {formData.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Desktop Header */}
            <header className="bg-gray-800 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-white hover:text-orange-500 mr-4"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="font-bold text-2xl">Upload New Video</h1>
                            <p className="text-gray-400">Add video content to your course</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isUploading || !formData.title || !formData.videoUrl}
                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Video</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="mt-4 bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span>Uploading video...</span>
                            <span className="text-orange-500 font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                            <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </header>

            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Video Upload Section */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-6">Video File</h3>
                            {!videoPreview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-orange-500 transition-colors cursor-pointer"
                                >
                                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium mb-2">Upload Video File</h4>
                                    <p className="text-gray-400 mb-4">Drag and drop your video file here, or click to browse</p>
                                    <p className="text-sm text-gray-500">Supported formats: MP4, MOV, AVI (Max size: 2GB)</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        src={videoPreview}
                                        className="w-full max-w-2xl h-64 object-cover rounded-lg"
                                        controls
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVideoPreview('');
                                            setFormData(prev => ({ ...prev, videoUrl: '', duration: 0, displayDuration: '00:00' }));
                                        }}
                                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                                        <span className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Duration: {formData.displayDuration}
                                        </span>
                                        <span className="flex items-center">
                                            <Video className="w-4 h-4 mr-1" />
                                            Video uploaded successfully
                                        </span>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden">
                            <div className="flex border-b border-gray-700">
                                {[
                                    { id: 'basic', label: 'Basic Info', icon: <FileText className="w-4 h-4" /> },
                                    { id: 'advanced', label: 'Advanced', icon: <Settings className="w-4 h-4" /> },
                                    { id: 'content', label: 'Content', icon: <Paperclip className="w-4 h-4" /> }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                                                ? 'text-orange-500 border-b-2 border-orange-500 bg-gray-700'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                            }`}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'basic' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Video Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    placeholder="Enter a descriptive title for your video"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Order in Section
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={formData.orderInSection}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, orderInSection: parseInt(e.target.value) || 1 }))}
                                                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                rows={4}
                                                className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                                placeholder="Provide a detailed description of what students will learn in this video"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Course *
                                                </label>
                                                <select
                                                    value={formData.courseId}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value, sectionId: '' }))}
                                                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    required
                                                >
                                                    <option value="">Select a course</option>
                                                    {courses.map(course => (
                                                        <option key={course.id} value={course.id}>{course.title}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Section *
                                                </label>
                                                <select
                                                    value={formData.sectionId}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, sectionId: e.target.value }))}
                                                    className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    disabled={!selectedCourse}
                                                    required
                                                >
                                                    <option value="">Select a section</option>
                                                    {selectedCourse?.sections.map(section => (
                                                        <option key={section.id} value={section.id}>
                                                            {section.title} ({section.videoCount} videos)
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Thumbnail Upload */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Video Thumbnail
                                            </label>
                                            {!thumbnailPreview ? (
                                                <div
                                                    onClick={() => thumbnailInputRef.current?.click()}
                                                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer"
                                                >
                                                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-400">Click to upload thumbnail</p>
                                                    <p className="text-sm text-gray-500 mt-1">Recommended: 1280x720 (16:9 ratio)</p>
                                                </div>
                                            ) : (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail preview"
                                                        className="w-64 h-36 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setThumbnailPreview('');
                                                            setFormData(prev => ({ ...prev, thumbnail: '' }));
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'advanced' && (
                                    <div className="space-y-6">
                                        {/* Video Settings */}
                                        <div>
                                            <h4 className="text-lg font-medium mb-4">Video Settings</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                                    <div>
                                                        <h5 className="font-medium">Preview Video</h5>
                                                        <p className="text-sm text-gray-400">Allow users to preview this video without enrolling in the course</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, isPreview: !prev.isPreview }))}
                                                        className={`p-2 rounded-lg transition-colors ${formData.isPreview ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-400'
                                                            }`}
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                                    <div>
                                                        <h5 className="font-medium">Lock Video</h5>
                                                        <p className="text-sm text-gray-400">Require previous videos to be completed before accessing this one</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, isLocked: !prev.isLocked }))}
                                                        className={`p-2 rounded-lg transition-colors ${formData.isLocked ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-400'
                                                            }`}
                                                    >
                                                        {formData.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Streaming URLs */}
                                        <div>
                                            <h4 className="text-lg font-medium mb-4">Streaming Quality Options</h4>
                                            <div className="space-y-3">
                                                {qualityOptions.map(quality => (
                                                    <div key={quality.key} className="flex items-center space-x-4">
                                                        <label className="w-24 text-sm font-medium">{quality.label}</label>
                                                        <input
                                                            type="url"
                                                            value={formData.streamingUrls[quality.key] || ''}
                                                            onChange={(e) => updateStreamingUrl(quality.key, e.target.value)}
                                                            className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            placeholder={`URL for ${quality.label} quality`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Subtitles */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-medium">Subtitles</h4>
                                                <button
                                                    type="button"
                                                    onClick={addSubtitle}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add Subtitle</span>
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {formData.subtitles.map((subtitle, index) => (
                                                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                                                        <select
                                                            value={subtitle.language}
                                                            onChange={(e) => updateSubtitle(index, 'language', e.target.value)}
                                                            className="w-32 p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                        >
                                                            {languages.map(lang => (
                                                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="url"
                                                            value={subtitle.url}
                                                            onChange={(e) => updateSubtitle(index, 'url', e.target.value)}
                                                            className="flex-1 p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            placeholder="Subtitle file URL (.vtt or .srt)"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSubtitle(index)}
                                                            className="p-2 text-red-400 hover:text-red-300"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'content' && (
                                    <div className="space-y-6">
                                        {/* Attachments */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-medium">Attachments</h4>
                                                <button
                                                    type="button"
                                                    onClick={addAttachment}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add Attachment</span>
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {formData.attachments.map((attachment, index) => (
                                                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                                                        <input
                                                            type="text"
                                                            value={attachment.name}
                                                            onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                                                            className="flex-1 p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            placeholder="Attachment name"
                                                        />
                                                        <select
                                                            value={attachment.type}
                                                            onChange={(e) => updateAttachment(index, 'type', e.target.value)}
                                                            className="w-40 p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                        >
                                                            {attachmentTypes.map(type => (
                                                                <option key={type.value} value={type.value}>{type.label}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="url"
                                                            value={attachment.url}
                                                            onChange={(e) => updateAttachment(index, 'url', e.target.value)}
                                                            className="flex-1 p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            placeholder="File URL"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAttachment(index)}
                                                            className="p-2 text-red-400 hover:text-red-300"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Related Resources */}
                                        <div>
                                            <h4 className="text-lg font-medium mb-4">Related Resources</h4>
                                            <textarea
                                                value={formData.relatedResources.join('\n')}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    relatedResources: e.target.value.split('\n').filter(id => id.trim())
                                                }))}
                                                rows={4}
                                                className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                                placeholder="Enter resource IDs (one per line)"
                                            />
                                            <p className="text-sm text-gray-400 mt-2">
                                                Enter the IDs of related resources, one per line
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </main>

                {/* Sidebar */}
                <aside className="w-80 bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
                    <div className="space-y-6">
                        {/* Upload Status */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="font-bold mb-3">Upload Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Video File</span>
                                    {videoPreview ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Title</span>
                                    {formData.title ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Course & Section</span>
                                    {formData.courseId && formData.sectionId ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Video Info */}
                        {videoPreview && (
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="font-bold mb-3">Video Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Duration:</span>
                                        <span>{formData.displayDuration}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Preview:</span>
                                        <span className={formData.isPreview ? 'text-green-400' : 'text-gray-400'}>
                                            {formData.isPreview ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Locked:</span>
                                        <span className={formData.isLocked ? 'text-red-400' : 'text-green-400'}>
                                            {formData.isLocked ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Course Info */}
                        {selectedCourse && (
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="font-bold mb-3">Course Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-400">Course:</span>
                                        <p className="font-medium">{selectedCourse.title}</p>
                                    </div>
                                    {formData.sectionId && (
                                        <div>
                                            <span className="text-gray-400">Section:</span>
                                            <p className="font-medium">
                                                {selectedCourse.sections.find(s => s.id === formData.sectionId)?.title}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tips */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="font-bold mb-3">Upload Tips</h3>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li>• Use descriptive titles for better discoverability</li>
                                <li>• Add detailed descriptions to help students understand the content</li>
                                <li>• Upload high-quality thumbnails (1280x720 recommended)</li>
                                <li>• Consider adding subtitles for accessibility</li>
                                <li>• Use preview mode for introductory videos</li>
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default VideoUploadPage;