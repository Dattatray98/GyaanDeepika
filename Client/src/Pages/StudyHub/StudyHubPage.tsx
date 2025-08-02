import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Download,
    BookOpen,
    FileText,
    Calculator,
    Play,
    Filter,
    Home,
    Bookmark,
    Upload,
    User
} from 'lucide-react';
import fetchStudyHub from '../../hooks/StudyHub';
import type { StudyHub } from '../../components/Common/Types';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const examTypes = ['All', 'JEE Mains', 'NEET', 'CBSE Board', 'Engineering', 'Others'];
const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'];

function StudyHubPage() {
    const navigate = useNavigate();
    const [studyHub, setStudyHub] = useState<StudyHub[]>([]);
    const api = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('home');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchStudyHub(setStudyHub);
            } catch (error) {
                console.error("Failed to fetch study hub data:", error);
            }
        };
        loadData();
    }, []);

    const [activeExamType, setActiveExamType] = useState('All');
    const [activeSubject, setActiveSubject] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredResources = useMemo(() => {
        return studyHub.filter(resource => {
            const matchesExam = activeExamType === 'All' || resource.examType === activeExamType;
            const matchesSubject = activeSubject === 'All' || resource.subject === activeSubject;
            const matchesSearch = searchQuery === '' || 
                resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesExam && matchesSubject && matchesSearch;
        });
    }, [studyHub, activeExamType, activeSubject, searchQuery]);

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'notes': return <BookOpen className="w-5 h-5" />;
            case 'papers': return <FileText className="w-5 h-5" />;
            case 'formulas': return <Calculator className="w-5 h-5" />;
            case 'videos': return <Play className="w-5 h-5" />;
            default: return <BookOpen className="w-5 h-5" />;
        }
    };

    const getResourceColor = (type: string) => {
        switch (type) {
            case 'notes': return 'bg-blue-500';
            case 'papers': return 'bg-green-500';
            case 'formulas': return 'bg-orange-500';
            case 'videos': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const handleDownload = async (id: string) => {
        try {
            const pdfUrl = encodeURIComponent(`${api}/api/download/${id}`);
            navigate(`/material/${pdfUrl}`);
        } catch (err) {
            console.error("Failed to redirect to PDF viewer", err);
        }
    };

    const featuredCategories = [
        { icon: BookOpen, title: 'Notes', type: 'notes', color: 'bg-blue-500' },
        { icon: FileText, title: 'Papers', type: 'papers', color: 'bg-green-500' },
        { icon: Calculator, title: 'Formulas', type: 'formulas', color: 'bg-orange-500' },
        { icon: Play, title: 'Videos', type: 'videos', color: 'bg-purple-500' }
    ];

    return (
        <div className="relative h-screen max-h-screen bg-gray-50 overflow-hidden flex flex-col">
            {/* App Header */}
            <header className="sticky top-0 z-10 bg-white shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FaGraduationCap className="text-orange-500 text-2xl" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-800 to-orange-400 bg-clip-text text-transparent">
                            GyaanDeepika
                        </h1>
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 rounded-full bg-gray-100"
                    >
                        <Filter className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20">
                {/* Search Bar */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search notes, papers, videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white p-4 shadow-md">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filter Resources
                        </h3>
                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Exam Type</h4>
                            <div className="flex flex-wrap gap-2">
                                {examTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveExamType(type)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            activeExamType === type
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">Subject</h4>
                            <div className="flex flex-wrap gap-2">
                                {subjects.map((subject) => (
                                    <button
                                        key={subject}
                                        onClick={() => setActiveSubject(subject)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            activeSubject === subject
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Featured Categories (replaced Swiper with simple grid) */}
                <div className="px-4 py-3">
                    <h2 className="text-lg font-bold mb-3">Categories</h2>
                    <div className="grid grid-cols-4 gap-2 overflow-x-auto pb-2">
                        {featuredCategories.map((category, index) => (
                            <div 
                                key={index}
                                className={`${category.color} text-white p-3 rounded-xl flex flex-col items-center min-w-[80px]`}
                                onClick={() => {
                                    setActiveExamType('All');
                                    setActiveSubject('All');
                                    setSearchQuery(category.type);
                                }}
                            >
                                <category.icon className="w-5 h-5 mb-1" />
                                <span className="text-xs font-medium text-center">{category.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resources List */}
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Study Resources</h2>
                        <span className="text-sm text-gray-500">{filteredResources.length} items</span>
                    </div>

                    {filteredResources.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">📚</div>
                            <h3 className="text-lg font-medium mb-2">No resources found</h3>
                            <p className="text-gray-500 mb-4 text-sm">Try different filters or search terms</p>
                            <button
                                onClick={() => navigate('/StudyHub/Upload')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Upload Resources
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredResources.map((resource) => (
                                <div 
                                    key={resource.id} 
                                    className="bg-white rounded-lg shadow p-4 border border-gray-100"
                                    onClick={() => handleDownload(resource.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`${getResourceColor(resource.type)} text-white p-2 rounded-lg`}>
                                            {getResourceIcon(resource.type)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium line-clamp-1">{resource.title}</h3>
                                            <p className="text-gray-500 text-xs line-clamp-1">{resource.description}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{resource.examType}</span>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Download className="w-3 h-3" />
                                                    <span>{resource.downloads.toLocaleString()}</span>
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
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
                <button 
                    onClick={() => setActiveTab('home')} 
                    className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-xs mt-1">Home</span>
                </button>
                <button 
                    onClick={() => setActiveTab('saved')} 
                    className={`flex flex-col items-center p-2 ${activeTab === 'saved' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <Bookmark className="w-5 h-5" />
                    <span className="text-xs mt-1">Saved</span>
                </button>
                <button 
                    onClick={() => navigate('/StudyHub/Upload')} 
                    className="flex flex-col items-center p-2 text-blue-600"
                >
                    <div className="bg-blue-600 text-white p-2 rounded-full -mt-8 mb-1 shadow-lg">
                        <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs">Upload</span>
                </button>
                <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-xs mt-1">Profile</span>
                </button>
            </nav>
        </div>
    );
}

export default StudyHubPage;