import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './Navbar';
import HeroSection from "./HeroSection"
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import TestimonialsSection from './TestimonialsSection';
import CallToAction from './CallToAction';
import Footer from './Footer';
import { FaGraduationCap } from 'react-icons/fa';
const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
    });
  }, []);
  
  const [loading, setLoading] = useState(true);

  // Set timeout to remove loading screen after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2500ms = 2.5 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);
    
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
        <div className="animate-pulse flex flex-col items-center">
          <FaGraduationCap className="text-orange-500 text-4xl mb-4 animate-bounce" />
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-[progress_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-black text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};


export default LandingPage;