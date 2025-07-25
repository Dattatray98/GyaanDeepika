import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    FileText,
    Image,
    Edit,
    Trash2,
    Eye,
    Video,
    Star,
    Download,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const StudyHubManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('resources');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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
        { id: 'resources', label: 'Resources', icon: Image, count: 8, path: '/StudyHub/Upload' },
        { id: 'articles', label: 'Articles', icon: FileText, count: articles.length },
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
                                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
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
                            <span className="hidden sm:inline" onClick={() => activeTab === 'resources' && navigate('/StudyHub/Upload')} >Create New {activeTab.slice(0, -1)}</span>
                            <span className="sm:hidden">Create</span>
                        </button>
                    </div>
                </div>
            </div>

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

            {(activeTab === 'resources') && (
                <div className="space-y-6">
                    {/* Add the resource cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                id: 1,
                                title: 'NEET Physics Formulas',
                                description: 'Complete collection of essential formulas for NEET Physics preparation',
                                type: 'pdf',
                                examType: 'NEET',
                                subject: 'Physics',
                                downloads: 1250,
                                rating: 4.7
                            },
                            {
                                id: 2,
                                title: 'JEE Advanced Math Problems',
                                description: 'Solved problems from previous JEE Advanced papers',
                                type: 'pdf',
                                examType: 'JEE',
                                subject: 'Mathematics',
                                downloads: 980,
                                rating: 4.8
                            },
                            {
                                id: 3,
                                title: 'Organic Chemistry Reactions',
                                description: 'Important organic chemistry reactions with mechanisms',
                                type: 'image',
                                examType: 'NEET/JEE',
                                subject: 'Chemistry',
                                downloads: 2100,
                                rating: 4.9
                            }
                        ].map((resource) => (
                            <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden">
                                <div className={`h-2 bg-gradient-to-r ${resource.type === 'pdf' ? 'from-blue-500 to-blue-600' : resource.type === 'image' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'}`}></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-gradient-to-r ${resource.type === 'pdf' ? 'from-blue-500 to-blue-600' : resource.type === 'image' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} text-white`}>
                                            {resource.type === 'pdf' ? <FileText className="w-5 h-5" /> : resource.type === 'image' ? <Image className="w-5 h-5" /> : <Video className="w-5 h-5" />}
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

                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Keep the "Add New Resource" button */}
                    <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center mt-8">
                        <button
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto touch-manipulation"
                            onClick={() => navigate('/StudyHub/Upload')}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New {activeTab.slice(0, -1)}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyHubManagement;