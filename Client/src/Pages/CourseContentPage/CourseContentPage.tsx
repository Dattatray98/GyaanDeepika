import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  FileText, 
  Download, 
  Share2, 
  Bookmark,
  Award,
  Target,
  ChevronDown,
  ChevronRight,
  Lock,
  PlayCircle,
  PenTool,
  BarChart3,
  GraduationCap,
  Search,
  Filter,
  Grid,
  List} from 'lucide-react';

const CourseContentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [expandedSections, setExpandedSections] = useState<string[]>(['section-1']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [] = useState('all');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sample course data
  const courseData = {
    id: courseId,
    title: "Mathematics Basics",
    subtitle: "Master the fundamentals of mathematics with practical examples",
    instructor: {
      name: "Dr. Sarah Johnson",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      bio: "Mathematics Professor with 15+ years of teaching experience",
      rating: 4.9,
      students: 12500
    },
    thumbnail: "https://images.pexels.com/photos/6238025/pexels-photo-6238025.jpeg",
    rating: 4.7,
    totalStudents: 1842,
    duration: "8 weeks",
    level: "Beginner",
    language: "English",
    lastUpdated: "December 2024",
    category: "Education",
    price: "Free",
    description: "This comprehensive mathematics course covers all fundamental concepts from basic arithmetic to introductory algebra. Perfect for students looking to build a strong foundation in mathematics.",
    learningOutcomes: [
      "Master basic arithmetic operations",
      "Understand algebraic expressions and equations",
      "Solve linear and quadratic equations",
      "Apply mathematical concepts to real-world problems",
      "Develop problem-solving skills"
    ],
    requirements: [
      "Basic reading and writing skills",
      "Access to calculator (optional)",
      "Willingness to practice regularly"
    ],
    totalProgress: 35,
    completedLessons: 7,
    totalLessons: 20,
    estimatedTime: "2-3 hours per week"
  };

  const courseSections = [
    {
      id: 'section-1',
      title: 'Getting Started',
      description: 'Introduction to basic mathematical concepts',
      duration: '45 min',
      lessons: 4,
      completed: 4,
      content: [
        {
          id: '1',
          type: 'video',
          title: 'Welcome to Mathematics',
          duration: '5:30',
          completed: true,
          preview: true
        },
        {
          id: '2',
          type: 'video',
          title: 'Number Systems Overview',
          duration: '12:45',
          completed: true,
          preview: false
        },
        {
          id: '3',
          type: 'reading',
          title: 'Mathematical Notation Guide',
          duration: '15 min read',
          completed: true,
          preview: false
        },
        {
          id: '4',
          type: 'quiz',
          title: 'Basic Concepts Quiz',
          duration: '10 questions',
          completed: true,
          preview: false
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Arithmetic Operations',
      description: 'Master addition, subtraction, multiplication, and division',
      duration: '2.5 hours',
      lessons: 6,
      completed: 3,
      content: [
        {
          id: '5',
          type: 'video',
          title: 'Addition and Subtraction',
          duration: '18:20',
          completed: true,
          preview: false
        },
        {
          id: '6',
          type: 'video',
          title: 'Multiplication Techniques',
          duration: '22:15',
          completed: true,
          preview: false
        },
        {
          id: '7',
          type: 'video',
          title: 'Division Methods',
          duration: '19:45',
          completed: true,
          preview: false
        },
        {
          id: '8',
          type: 'assignment',
          title: 'Practice Problems Set 1',
          duration: '30 min',
          completed: false,
          preview: false
        },
        {
          id: '9',
          type: 'video',
          title: 'Order of Operations',
          duration: '16:30',
          completed: false,
          preview: false
        },
        {
          id: '10',
          type: 'quiz',
          title: 'Arithmetic Quiz',
          duration: '15 questions',
          completed: false,
          preview: false
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Introduction to Algebra',
      description: 'Learn variables, expressions, and basic equations',
      duration: '3 hours',
      lessons: 8,
      completed: 0,
      locked: false,
      content: [
        {
          id: '11',
          type: 'video',
          title: 'What is Algebra?',
          duration: '14:20',
          completed: false,
          preview: false
        },
        {
          id: '12',
          type: 'video',
          title: 'Variables and Constants',
          duration: '16:45',
          completed: false,
          preview: false
        },
        {
          id: '13',
          type: 'video',
          title: 'Algebraic Expressions',
          duration: '20:30',
          completed: false,
          preview: false
        },
        {
          id: '14',
          type: 'reading',
          title: 'Expression Simplification Rules',
          duration: '20 min read',
          completed: false,
          preview: false
        },
        {
          id: '15',
          type: 'video',
          title: 'Solving Linear Equations',
          duration: '25:15',
          completed: false,
          preview: false
        },
        {
          id: '16',
          type: 'assignment',
          title: 'Algebra Practice Set',
          duration: '45 min',
          completed: false,
          preview: false
        },
        {
          id: '17',
          type: 'video',
          title: 'Word Problems in Algebra',
          duration: '18:40',
          completed: false,
          preview: false
        },
        {
          id: '18',
          type: 'quiz',
          title: 'Algebra Fundamentals Quiz',
          duration: '20 questions',
          completed: false,
          preview: false
        }
      ]
    },
    {
      id: 'section-4',
      title: 'Advanced Topics',
      description: 'Quadratic equations and systems of equations',
      duration: '2 hours',
      lessons: 2,
      completed: 0,
      locked: true,
      content: [
        {
          id: '19',
          type: 'video',
          title: 'Quadratic Equations',
          duration: '28:30',
          completed: false,
          preview: false
        },
        {
          id: '20',
          type: 'video',
          title: 'Systems of Equations',
          duration: '32:15',
          completed: false,
          preview: false
        }
      ]
    }
  ];

  const resources = [
    {
      id: 1,
      title: 'Mathematics Formula Sheet',
      type: 'PDF',
      size: '2.4 MB',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Practice Problem Solutions',
      type: 'PDF',
      size: '1.8 MB',
      downloadUrl: '#'
    },
    {
      id: 3,
      title: 'Calculator Guide',
      type: 'PDF',
      size: '950 KB',
      downloadUrl: '#'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'New Practice Problems Added',
      content: 'Additional practice problems have been added to Section 2',
      date: '2 days ago',
      important: true
    },
    {
      id: 2,
      title: 'Live Q&A Session',
      content: 'Join us for a live Q&A session this Friday at 3 PM',
      date: '1 week ago',
      important: false
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'reading': return <FileText className="w-5 h-5" />;
      case 'quiz': return <Target className="w-5 h-5" />;
      case 'assignment': return <PenTool className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-400';
      case 'reading': return 'text-green-400';
      case 'quiz': return 'text-purple-400';
      case 'assignment': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const handleContentClick = (content: any, _id: string) => {
    if (content.type === 'video') {
      navigate(`/courses/${courseId}/video/${content.id}`);
    }
    // Handle other content types as needed
  };

  const filteredSections = courseSections.filter(section => {
    if (searchTerm) {
      return section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             section.content.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return true;
  });

  if (isMobile) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        {/* Mobile Header */}
        <header className="bg-gray-800 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="text-white hover:text-orange-500"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg flex-1 mx-4 text-center">{courseData.title}</h1>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`${isBookmarked ? 'text-orange-500' : 'text-gray-400'}`}
            >
              <Bookmark className="w-6 h-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
            {[
              { id: 'content', label: 'Content' },
              { id: 'about', label: 'About' },
              { id: 'resources', label: 'Resources' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Mobile Content */}
        <div className="p-4">
          {activeTab === 'content' && (
            <div>
              {/* Progress Overview */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Your Progress</h3>
                  <span className="text-orange-500 font-medium">{courseData.totalProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${courseData.totalProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  {courseData.completedLessons} of {courseData.totalLessons} lessons completed
                </p>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              {/* Course Sections */}
              <div className="space-y-4">
                {filteredSections.map((section) => (
                  <div key={section.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium mr-2">{section.title}</h3>
                          {section.locked && <Lock className="w-4 h-4 text-gray-400" />}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{section.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{section.lessons} lessons</span>
                          <span className="mx-2">•</span>
                          <span>{section.duration}</span>
                          <span className="mx-2">•</span>
                          <span>{section.completed}/{section.lessons} completed</span>
                        </div>
                      </div>
                      {expandedSections.includes(section.id) ? 
                        <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                    </button>

                    {expandedSections.includes(section.id) && (
                      <div className="border-t border-gray-700">
                        {section.content.map((content, index) => (
                          <button
                            key={content.id}
                            onClick={() => !section.locked && handleContentClick(content, section.id)}
                            disabled={section.locked}
                            className={`w-full p-4 text-left flex items-center hover:bg-gray-700 transition-colors ${
                              section.locked ? 'opacity-50 cursor-not-allowed' : ''
                            } ${index !== section.content.length - 1 ? 'border-b border-gray-700' : ''}`}
                          >
                            <div className={`mr-3 ${getContentTypeColor(content.type)}`}>
                              {getContentIcon(content.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{content.title}</h4>
                              <p className="text-xs text-gray-400">{content.duration}</p>
                            </div>
                            <div className="flex items-center">
                              {content.preview && (
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded mr-2">
                                  Preview
                                </span>
                              )}
                              {content.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Course Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <img 
                  src={courseData.thumbnail} 
                  alt={courseData.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-bold mb-2">{courseData.title}</h2>
                <p className="text-gray-400 mb-4">{courseData.subtitle}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{courseData.rating}</span>
                    </div>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="font-medium">{courseData.totalStudents}</span>
                    </div>
                    <p className="text-xs text-gray-400">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-green-400 mr-1" />
                      <span className="font-medium">{courseData.duration}</span>
                    </div>
                    <p className="text-xs text-gray-400">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <BarChart3 className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="font-medium">{courseData.level}</span>
                    </div>
                    <p className="text-xs text-gray-400">Level</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm">{courseData.description}</p>
              </div>

              {/* Instructor */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold mb-3">Instructor</h3>
                <div className="flex items-center">
                  <img 
                    src={courseData.instructor.avatar} 
                    alt={courseData.instructor.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{courseData.instructor.name}</h4>
                    <p className="text-sm text-gray-400">{courseData.instructor.bio}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span>{courseData.instructor.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{courseData.instructor.students} students</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold mb-3">What you'll learn</h3>
                <ul className="space-y-2">
                  {courseData.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              {/* Downloads */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold mb-4">Course Resources</h3>
                <div className="space-y-3">
                  {resources.map(resource => (
                    <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-sm">{resource.title}</h4>
                          <p className="text-xs text-gray-400">{resource.type} • {resource.size}</p>
                        </div>
                      </div>
                      <button className="text-orange-500 hover:text-orange-400">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold mb-4">Announcements</h3>
                <div className="space-y-3">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className={`p-3 rounded-lg ${
                      announcement.important ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-gray-700'
                    }`}>
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        {announcement.important && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Important</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-1">{announcement.content}</p>
                      <p className="text-xs text-gray-500">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Desktop Header */}
      <header className="bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="text-white hover:text-orange-500 mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <GraduationCap className="text-orange-500 text-2xl mr-3" />
              <div>
                <h1 className="font-bold text-2xl">{courseData.title}</h1>
                <p className="text-gray-400">{courseData.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-5 gap-6 mb-6">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="font-bold">{courseData.rating}</p>
            <p className="text-sm text-gray-400">Rating</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="font-bold">{courseData.totalStudents}</p>
            <p className="text-sm text-gray-400">Students</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="font-bold">{courseData.duration}</p>
            <p className="text-sm text-gray-400">Duration</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="font-bold">{courseData.level}</p>
            <p className="text-sm text-gray-400">Level</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <Award className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="font-bold">{courseData.price}</p>
            <p className="text-sm text-gray-400">Price</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Your Progress</h3>
            <span className="text-orange-500 font-bold">{courseData.totalProgress}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
            <div 
              className="bg-orange-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${courseData.totalProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            {courseData.completedLessons} of {courseData.totalLessons} lessons completed • 
            Estimated time remaining: {courseData.estimatedTime}
          </p>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search course content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course Sections */}
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <div key={section.id} className="bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold mr-3">{section.title}</h3>
                      {section.locked && <Lock className="w-5 h-5 text-gray-400" />}
                      <div className="ml-auto flex items-center space-x-4 text-sm text-gray-400">
                        <span>{section.lessons} lessons</span>
                        <span>{section.duration}</span>
                        <span className="text-orange-500 font-medium">
                          {section.completed}/{section.lessons} completed
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400">{section.description}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(section.completed / section.lessons) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {expandedSections.includes(section.id) ? 
                    <ChevronDown className="w-6 h-6 text-gray-400 ml-4" /> : 
                    <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
                  }
                </button>

                {expandedSections.includes(section.id) && (
                  <div className="border-t border-gray-700">
                    {viewMode === 'list' ? (
                      <div className="divide-y divide-gray-700">
                        {section.content.map((content) => (
                          <button
                            key={content.id}
                            onClick={() => !section.locked && handleContentClick(content, section.id)}
                            disabled={section.locked}
                            className={`w-full p-4 text-left flex items-center hover:bg-gray-700 transition-colors ${
                              section.locked ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <div className={`mr-4 ${getContentTypeColor(content.type)}`}>
                              {getContentIcon(content.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{content.title}</h4>
                              <p className="text-sm text-gray-400">{content.duration}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              {content.preview && (
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                  Preview
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded ${getContentTypeColor(content.type)} bg-opacity-20`}>
                                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                              </span>
                              {content.completed ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.content.map((content) => (
                          <button
                            key={content.id}
                            onClick={() => !section.locked && handleContentClick(content, section.id)}
                            disabled={section.locked}
                            className={`p-4 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors ${
                              section.locked ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className={`${getContentTypeColor(content.type)}`}>
                                {getContentIcon(content.type)}
                              </div>
                              {content.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                              )}
                            </div>
                            <h4 className="font-medium mb-2">{content.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{content.duration}</p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded ${getContentTypeColor(content.type)} bg-opacity-20`}>
                                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                              </span>
                              {content.preview && (
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                  Preview
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
          {/* Instructor Info */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Instructor</h3>
            <div className="flex items-center mb-3">
              <img 
                src={courseData.instructor.avatar} 
                alt={courseData.instructor.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-medium">{courseData.instructor.name}</h4>
                <div className="flex items-center text-sm text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  <span>{courseData.instructor.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{courseData.instructor.students} students</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">{courseData.instructor.bio}</p>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">What you'll learn</h3>
            <ul className="space-y-2">
              {courseData.learningOutcomes.slice(0, 3).map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{outcome}</span>
                </li>
              ))}
            </ul>
            {courseData.learningOutcomes.length > 3 && (
              <button className="text-orange-500 text-sm mt-2 hover:text-orange-400">
                Show all {courseData.learningOutcomes.length} outcomes
              </button>
            )}
          </div>

          {/* Course Resources */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Resources</h3>
            <div className="space-y-2">
              {resources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-2 hover:bg-gray-600 rounded">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm">{resource.title}</span>
                  </div>
                  <button className="text-orange-500 hover:text-orange-400">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-bold mb-3">Announcements</h3>
            <div className="space-y-3">
              {announcements.map(announcement => (
                <div key={announcement.id} className={`p-3 rounded ${
                  announcement.important ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-gray-600'
                }`}>
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    {announcement.important && (
                      <span className="bg-orange-500 text-white text-xs px-1 py-0.5 rounded">!</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{announcement.content}</p>
                  <p className="text-xs text-gray-500">{announcement.date}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseContentPage;