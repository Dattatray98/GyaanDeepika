
import { FiArrowRight } from "react-icons/fi";

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative bg-black h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="./LandingPageBG.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-50"
          loading="eager"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="text-center md:text-left">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            data-aos="fade-up"
          >
            Empowering Rural Minds,<br />
            Enlightening <span className="text-amber-300">Futures</span>
          </h1>
          <p 
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Bringing world-class education and healthcare resources to underserved areas.
          </p>
          <div data-aos="fade-up" data-aos-delay="400">
            <button
              onClick={() => window.scrollTo({ top: document.getElementById('services')?.offsetTop, behavior: 'smooth' })}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto md:mx-0"
            >
              Get Started <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


export default HeroSection
