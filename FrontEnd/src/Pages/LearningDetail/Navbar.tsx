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
            className="h-[40px] min-w-[80px] cursor-pointer"
          />
        </div>

        <div className="w-full max-w-[60vh] px-2 ">
          <div className="flex items-center border-2 border-gray-400 rounded-lg w-full max-w-[60vh] h-9 sm:h-11 transition-all duration-300 focus-within:border-indigo-500 shadow-sm">
            <input
              type="text"
              placeholder="Search here"
              className="flex-grow h-full px-4 text-base sm:text-lg text-gray-200 placeholder-gray-400 bg-transparent outline-none"
            />
            <img
              src="search.png"
              alt="Search"
              className="h-full  min-w-8 max-w-10 p-2 rounded-r-lg transition-transform duration-300 hover:scale-110 hover:brightness-110"
            />
          </div>
        </div>


        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 font-medium text-white">
       

          {/* Language Dropdown */}
          <select
            data-aos="fade-up" data-aos-duration="1700"
            value={selectedLang}
            onChange={handleLangChange}
            className="bg-transparent font-bold text-green-800 text-[16px] px-2 py-1 rounded-md max-h-[50px overflow-auto outline-none"
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
