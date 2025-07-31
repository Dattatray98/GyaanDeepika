import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Download,
    BookOpen,
    FileText,
    Calculator,
    Play,
    Filter,
    Star,
    Users,
    Clock
} from 'lucide-react';
import Navbar from './Navbar';
import fetchStudyHub from '../../hooks/StudyHub';
import type { StudyHub } from '../../components/Common/Types';
import { useNavigate } from 'react-router-dom';


const examTypes = ['All', 'JEE Mains', 'NEET', 'CBSE Board', 'Engineering', 'Others'];
const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'];

function StudyHubPage() {
    const navigate = useNavigate()

    const [studyHub, setStudyHub] = useState<StudyHub[]>([]);
    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const loadData = async () => {
            await fetchStudyHub(setStudyHub);
        };
        loadData();
    }, []);

    console.log("👀 studyHub", studyHub); // Debug: check state

    const [activeExamType, setActiveExamType] = useState('All');
    const [activeSubject, setActiveSubject] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestionForm, setShowSuggestionForm] = useState(false);

    const filteredResources = useMemo(() => {
        return studyHub.filter(resource => {
            const matchesExam = activeExamType === 'All' || resource.examType === activeExamType;
            const matchesSubject = activeSubject === 'All' || resource.subject === activeSubject;
            const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchQuery.toLowerCase());

            console.log(matchesExam)
            console.log(matchesSubject)
            console.log(matchesSearch)

            return matchesExam && matchesSubject && matchesSearch;
        });
    }, [studyHub, activeExamType, activeSubject, searchQuery]);

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'notes': return <BookOpen className="w-6 h-6" />;
            case 'papers': return <FileText className="w-6 h-6" />;
            case 'formulas': return <Calculator className="w-6 h-6" />;
            case 'videos': return <Play className="w-6 h-6" />;
            default: return <BookOpen className="w-6 h-6" />;
        }
    };

    const getResourceColor = (type: string) => {
        switch (type) {
            case 'notes': return 'from-blue-500 to-blue-600';
            case 'papers': return 'from-green-500 to-green-600';
            case 'formulas': return 'from-orange-500 to-orange-600';
            case 'videos': return 'from-purple-500 to-purple-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const handleDownload = async (id: string) => {
        try {
            // Instead of downloading directly, redirect to the MaterialView page
            const pdfUrl = encodeURIComponent(`${api}/api/download/${id}`);
            window.location.href = `/material/${pdfUrl}`;
        } catch (err) {
            console.error("Failed to redirect to PDF viewer", err);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            📚 Free Study Resources for All Students
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Access JEE, NEET, Board, and Engineering notes & papers — no login needed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                Start Browsing
                            </button>
                            <button
                                onClick={() => navigate(`/StudyHub/Upload`)}
                                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
                            >
                                Contribute Resources
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Search for JEE 2022 physics, 12th CBSE bio notes, formulas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        🎯 Select Your Exam Type:
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {examTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveExamType(type)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeExamType === type
                                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <h3 className="text-lg font-semibold mb-4">📖 Subject Filter:</h3>
                    <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => setActiveSubject(subject)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeSubject === subject
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resources Section */}
            <div id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Resources</h2>
                    <p className="text-gray-600">Found {filteredResources.length} resources matching your criteria</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden">
                            <div className={`h-2 bg-gradient-to-r ${getResourceColor(resource.type)}`}></div>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getResourceColor(resource.type)} text-white`}>
                                        {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">{resource.rating}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {resource.title}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {resource.description}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{resource.examType}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">{resource.subject}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Download className="w-4 h-4" />
                                        <span>{resource.downloads.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={() => { handleDownload(resource.id) }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        View & Download
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                        <button
                            onClick={() => setShowSuggestionForm(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Suggest a Resource
                        </button>
                    </div>
                )}
            </div>

            {/* Resource Categories Overview */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: BookOpen, title: 'Short Notes', desc: 'Chapter-wise notes and quick revision sheets', color: 'from-blue-500 to-blue-600' },
                            { icon: FileText, title: 'Previous Papers', desc: 'Past year question papers with solutions', color: 'from-green-500 to-green-600' },
                            { icon: Calculator, title: 'Formula Sheets', desc: 'Easy-to-print formula compilations', color: 'from-orange-500 to-orange-600' },
                            { icon: Play, title: 'Video Content', desc: 'Mini explainer videos and tutorials', color: 'from-purple-500 to-purple-600' }
                        ].map((category, index) => (
                            <div key={index} className="text-center group">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <category.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                                <p className="text-gray-300">{category.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { icon: Users, number: '50,000+', label: 'Active Students' },
                            { icon: Download, number: '200,000+', label: 'Downloads' },
                            { icon: Clock, number: '24/7', label: 'Free Access' }
                        ].map((stat, index) => (
                            <div key={index} className="group">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                    <stat.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Suggestion Form Modal */}
            {showSuggestionForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">💡 Suggest a Resource</h3>
                            <button
                                onClick={() => setShowSuggestionForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
                                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., JEE 2024 Chemistry Paper" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>Select Exam Type</option>
                                    {examTypes.slice(1).map(type => <option key={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Brief description of the resource..."></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    Submit Suggestion
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSuggestionForm(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">📚 StudyHub</h3>
                        <p className="text-gray-400 mb-6">Empowering students with free, quality educational resources</p>
                        <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
                            <span>Made with ❤️ for students</span>
                            <span>•</span>
                            <span>No login required</span>
                            <span>•</span>
                            <span>Always free</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default StudyHubPage;