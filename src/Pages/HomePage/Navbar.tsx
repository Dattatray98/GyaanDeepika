import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1D1D1D] w-full px-3 py-2 relative z-50">
      <div className="flex items-center justify-between h-[60px]">
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

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 font-medium text-white">
          <a data-aos="fade-up" data-aos-duration="650" href="#">Home</a>
          <a data-aos="fade-up" data-aos-duration="850" href="#">About</a>
          <a data-aos="fade-up" data-aos-duration="1050" href="#">Services</a>
          <a data-aos="fade-up" data-aos-duration="1250" href="#">Resources</a>
          <a data-aos="fade-up" data-aos-duration="1450" href="#">Testimonials</a>
          <a data-aos="fade-up" data-aos-duration="1650" href="#">Contact</a>
        </div>

        {/* Profile Icon (optional) */}
        <div className="hidden lg:block">
          <img src="/user.png" alt="Profile" className="w-[30px] mr-3" />
        </div>

        {/* Hamburger Icon - Mobile */}
        <div
          className="lg:hidden text-white text-3xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col bg-[#1D1D1D] w-full px-4 pb-4 pt-3 gap-3 mt-2">
          <a href="#" className="text-white">Home</a>
          <a href="#" className="text-white">About</a>
          <a href="#" className="text-white">Services</a>
          <a href="#" className="text-white">Resources</a>
          <a href="#" className="text-white">Testimonials</a>
          <a href="#" className="text-white">Contact</a>
          <img src="/user.png" alt="Profile" className="w-[30px] mt-1 absolute right-5" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
