import { useState } from 'react'
import { FaGraduationCap } from 'react-icons/fa';

// Navbar Component
const Navbar = () => {
  const [] = useState(false);


  return (
    <nav className="bg-[#1D1D1D] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex justify-center items-center space-x-1 relative z-10">
            <FaGraduationCap className="text-orange-500 text-2xl mr-2" />
            <h1 className="text-[21px] font-bold bg-gradient-to-r from-orange-800 to-orange-400 bg-clip-text text-transparent">
              Gyaan<span>Deepika</span>
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
