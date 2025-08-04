import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
    Send,
    Mail,
    Clock
} from 'lucide-react';
import type { StudyHub } from '../../components/Common/Types';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import fetchStudyHub from '../../hooks/StudyHub';

// Constants
const EXAM_TYPES = ['All', 'JEE Mains', 'NEET', 'CBSE Board', 'Engineering', 'Others'] as const;
const SUBJECTS = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'] as const;
const SORT_OPTIONS = ['Latest', 'Most Downloaded', 'Highest Rated', 'A-Z'] as const;
const DIFFICULTY_LEVELS = ['All', 'Easy', 'Medium', 'Hard'] as const;
const RESOURCE_TYPES = ['All', 'notes', 'papers', 'formulas', 'videos'] as const;
const BLOG_CATEGORIES = ['All', 'Study Tips', 'Exam Strategies', 'Subject Guides', 'Success Stories'] as const;

// Types
type ExamType = typeof EXAM_TYPES[number];
type Subject = typeof SUBJECTS[number];
type SortOption = typeof SORT_OPTIONS[number];
type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
type ResourceType = typeof RESOURCE_TYPES[number];
type BlogCategory = typeof BLOG_CATEGORIES[number];

interface SuggestionFormData {
    name: string;
    email: string;
    requestType: string;
    examType: string;
    subject: string;
    description: string;
    isAnonymous: boolean;
}

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: BlogCategory;
    date: string;
    author: string;
    imageUrl?: string;
}

// Request types configuration
const REQUEST_TYPES = [
    { value: 'notes', label: 'Study Notes', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'papers', label: 'Question Papers', icon: <FileText className="w-4 h-4" /> },
    { value: 'formulas', label: 'Formula Sheets', icon: <Calculator className="w-4 h-4" /> },
    { value: 'videos', label: 'Video Lectures', icon: <Play className="w-4 h-4" /> },
    { value: 'other', label: 'Other Resources', icon: <Mail className="w-4 h-4" /> }
] as const;

// Utility function for debouncing
const debounce = (func: () => void, wait: number) => {
    let timeout: number;
    return () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(func, wait);
    };
};

function StudyHubPage() {
    const navigate = useNavigate();
    const api = import.meta.env.VITE_API_URL;
    const searchInputRef = useRef<HTMLInputElement>(null);

    // State management
    const [studyHub, setStudyHub] = useState<StudyHub[]>([]);
    const [activeTab, setActiveTab] = useState<'home' | 'saved' | 'suggest' | 'profile' | 'blog'>('home');
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('Latest');

    // Filter state
    const [activeExamType, setActiveExamType] = useState<ExamType>('All');
    const [activeSubject, setActiveSubject] = useState<Subject>('All');
    const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('All');
    const [activeResourceType, setActiveResourceType] = useState<ResourceType>('All');
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

    // Suggestion form state
    const [suggestionFormData, setSuggestionFormData] = useState<SuggestionFormData>({
        name: '',
        email: '',
        requestType: 'notes',
        examType: 'JEE Mains',
        subject: 'Physics',
        description: '',
        isAnonymous: false
    });
    const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Blog state

    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [activeBlogCategory, setActiveBlogCategory] = useState<BlogCategory>('All');


    // Device detection with debounce
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        const debouncedResize = debounce(handleResize, 200);
        window.addEventListener('resize', debouncedResize);

        return () => window.removeEventListener('resize', debouncedResize);
    }, []);

    // Data loading
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await fetchStudyHub(setStudyHub);

                // Mock blog data - replace with actual API call
                const mockBlogPosts: BlogPost[] = [
                    {
                        id: '1',
                        title: '10 Tips for Effective JEE Preparation',
                        excerpt: 'Learn the best strategies to crack JEE with these proven tips',
                        content: 'Full content would be here...',
                        category: 'Study Tips',
                        date: '2023-10-15',
                        author: 'Expert Tutor',
                        imageUrl: 'https://via.placeholder.com/600x400?text=JEE+Tips'
                    },
                    {
                        id: '2',
                        title: 'NEET Biology: How to Master the Syllabus',
                        excerpt: 'Comprehensive guide to mastering Biology for NEET',
                        content: 'Full content would be here...',
                        category: 'Subject Guides',
                        date: '2023-09-28',
                        author: 'Biology Expert',
                        imageUrl: 'https://via.placeholder.com/600x400?text=NEET+Biology'
                    },
                    {
                        id: '3',
                        title: 'Time Management for Board Exams',
                        excerpt: 'How to effectively manage your time during CBSE Board exams',
                        content: 'Full content would be here...',
                        category: 'Exam Strategies',
                        date: '2023-11-05',
                        author: 'Academic Coach',
                        imageUrl: 'https://via.placeholder.com/600x400?text=Time+Management'
                    }
                ];
                setBlogPosts(mockBlogPosts);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load resources. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Focus search input when searching
    useEffect(() => {
        if (isSearching && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearching]);

    // Handlers
    const handleDownload = useCallback(async (id: string) => {
        try {
            const pdfUrl = encodeURIComponent(`${api}/api/download/${id}`);
            navigate(`/material/${pdfUrl}`);
        } catch (err) {
            console.error("Failed to redirect to PDF viewer", err);
            setError("Failed to download resource. Please try again.");
        }
    }, [api, navigate]);

    const handleSuggestionChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setSuggestionFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleSuggestionSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingSuggestion(true);
        setError(null);

        try {
            const response = await fetch(`${api}/api/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(suggestionFormData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit suggestion');
            }

            setSubmitSuccess(true);
            setSuggestionFormData({
                name: '',
                email: '',
                requestType: 'notes',
                examType: 'JEE Mains',
                subject: 'Physics',
                description: '',
                isAnonymous: false
            });

            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Submission error:', error);
            setError("Failed to submit suggestion. Please try again.");
        } finally {
            setIsSubmittingSuggestion(false);
        }
    }, [api, suggestionFormData]);

    const toggleSaved = useCallback((id: string) => {
        setSavedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setActiveExamType('All');
        setActiveSubject('All');
        setActiveDifficulty('All');
        setActiveResourceType('All');
        setSortBy('Latest');
        setIsSearching(false);
    }, []);

    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setSearchQuery('');
            setIsSearching(false);
        } else if (e.key === 'Enter') {
            setIsSearching(false);
        }
    }, []);

    const startSearch = useCallback(() => {
        setIsSearching(true);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Computed values
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

        // Show only recent or searched items
        if (searchQuery === '' && activeExamType === 'All' && activeSubject === 'All' &&
            activeDifficulty === 'All' && activeResourceType === 'All') {
            return filtered.slice(0, 15); // Show only first 15 recent items
        }

        return filtered;
    }, [studyHub, activeExamType, activeSubject, activeDifficulty, activeResourceType, searchQuery, sortBy]);

    const filteredBlogPosts = useMemo(() => {
        return activeBlogCategory === 'All'
            ? blogPosts
            : blogPosts.filter(post => post.category === activeBlogCategory);
    }, [blogPosts, activeBlogCategory]);

    const getActiveFiltersCount = useMemo(() => {
        let count = 0;
        if (activeExamType !== 'All') count++;
        if (activeSubject !== 'All') count++;
        if (activeDifficulty !== 'All') count++;
        if (activeResourceType !== 'All') count++;
        if (searchQuery !== '') count++;
        if (sortBy !== 'Latest') count++;
        return count;
    }, [activeExamType, activeSubject, activeDifficulty, activeResourceType, searchQuery, sortBy]);

    const featuredCategories = useMemo(() => [
        {
            icon: BookOpen,
            title: 'Notes',
            type: 'notes' as const,
            color: 'bg-blue-500',
            count: studyHub.filter(r => r.type === 'notes').length
        },
        {
            icon: FileText,
            title: 'Papers',
            type: 'papers' as const,
            color: 'bg-green-500',
            count: studyHub.filter(r => r.type === 'papers').length
        },
        {
            icon: Calculator,
            title: 'Formulas',
            type: 'formulas' as const,
            color: 'bg-orange-500',
            count: studyHub.filter(r => r.type === 'formulas').length
        },
        {
            icon: Play,
            title: 'Videos',
            type: 'videos' as const,
            color: 'bg-purple-500',
            count: studyHub.filter(r => r.type === 'videos').length
        }
    ], [studyHub]);

    // Utility functions
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

    // Component for suggestion tab content
    const SuggestionTabContent = () => (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Study Resources</h2>

            {submitSuccess ? (
                <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Request Submitted!</h3>
                    <p className="text-gray-500">
                        Thank you for your suggestion. We'll review it and add the requested resources soon.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSuggestionSubmit}>
                    <div className="space-y-4">
                        {/* Request Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                What are you looking for?
                            </label>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {REQUEST_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setSuggestionFormData(prev => ({
                                            ...prev,
                                            requestType: type.value
                                        }))}
                                        className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${suggestionFormData.requestType === type.value
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {type.icon}
                                        <span className="text-xs mt-1">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Exam Type */}
                        <div>
                            <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-1">
                                Exam Type
                            </label>
                            <select
                                id="examType"
                                name="examType"
                                value={suggestionFormData.examType}
                                onChange={handleSuggestionChange}
                                className="w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                required
                            >
                                {EXAM_TYPES.filter(t => t !== 'All').map((exam) => (
                                    <option key={exam} value={exam}>
                                        {exam}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={suggestionFormData.subject}
                                onChange={handleSuggestionChange}
                                className="w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                required
                            >
                                {SUBJECTS.filter(s => s !== 'All').map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                        <input type="text" placeholder='enter subject suggestion' />
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Details (What exactly do you need?)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={suggestionFormData.description}
                                onChange={handleSuggestionChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                placeholder="Example: 'I need detailed notes on thermodynamics for JEE Mains with solved examples'"
                                required
                            />
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={suggestionFormData.name}
                                    onChange={handleSuggestionChange}
                                    className="w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    disabled={suggestionFormData.isAnonymous}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email (Optional - we'll notify you when added)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={suggestionFormData.email}
                                    onChange={handleSuggestionChange}
                                    className="w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    disabled={suggestionFormData.isAnonymous}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="isAnonymous"
                                    name="isAnonymous"
                                    type="checkbox"
                                    checked={suggestionFormData.isAnonymous}
                                    onChange={handleSuggestionChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                                    Submit anonymously
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmittingSuggestion || !suggestionFormData.description.trim()}
                                className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmittingSuggestion || !suggestionFormData.description.trim()
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                            >
                                {isSubmittingSuggestion ? (
                                    <>
                                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Note */}
                        <p className="text-xs text-gray-500 text-center">
                            We review all requests and prioritize based on demand. Thank you for helping us improve!
                        </p>
                    </div>
                </form>
            )}
        </div>
    );

    // Blog tab content
    const BlogTabContent = () => (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Educational Blog</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                </label>
                <div className="flex flex-wrap gap-2">
                    {BLOG_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveBlogCategory(category)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeBlogCategory === category
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-indigo-50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {filteredBlogPosts.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No blog posts found in this category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                        >
                            {post.imageUrl && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(post.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <button
                                    onClick={() => {
                                        // This would navigate to the full blog post
                                        // navigate(`/blog/${post.id}`);
                                        console.log('Viewing blog post:', post.id);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                                >
                                    Read More
                                    <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Error display
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-4">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4">
                        <Loader className="animate-spin text-blue-500 w-12 h-12 mx-auto" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Study Resources</h2>
                    <p className="text-gray-600">Please wait while we fetch the latest materials...</p>
                </div>
            </div>
        );
    }

    // Tab content renderer
    const renderTabContent = () => {
        switch (activeTab) {
            case 'suggest':
                return <SuggestionTabContent />;
            case 'saved':
                const savedResources = studyHub.filter(resource => savedItems.has(resource.id));
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Resources</h2>
                        {savedResources.length === 0 ? (
                            <div className="text-center py-12">
                                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No saved resources yet</p>
                                <button
                                    onClick={() => setActiveTab('home')}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Browse Resources
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedResources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`${getResourceColor(resource.type)} text-white p-3 rounded-xl`}>
                                                {getResourceIcon(resource.type)}
                                            </div>
                                            <button
                                                onClick={() => toggleSaved(resource.id)}
                                                className="p-2 rounded-full bg-red-100 text-red-600"
                                            >
                                                <Bookmark className="w-4 h-4 fill-current" />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {resource.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {resource.description}
                                        </p>
                                        <button
                                            onClick={() => handleDownload(resource.id)}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'profile':
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Welcome to GyaanDeepika</h3>
                                <p className="text-gray-600">Your study resource companion</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">Resources Downloaded</span>
                                    <span className="font-semibold text-blue-600">0</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">Resources Saved</span>
                                    <span className="font-semibold text-blue-600">{savedItems.size}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">Total Resources Available</span>
                                    <span className="font-semibold text-blue-600">{studyHub.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'blog':
                return <BlogTabContent />;
            case 'home':
            default:
                return (
                    <div className="space-y-6">
                        {/* Search Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="relative mb-4">
                                {isSearching ? (
                                    <>
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search for notes, papers, formulas..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleSearchKeyDown}
                                            onBlur={() => searchQuery === '' && setIsSearching(false)}
                                            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setIsSearching(false);
                                                }}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={startSearch}
                                        className="w-full flex items-center pl-4 pr-4 py-4 border border-gray-200 rounded-xl text-left text-gray-500 hover:border-blue-500 transition-colors"
                                    >
                                        <Search className="text-gray-400 w-5 h-5 mr-3" />
                                        <span>Search for notes, papers, formulas...</span>
                                    </button>
                                )}
                            </div>

                            {/* Filters */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span>Filters</span>
                                    {getActiveFiltersCount > 0 && (
                                        <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                                            {getActiveFiltersCount}
                                        </span>
                                    )}
                                </button>
                                {getActiveFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-red-600 text-sm hover:text-red-700 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Filter Panel */}
                            {showFilters && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                    {/* Exam Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Exam Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {EXAM_TYPES.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setActiveExamType(type)}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeExamType === type
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {SUBJECTS.map((subject) => (
                                                <button
                                                    key={subject}
                                                    onClick={() => setActiveSubject(subject)}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeSubject === subject
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-purple-50'
                                                        }`}
                                                >
                                                    {subject}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Difficulty */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Difficulty
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {DIFFICULTY_LEVELS.map((difficulty) => (
                                                <button
                                                    key={difficulty}
                                                    onClick={() => setActiveDifficulty(difficulty)}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeDifficulty === difficulty
                                                        ? 'bg-orange-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-orange-50'
                                                        }`}
                                                >
                                                    {difficulty}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resource Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Resource Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {RESOURCE_TYPES.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setActiveResourceType(type)}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center space-x-1 ${activeResourceType === type
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-green-50'
                                                        }`}
                                                >
                                                    {type !== 'All' && getResourceIcon(type)}
                                                    <span className="capitalize">{type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sort By */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sort By
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {SORT_OPTIONS.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setSortBy(option)}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${sortBy === option
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-indigo-50'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Categories */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Access</h2>
                            <div className="flex flex-wrap justify-evenly gap-4">
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
                                        className={`${category.color} text-white p-4 rounded-xl flex flex-col items-center hover:scale-105 transition-transform shadow-md border-2 border-b-green-950 h-[10vh] min-w-[150px] sm:w-[30%] md:w-[22%]`}
                                    >
                                        <category.icon className="w-6 h-6 mb-2" />
                                        <span className="font-semibold">{category.title}</span>
                                        <span className="text-white/80 text-sm">{category.count} items</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resources Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {searchQuery || getActiveFiltersCount > 0
                                        ? `${filteredResources.length} Resources Found`
                                        : 'Recently Added Resources'}
                                </h2>
                                {searchQuery && (
                                    <p className="text-gray-600 text-sm">
                                        Results for "{searchQuery}"
                                    </p>
                                )}
                            </div>

                            {filteredResources.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                    <div className="text-gray-600 text-lg mb-6">No resources match your criteria</div>
                                    <button
                                        onClick={clearFilters}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredResources.map((resource) => (
                                        <div
                                            key={resource.id}
                                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-1"
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
                    </div>
                );
        }
    };

    // Main render based on device type
    if (isMobile) {
        return (
            <div className="relative h-screen bg-gray-50 overflow-hidden flex flex-col">
                {/* Mobile Header */}
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
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{filteredResources.length} found</span>
                        </div>
                    </div>
                </header>

                {/* Mobile Content */}
                <main className="flex-1 overflow-y-auto pb-20">
                    {renderTabContent()}
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
                        onClick={() => setActiveTab('blog')}
                        className={`flex flex-col items-center p-3 ${activeTab === 'blog' ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="text-xs mt-1">Blog</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`flex flex-col items-center p-3 relative ${activeTab === 'saved' ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <Bookmark className="w-5 h-5" />
                        <span className="text-xs mt-1">Saved</span>
                        {savedItems.size > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {savedItems.size}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('suggest')}
                        className={`flex flex-col items-center p-3 ${activeTab === 'suggest' ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                        <Upload className="w-5 h-5" />
                        <span className="text-xs mt-1">Suggest</span>
                    </button>
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
    }

    // Desktop Layout
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Desktop Header */}
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
                            onClick={() => setActiveTab('blog')}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <FileText className="w-5 h-5" />
                            <span>View Blogs</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('suggest')}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Suggest Resource</span>
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
                            Access premium study resources for JEE, NEET, CBSE and more - completely free
                        </p>
                        <p className="text-xl text-blue-100 mb-8">
                            Can’t find the resource you need? Let us know in the Suggestions tab — we’ll add it for you!
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
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5" />
                                <span>Updated Regularly</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-10">
                {renderTabContent()}
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
                            Our mission is to make quality education accessible to all students regardless of their background.
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
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                <span>Regular Updates</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default StudyHubPage;