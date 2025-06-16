import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './Navbar';
import HeroSection from "./HeroSection"
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import TestimonialsSection from './TestimonialsSection';
import CallToAction from './CallToAction';
import Footer from './Footer';
const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
    });
  }, []);

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