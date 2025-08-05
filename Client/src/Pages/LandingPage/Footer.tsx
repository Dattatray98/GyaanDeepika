import { FaGraduationCap } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1D1D1D] text-gray-400 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              {/* Replace with your logo */}
              <div className='flex gap-1'>
                <FaGraduationCap className="text-orange-400 text-3xl" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-800 to-orange-500 bg-clip-text text-transparent">
                  GyaanDeepika
                </h1>
              </div>
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              Empowering rural education and awareness through accessible, AI-driven learning solutions.
            </p>
            <div className="flex space-x-4">
              {[
                { name: 'Twitter', icon: 'twitter', url: '#' },
                { name: 'Facebook', icon: 'facebook', url: '#' },
                { name: 'Instagram', icon: 'instagram', url: '#' },
                { name: 'LinkedIn', icon: 'linkedin', url: '#' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={`Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <use xlinkHref={`/icons/sprite.svg#${social.icon}`} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-white/20">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Terms & Conditions', path: '/TermsAndConditions' },
                { name: 'Privacy Policy', path: '/PrivacyPolicy' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200 group"
                  >
                    <span>{link.name}</span>
                    <svg
                      className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-white/20">Contact Us</h3>
            <address className="not-italic text-sm space-y-3">
              <div className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-300">SKN SITS Campus Lonavala</p>
                  <p className="text-gray-300">Pune, India 410401</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:jojewardattatrayofficial@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  jojewardattatrayofficial@gmail.com
                </a>
              </div>

              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+918698446024"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  +91 8698446024
                </a>
              </div>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-white/20">Stay Updated</h3>
            <p className="text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter for the latest updates and educational resources.
            </p>
            <form className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-full"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p className="text-gray-500">
            © {currentYear} GyaanDeepika. All rights reserved. |
            <a href="/TermsAndConditions" className="hover:text-white ml-2">Terms of Service</a> |
            <a href="/PrivacyPolicy" className="hover:text-white ml-2">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;