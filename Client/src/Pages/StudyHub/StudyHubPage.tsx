import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Download,
    BookOpen,
    FileText,
    Calculator,
    Play,
    Star,
    Home,
    Bookmark,
    Upload,
    User,
    Loader,
    X,
    HardDrive,
    TrendingUp,
    Award,
    SlidersHorizontal,
    Sparkles
} from 'lucide-react';
import type { StudyHub } from '../../components/Common/Types';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import fetchStudyHub from '../../hooks/StudyHub';
const examTypes = ['All', 'JEE Mains', 'NEET', 'CBSE Board', 'Engineering', 'Others'];
const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'];
const sortOptions = ['Latest', 'Most Downloaded', 'Highest Rated', 'A-Z'];
const difficultyLevels = ['All', 'Easy', 'Medium', 'Hard'];

function StudyHubPage() {
    const navigate = useNavigate();
    const [studyHub, setStudyHub] = useState<StudyHub[]>([]);
    const api = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('home');
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('Latest');

    // Filter state
    const [activeExamType, setActiveExamType] = useState('All');
    const [activeSubject, setActiveSubject] = useState('All');
    const [activeDifficulty, setActiveDifficulty] = useState('All');
    const [activeResourceType, setActiveResourceType] = useState('All');
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

    // Enhanced device detection with debounce
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        const debouncedResize = debounce(handleResize, 200);
        window.addEventListener('resize', debouncedResize);

        return () => window.removeEventListener('resize', debouncedResize);
    }, []);

    function debounce(func: () => void, wait: number) {
        let timeout: number;
        return () => {
            clearTimeout(timeout);
            timeout = window.setTimeout(func, wait);
        };
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                await fetchStudyHub(setStudyHub);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch study hub data:", err);
                setError("Failed to load resources. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Handle download function from first code
    const handleDownload = async (id: string) => {
        try {
            const pdfUrl = encodeURIComponent(`${api}/api/download/${id}`);
            navigate(`/material/${pdfUrl}`);
        } catch (err) {
            console.error("Failed to redirect to PDF viewer", err);
            setError("Failed to download resource. Please try again.");
        }
    };



    // Enhanced filtered and sorted resources
    const filteredResources = useMemo(() => {
        let filtered = studyHub.filter(resource => {
            const matchesExam = activeExamType === 'All' || resource.examType === activeExamType;
            const matchesSubject = activeSubject === 'All' || resource.subject === activeSubject;
            const matchesDifficulty = activeDifficulty === 'All' || resource.difficulty === activeDifficulty;
            const matchesType = activeResourceType === 'All' || resource.type === activeResourceType;
            const matchesSearch = searchQuery === '' ||
                resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesExam && matchesSubject && matchesDifficulty && matchesType && matchesSearch;
        });

        // Sort results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'Most Downloaded':
                    return b.downloads - a.downloads;
                case 'Highest Rated':
                    return b.rating - a.rating;
                case 'A-Z':
                    return a.title.localeCompare(b.title);
                case 'Latest':
                default:
                    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            }
        });

        return filtered;
    }, [studyHub, activeExamType, activeSubject, activeDifficulty, activeResourceType, searchQuery, sortBy]);

    const getResourceIcon = (type: string) => {
        const icons = {
            notes: <BookOpen className="w-5 h-5" />,
            papers: <FileText className="w-5 h-5" />,
            formulas: <Calculator className="w-5 h-5" />,
            videos: <Play className="w-5 h-5" />
        };
        return icons[type as keyof typeof icons] || <BookOpen className="w-5 h-5" />;
    };

    const getResourceColor = (type: string) => {
        const colors = {
            notes: 'bg-blue-500',
            papers: 'bg-green-500',
            formulas: 'bg-orange-500',
            videos: 'bg-purple-500'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-500';
    };

    const getDifficultyColor = (difficulty: string) => {
        const colors = {
            Easy: 'bg-green-100 text-green-800',
            Medium: 'bg-yellow-100 text-yellow-800',
            Hard: 'bg-red-100 text-red-800'
        };
        return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const toggleSaved = (id: string) => {
        setSavedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setActiveExamType('All');
        setActiveSubject('All');
        setActiveDifficulty('All');
        setActiveResourceType('All');
        setSortBy('Latest');
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (activeExamType !== 'All') count++;
        if (activeSubject !== 'All') count++;
        if (activeDifficulty !== 'All') count++;
        if (activeResourceType !== 'All') count++;
        if (searchQuery !== '') count++;
        if (sortBy !== 'Latest') count++;
        return count;
    };

    const featuredCategories = [
        { icon: BookOpen, title: 'Notes', type: 'notes', color: 'bg-blue-500', count: studyHub.filter(r => r.type === 'notes').length },
        { icon: FileText, title: 'Papers', type: 'papers', color: 'bg-green-500', count: studyHub.filter(r => r.type === 'papers').length },
        { icon: Calculator, title: 'Formulas', type: 'formulas', color: 'bg-orange-500', count: studyHub.filter(r => r.type === 'formulas').length },
        { icon: Play, title: 'Videos', type: 'videos', color: 'bg-purple-500', count: studyHub.filter(r => r.type === 'videos').length }
    ];

    // Desktop UI
    const DesktopUI = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Modern Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                            <FaGraduationCap className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                GyaanDeepika
                            </h1>
                            <p className="text-sm text-gray-500">Knowledge Repository</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>{studyHub.length} Resources</span>
                        </div>
                        <button
                            onClick={() => navigate('/StudyHub/Upload')}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Contribute</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                            Unlock Your Academic
                            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Potential
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Access premium study resources for JEE, NEET, and more - completely free for everyone
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-blue-100">
                            <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5" />
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Download className="w-5 h-5" />
                                <span>Free Downloads</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5" />
                                <span>Community Rated</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-10">
                {/* Modern Search Section */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

                    <div className="relative z-10">
                        {/* Search Bar */}
                        <div className="mb-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200">
                                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                                    <input
                                        type="text"
                                        placeholder="Search for notes, question papers, formulas, videos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-16 pr-16 py-5 text-lg bg-transparent rounded-2xl
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
             transition-all placeholder-gray-400"
                                    />

                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                    <div className="absolute right-20 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                        <Sparkles className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm text-gray-500">AI Powered</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${showFilters
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <SlidersHorizontal className="w-5 h-5" />
                                    <span className="font-medium">Advanced Filters</span>
                                    {getActiveFiltersCount() > 0 && (
                                        <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                                            {getActiveFiltersCount()}
                                        </span>
                                    )}
                                </button>

                                {getActiveFiltersCount() > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        <span className="text-sm">Clear All</span>
                                    </button>
                                )}
                            </div>

                            <div className="text-sm text-gray-500">
                                {filteredResources.length} of {studyHub.length} resources
                            </div>
                        </div>

                        {/* Modern Filter Panel */}
                        {showFilters && (
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Exam Type Filter */}
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Exam Type</span>
                                        </label>
                                        <div className="space-y-2">
                                            {examTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setActiveExamType(type)}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 ${activeExamType === type
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                                                        : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-200 hover:border-blue-300'
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium">{type}</span>
                                                    {type !== 'All' && (
                                                        <span className="text-xs opacity-75 ml-2">
                                                            ({studyHub.filter(r => r.examType === type).length})
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subject Filter */}
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span>Subject</span>
                                        </label>
                                        <div className="space-y-2">
                                            {subjects.map((subject) => (
                                                <button
                                                    key={subject}
                                                    onClick={() => setActiveSubject(subject)}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 ${activeSubject === subject
                                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md transform scale-105'
                                                        : 'bg-white hover:bg-purple-50 text-gray-700 border border-gray-200 hover:border-purple-300'
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium">{subject}</span>
                                                    {subject !== 'All' && (
                                                        <span className="text-xs opacity-75 ml-2">
                                                            ({studyHub.filter(r => r.subject === subject).length})
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Difficulty Filter */}
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            <span>Difficulty</span>
                                        </label>
                                        <div className="space-y-2">
                                            {difficultyLevels.map((difficulty) => (
                                                <button
                                                    key={difficulty}
                                                    onClick={() => setActiveDifficulty(difficulty)}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 ${activeDifficulty === difficulty
                                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-105'
                                                        : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-200 hover:border-orange-300'
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium">{difficulty}</span>
                                                    {difficulty !== 'All' && (
                                                        <span className="text-xs opacity-75 ml-2">
                                                            ({studyHub.filter(r => r.difficulty === difficulty).length})
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resource Type & Sort */}
                                    <div className="space-y-6">
                                        {/* Resource Type */}
                                        <div className="space-y-3">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Resource Type</span>
                                            </label>
                                            <div className="space-y-2">
                                                {['All', 'notes', 'papers', 'formulas', 'videos'].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setActiveResourceType(type)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 ${activeResourceType === type
                                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transform scale-105'
                                                            : 'bg-white hover:bg-green-50 text-gray-700 border border-gray-200 hover:border-green-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            {type !== 'All' && getResourceIcon(type)}
                                                            <span className="text-sm font-medium capitalize">{type}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sort Options */}
                                        <div className="space-y-3">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <span>Sort By</span>
                                            </label>
                                            <div className="space-y-2">
                                                {sortOptions.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => setSortBy(option)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 ${sortBy === option
                                                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md transform scale-105'
                                                            : 'bg-white hover:bg-indigo-50 text-gray-700 border border-gray-200 hover:border-indigo-300'
                                                            }`}
                                                    >
                                                        <span className="text-sm font-medium">{option}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Access Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Access</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredCategories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setActiveExamType('All');
                                    setActiveSubject('All');
                                    setActiveDifficulty('All');
                                    setActiveResourceType(category.type);
                                    setSearchQuery('');
                                }}
                                className={`${category.color} text-white p-6 rounded-2xl flex flex-col items-center hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group`}
                            >
                                <div className="bg-white/20 p-3 rounded-xl mb-3 group-hover:bg-white/30 transition-colors">
                                    <category.icon className="w-8 h-8" />
                                </div>
                                <span className="font-semibold text-lg">{category.title}</span>
                                <span className="text-white/80 text-sm">{category.count} items</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resources Section */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                {filteredResources.length} Resources Found
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {searchQuery && `Results for "${searchQuery}"`}
                                {getActiveFiltersCount() > 0 && (
                                    <span className="ml-2">
                                        {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <Loader className="animate-spin text-blue-500 w-12 h-12 mx-auto mb-4" />
                                <p className="text-gray-600">Loading amazing resources...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <div className="text-red-600 text-lg mb-6">{error}</div>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <div className="text-gray-600 text-lg mb-6">No resources match your search criteria</div>
                            <button
                                onClick={clearFilters}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredResources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-1"
                                >
                                    <div className={`h-1 ${getResourceColor(resource.type)}`}></div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`${getResourceColor(resource.type)} text-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                                                {getResourceIcon(resource.type)}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSaved(resource.id);
                                                }}
                                                className={`p-2 rounded-full transition-colors ${savedItems.has(resource.id)
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                                                    }`}
                                            >
                                                <Bookmark className={`w-4 h-4 ${savedItems.has(resource.id) ? 'fill-current' : ''}`} />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {resource.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {resource.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium border border-blue-200">
                                                {resource.examType}
                                            </span>
                                            <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-medium border border-purple-200">
                                                {resource.subject}
                                            </span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(resource.difficulty)}`}>
                                                {resource.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <Download className="w-4 h-4" />
                                                    <span>{resource.downloads.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-medium text-gray-700">{resource.rating}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <HardDrive className="w-4 h-4" />
                                                <span>{resource.fileSize}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(resource.id);
                                            }}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Download Now</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <div className="flex justify-center items-center space-x-3 mb-6">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                                <FaGraduationCap className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold">GyaanDeepika</h3>
                        </div>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                            Empowering students with free, high-quality educational resources since 2023.
                            Built by students, for students.
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Open Source</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>No Login Required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Always Free</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                <span>Community Driven</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );

    // Mobile UI
    const MobileUI = () => (
        <div className="relative h-screen bg-gray-50 overflow-hidden flex flex-col">
            {/* Sticky Header */}
            <header className="sticky top-0 z-20 bg-white shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                            <FaGraduationCap className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">GyaanDeepika</h1>
                            <p className="text-xs text-gray-500">{studyHub.length} resources</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`relative p-3 rounded-xl transition-all duration-300 ${showFilters
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        {getActiveFiltersCount() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {getActiveFiltersCount()}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Modern Search Bar */}
                <div className="p-4 sticky top-0 z-10 bg-gradient-to-b from-white to-white/95 backdrop-blur-sm border-b border-gray-100">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-transparent rounded-2xl focus:outline-none transition-all placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 shadow-lg sticky top-20 z-10">
                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Exam Type</span>
                                    {activeExamType !== 'All' && (
                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                            {activeExamType}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {examTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setActiveExamType(type)}
                                            className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${activeExamType === type
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                                                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Subject</span>
                                    {activeSubject !== 'All' && (
                                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                            {activeSubject}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {subjects.map((subject) => (
                                        <button
                                            key={subject}
                                            onClick={() => setActiveSubject(subject)}
                                            className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${activeSubject === subject
                                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md transform scale-105'
                                                : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200 hover:border-purple-300'
                                                }`}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span>Difficulty</span>
                                    {activeDifficulty !== 'All' && (
                                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                            {activeDifficulty}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {difficultyLevels.map((difficulty) => (
                                        <button
                                            key={difficulty}
                                            onClick={() => setActiveDifficulty(difficulty)}
                                            className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${activeDifficulty === difficulty
                                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-105'
                                                : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200 hover:border-orange-300'
                                                }`}
                                        >
                                            {difficulty}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {getActiveFiltersCount() > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Clear All Filters</span>
                                </button>
                            )}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setSortBy(option)}
                                            className={`px-4 py-2 text-sm rounded-xl transition-all ${sortBy === option
                                                ? 'bg-orange-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {(searchQuery || activeExamType !== 'All' || activeSubject !== 'All' || sortBy !== 'Latest') && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl flex items-center justify-center space-x-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Clear All Filters</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Categories */}
                {!showFilters && (
                    <div className="px-4 py-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Categories</h2>
                        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                            {featuredCategories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveExamType('All');
                                        setActiveSubject('All');
                                        setActiveDifficulty('All');
                                        setActiveResourceType(category.type);
                                        setSearchQuery('');
                                    }}
                                    className={`${category.color} text-white p-4 rounded-xl flex flex-col items-center min-w-[100px] flex-shrink-0 active:scale-95 transition-transform shadow-md`}
                                >
                                    <category.icon className="w-6 h-6 mb-2" />
                                    <span className="text-xs font-semibold">{category.title}</span>
                                    <span className="text-xs text-white/80">{category.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resources List */}
                <div className="p-4 pb-24">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">
                            {isLoading ? 'Loading...' : `${filteredResources.length} Resources`}
                        </h2>
                        {searchQuery && (
                            <div className="text-sm text-gray-500">
                                for "{searchQuery}"
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <Loader className="animate-spin text-blue-500 w-8 h-8 mx-auto mb-3" />
                                <p className="text-gray-600 text-sm">Loading resources...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                            <div className="text-red-500 text-4xl mb-3">⚠️</div>
                            <div className="text-red-600 mb-4">{error}</div>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                            <div className="text-gray-400 text-4xl mb-3">🔍</div>
                            <div className="text-gray-600 mb-4">No resources found</div>
                            <button
                                onClick={clearFilters}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredResources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden active:bg-gray-50 transition-colors"
                                    onClick={() => handleDownload(resource.id)}
                                >
                                    <div className={`h-1 ${getResourceColor(resource.type)}`}></div>
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`${getResourceColor(resource.type)} text-white p-3 rounded-xl flex-shrink-0`}>
                                                {getResourceIcon(resource.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-800 text-sm leading-tight pr-2">
                                                        {resource.title}
                                                    </h3>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSaved(resource.id);
                                                        }}
                                                        className={`p-1 rounded-full flex-shrink-0 ${savedItems.has(resource.id)
                                                            ? 'text-red-600'
                                                            : 'text-gray-400'
                                                            }`}
                                                    >
                                                        <Bookmark className={`w-4 h-4 ${savedItems.has(resource.id) ? 'fill-current' : ''}`} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                                    {resource.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                                                        {resource.examType}
                                                    </span>
                                                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full border border-purple-200">
                                                        {resource.subject}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                                                        {resource.difficulty}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <Download className="w-3 h-3" />
                                                            <span>{resource.downloads.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                            <span className="font-medium">{resource.rating}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <HardDrive className="w-3 h-3" />
                                                            <span>{resource.fileSize}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(resource.id);
                                                        }}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                        <span>Download</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg z-20">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center p-3 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-xs mt-1">Home</span>
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex flex-col items-center p-3 ${activeTab === 'saved' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Bookmark className="w-5 h-5" />
                    <span className="text-xs mt-1">Saved</span>
                </button>

                 <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex flex-col items-center p-3 ${activeTab === 'upload' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Upload className="w-5 h-5" />
                    <span className="text-xs mt-1">Suggest</span>
                </button>

                {/* <button
                    onClick={() => navigate('/StudyHub/Upload')}
                    className="flex flex-col items-center p-3 text-blue-600"
                >
                    <div className="bg-blue-600 text-white p-2 rounded-full -mt-1 shadow-lg">
                        <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs">Upload</span>
                </button> */}

                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center p-3 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-xs mt-1">Profile</span>
                </button>
            </nav>
        </div>
    );

    return isMobile ? <MobileUI /> : <DesktopUI />;
}

export default StudyHubPage;