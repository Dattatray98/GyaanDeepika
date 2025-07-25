import { useState } from 'react'
import { FaGraduationCap } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/home', label: 'Home' },
    { path: 'AboutSection', label: 'About' },
    { path: '/StudyHub', label: 'Services' },
    { path: '/BrowseCousre', label: 'Resources' },
    { path: 'TestimonialsSection', label: 'Testimonials' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-[#1D1D1D] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex justify-center items-center space-x-3 relative z-10">
            <FaGraduationCap className="text-indigo-400 text-4xl animate-float" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Gyaan<span className="text-white">Deepika</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-white hover:text-orange-500 transition-colors text-sm font-medium bg-transparent border-none"
                data-aos="fade-down"
              >
                {link.label}
              </button>
            ))}

          </div>
          

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-[#1D1D1D] transition-all duration-300`}>
        <div className="px-2 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar
