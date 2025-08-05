import { useState } from 'react';
import {
  FaGraduationCap,
  FaHome,
  FaInfoCircle,
  FaBook,
  FaBookOpen,
  FaQuoteLeft,
  FaEnvelope
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/home', label: 'Home', icon: <FaHome className="mr-2" /> },
    { path: 'AboutSection', label: 'About', icon: <FaInfoCircle className="mr-2" /> },
    { path: '/StudyHub', label: 'Study Hub', icon: <FaBookOpen className="mr-2" /> },
    { path: '/BrowseCourse', label: 'Resources', icon: <FaBook className="mr-2" /> },
    { path: 'TestimonialsSection', label: 'Testimonials', icon: <FaQuoteLeft className="mr-2" /> },
    { path: '/contact', label: 'Contact', icon: <FaEnvelope className="mr-2" /> },
  ];

  return (
    <nav className="bg-[#1D1D1D] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <FaGraduationCap className="text-indigo-400 text-3xl animate-float" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Gyaan<span className="text-white">Deepika</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="flex items-center text-white hover:text-orange-500 transition-colors text-sm font-medium"
                data-aos="fade-down"
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="flex items-center border-2 border-orange-500 text-orange-500 px-4 py-1 rounded-lg font-medium hover:bg-orange-500 hover:text-white transition-colors text-sm"
              data-aos="zoom-in"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/auth/SignUp')}
              className="flex items-center bg-orange-500 text-white px-4 py-1 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-[#1D1D1D] transition-all duration-300`}>
        <div className="px-2 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-3 text-white hover:bg-gray-800 rounded-md text-base font-medium"
            >
              {link.icon}
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-700 mt-2">
            <button
              onClick={() => {
                navigate('/auth/login');
                setIsOpen(false);
              }}
              className="flex items-center justify-center w-full px-4 py-2 text-orange-500 border border-orange-500 rounded-lg mb-2 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate('/auth/signup');
                setIsOpen(false);
              }}
              className="flex items-center justify-center w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;