import { useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiSearch, FiClock, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import Footer from '../LandingPage/Footer';


const BrowseCourses = () => {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    once: true,
    mirror: false,
  });

  // Sample course data
  const courses = [
    {
      id: 1,
      title: "Basic Mathematics",
      description: "Fundamental math concepts for rural students covering arithmetic, algebra, and geometry.",
      category: "Education",
      duration: "8 weeks",
      students: 1250,
      rating: 4.8,
      level: "Beginner",
      image: "/math-course.jpg"
    },
    {
      id: 2,
      title: "Health & Hygiene",
      description: "Essential health practices and hygiene awareness for rural communities.",
      category: "Health",
      duration: "4 weeks",
      students: 890,
      rating: 4.7,
      level: "Beginner",
      image: "/health-course.jpg"
    },
    {
      id: 3,
      title: "English Foundation",
      description: "Basic English language skills for communication and future opportunities.",
      category: "Language",
      duration: "10 weeks",
      students: 2100,
      rating: 4.9,
      level: "Beginner",
      image: "/english-course.jpg"
    },
    {
      id: 4,
      title: "Agricultural Techniques",
      description: "Modern farming methods adapted for rural agricultural practices.",
      category: "Agriculture",
      duration: "6 weeks",
      students: 750,
      rating: 4.6,
      level: "Intermediate",
      image: "/agriculture-course.jpg"
    },
    {
      id: 5,
      title: "Digital Literacy",
      description: "Introduction to digital tools and smartphone usage for education.",
      category: "Technology",
      duration: "5 weeks",
      students: 1500,
      rating: 4.5,
      level: "Beginner",
      image: "/digital-course.jpg"
    },
    {
      id: 6,
      title: "Women's Empowerment",
      description: "Skills and knowledge for women's economic independence.",
      category: "Community",
      duration: "7 weeks",
      students: 680,
      rating: 4.9,
      level: "Beginner",
      image: "/women-course.jpg"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Education', 'Health', 'Language', 'Agriculture', 'Technology', 'Community'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-black text-white min-h-screen">
        
      {/* Hero Section for Browse Courses */}
      <section className="relative bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center">
            <h1 
              className="text-4xl sm:text-5xl font-bold mb-6"
              data-aos="fade-up"
            >
              Explore Our <span className="text-orange-500">Courses</span>
            </h1>
            <p 
              className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Accessible education designed specifically for rural learners.
            </p>
            
            {/* Search and Filter */}
            <div 
              className="max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="bg-gray-800 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-700 text-orange-400 text-xs px-3 py-1 rounded-full">
                        {course.category}
                      </span>
                      <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUsers className="mr-1" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FiStar className="mr-1 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/courses/${course.id}`}
                      className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      Enroll Now <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-16"
              data-aos="fade-up"
            >
              <h3 className="text-xl font-medium text-gray-300 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <h2 
            className="text-3xl font-bold text-white mb-4"
            data-aos="fade-up"
          >
            Can't find what you're looking for?
          </h2>
          <p 
            className="text-gray-200 mb-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            We're constantly adding new courses. Let us know what you'd like to learn!
          </p>
          <button
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Request a Course
          </button>
        </div>
      </section>

      {/* Reuse the same Footer component */}
      <Footer />
    </div>
  );
};

export default BrowseCourses;