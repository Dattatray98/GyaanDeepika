import { useState } from 'react';

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

      {/* Hamburger icon (visible on small screens) */}
      <div className="lg:hidden block text-white text-2xl cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Nav Links - Desktop */}
      <div className="hidden lg:flex h-[60px] items-center absolute right-[33%] text-white gap-7 font-medium">
        <a data-aos="fade-up" data-aos-duration="650" href="#">Home</a>
        <a data-aos="fade-up" data-aos-duration="850" href="#">About</a>
        <a data-aos="fade-up" data-aos-duration="1050" href="#">Services</a>
        <a data-aos="fade-up" data-aos-duration="1250" href="#">Resources</a>
        <a data-aos="fade-up" data-aos-duration="1450" href="#">Testimonials</a>
        <a data-aos="fade-up" data-aos-duration="1650" href="#">Contact</a>
      </div>

      <div>
        <img src="/user.png" alt="Profile" className='w-[30px] mr-3' />
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-[60px] left-0 w-full bg-[#1D1D1D] flex flex-col items-start px-4 pb-4 gap-3 z-50">
          <a href="#" className="text-white">Home</a>
          <a href="#" className="text-white">About</a>
          <a href="#" className="text-white">Services</a>
          <a href="#" className="text-white">Resources</a>
          <a href="#" className="text-white">Testimonials</a>
          <a href="#" className="text-white">Contact</a>

          <div>
            <img src="/user.png" alt="Profile" className='w-[30px] mr-3' />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
