

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">GyaanDeepika</h2>
          <p className="text-sm leading-relaxed">
            Empowering rural education and awareness through accessible, AI-driven learning.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/privacy-policy" className="hover:text-purple-400 transition">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-purple-400 transition">Terms & Conditions</a></li>
            <li><a href="/faq" className="hover:text-purple-400 transition">FAQ</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:info@gyaandeepika.org" className="hover:text-purple-400 transition">info@gyaandeepika.org</a></li>
            <li>Phone: <a href="tel:+919876543210" className="hover:text-purple-400 transition">+91 98765 43210</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-purple-400 transition"><img src="/twitter.png" className="w-6"/></a>
            <a href="#" className="hover:text-purple-400 transition"><img src="/instagram.png" className="w-6"/></a>
            <a href="#" className="hover:text-purple-400 transition"><img src="/whatsapp.png" className="w-6"/></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
        © 2025 <span className="text-white font-semibold">GyaanDeepika</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
