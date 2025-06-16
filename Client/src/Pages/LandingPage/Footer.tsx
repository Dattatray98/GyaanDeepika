
const Footer = () => {
  return (
    <footer className="bg-[#1D1D1D] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">GyaanDeepika</h3>
            <p className="text-sm mb-4">
              Empowering rural education and awareness through accessible, AI-driven learning.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="hover:text-white transition-colors"
                  aria-label={social}
                >
                  <img 
                    src={`/${social}.svg`} 
                    alt={social} 
                    className="h-5 w-5" 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Resources'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-sm space-y-2">
              <div>123 Education Street</div>
              <div>Mumbai, India 400001</div>
              <div>info@gyaandeepika.org</div>
              <div>+91 98765 43210</div>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none text-sm w-full"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} GyaanDeepika. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer
