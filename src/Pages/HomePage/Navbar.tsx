import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState<{ code: string; label: string }[]>([]);
  const [selectedLang, setSelectedLang] = useState('');

  useEffect(() => {
    fetch('/jsondatafile/languages.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.languages) setLanguages(data.languages);
      })
      .catch((err) => console.error('Failed to fetch languages:', err));
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(e.target.value);
    console.log('Selected language:', e.target.value);
  };

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
        <div className="hidden lg:flex items-center gap-6 font-medium text-white">
          <a data-aos="fade-up" data-aos-duration="650" href="#">Home</a>
          <a data-aos="fade-up" data-aos-duration="850" href="#">About</a>
          <a data-aos="fade-up" data-aos-duration="1050" href="#">Services</a>
          <a data-aos="fade-up" data-aos-duration="1250" href="#">Resources</a>
          <a data-aos="fade-up" data-aos-duration="1450" href="#">Testimonials</a>
          <a data-aos="fade-up" data-aos-duration="1650" href="#">Contact</a>

          {/* Language Dropdown */}
          <select
            data-aos="fade-up" data-aos-duration="1700"
            value={selectedLang}
            onChange={handleLangChange}
            className="bg-transparent text-green-800 text-sm px-2 py-1 rounded-md max-h-[50px overflow-auto outline-none"
          >
            <option value="" disabled>Select Language</option>
            {languages.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>

        {/* Profile Icon */}
        <Link to="/profile" className="hidden lg:block">
          <img src="/user.png" alt="Profile" className="w-[30px] mr-3" />
        </Link>

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
        <div className="lg:hidden flex flex-col bg-[#1D1D1D] w-full px-4 pb-4 pt-3 gap-3 mt-2 relative ">
          <a href="#" className="text-white">Home</a>
          <a href="#" className="text-white">About</a>
          <a href="#" className="text-white">Services</a>
          <a href="#" className="text-white">Resources</a>
          <a href="#" className="text-white">Testimonials</a>
          <a href="#" className="text-white">Contact</a>

          {/* Mobile Language Dropdown */}
          <select
            value={selectedLang}
            onChange={handleLangChange}
            className="bg-transparent text-green-800 outline-none text-sm py-1 rounded-md max-h-[120px] overflow-auto"
          >
            <option value="" disabled>Select Language</option>
            {languages.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          <Link to="/profile">
          <img src="/user.png" alt="Profile" className="w-[30px] mt-1 absolute right-5 top-2" />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
