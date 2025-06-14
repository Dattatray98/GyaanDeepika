import { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaGraduationCap } from 'react-icons/fa';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Footer from './FooterSection';
import CallToAction from './CallToAction';
import TestimonialsSection from './TestimonialsSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServiceSection';

// Initialize AOS once globally
let aosInitialized = false;

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Properly typed ref

  useEffect(() => {
    if (!aosInitialized) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out-quad',
        once: true,
        mirror: false,
        startEvent: 'load'
      });
      aosInitialized = true;
    }

    timerRef.current = setTimeout(() => {
      setLoading(false);
      setTimeout(() => AOS.refresh(), 100);
    }, 2000);

    return () => {
      if (timerRef.current) { // Null check before clearing
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Loading Overlay */}
      <div 
        className={`
          fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F0F] 
          transition-opacity duration-500 ease-in-out
          ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="animate-pulse flex flex-col items-center">
          <FaGraduationCap 
            className="text-orange-500 text-4xl mb-4 animate-bounce" 
            data-aos="zoom-in"
          />
          <div 
            className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div 
              className="h-full bg-orange-500" 
              style={{
                animation: 'progress 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!loading && (
        <div className="bg-black text-white">
          <Navbar data-aos="fade-down" />
          <HeroSection data-aos="fade-up" data-aos-delay="100" />
          <AboutSection data-aos="fade-up" data-aos-delay="200" />
          <ServicesSection data-aos="fade-up" data-aos-delay="300" />
          <TestimonialsSection data-aos="fade-up" data-aos-delay="400" />
          <CallToAction data-aos="zoom-in" data-aos-delay="500" />
          <Footer data-aos="fade-up" data-aos-delay="600" />
        </div>
      )}
    </div>
  );
};

export default LandingPage;