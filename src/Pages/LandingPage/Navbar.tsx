import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-[60px] bg-[#1D1D1D] w-full flex items-center px-3 relative justify-between">
      {/* Logo */}
      <div>
        <img
          data-aos="zoom-in"
          data-aos-duration="1000"
          src="/GyaanDeepika.png"
          alt="logo"
          className="h-[40px] cursor-pointer"
        />
      </div>

      {/* Hamburger Icon */}
      <div className="lg:hidden block text-white text-2xl cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex h-[60px] items-center absolute right-[33%] text-white gap-7 font-medium">
        <Link to="/home" data-aos="fade-up" data-aos-duration="650">Home</Link>
        <Link to="/about" data-aos="fade-up" data-aos-duration="850">About</Link>
        <Link to="/services" data-aos="fade-up" data-aos-duration="1050">Services</Link>
        <Link to="/resources" data-aos="fade-up" data-aos-duration="1250">Resources</Link>
        <Link to="/testimonials" data-aos="fade-up" data-aos-duration="1450">Testimonials</Link>
        <Link to="/contact" data-aos="fade-up" data-aos-duration="1650">Contact</Link>
      </div>

      {/* Buttons */}
      <div className="hidden lg:flex gap-7 absolute right-5">

        <Link to="/auth/login">
          <button
            data-aos="zoom-in"
            data-aos-duration="800"
            className="border-2 text-orange-500 border-orange-500 px-5 py-1 rounded-[9px] font-medium cursor-pointer"
          >
            Login
          </button>
        </Link>

        <Link to="/auth/signup">
          <button
            data-aos="zoom-in"
            data-aos-duration="1500"
            className="border-2 text-white border-white bg-orange-500 px-3 py-1 rounded-[9px] font-medium cursor-pointer"
          >
            Sign Up
          </button>
        </Link>

      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-[60px] left-0 w-full bg-[#1D1D1D] flex flex-col items-start px-4 pb-4 gap-3 z-50">
          <Link to="/home" className="text-white">Home</Link>
          <Link to="/about" className="text-white">About</Link>
          <Link to="/services" className="text-white">Services</Link>
          <Link to="/resources" className="text-white">Resources</Link>
          <Link to="/testimonials" className="text-white">Testimonials</Link>
          <Link to="/contact" className="text-white">Contact</Link>

          <div className="flex flex-col gap-3 w-full mt-3">
            <button className="w-full border-2 text-orange-500 border-orange-500 px-5 py-1 rounded-[9px] font-medium">
              Login
            </button>
            <button className="w-full border-2 text-white border-white bg-orange-500 px-3 py-1 rounded-[9px] font-medium">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
