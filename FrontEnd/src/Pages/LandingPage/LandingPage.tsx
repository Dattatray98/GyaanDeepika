import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS styles

import Navbar from './Navbar';
import HeroSection from './herosection';
import Footer from './FooterSection';
import CallToAction from './CallToAction';
import TestimonialsSection from './TestimonialsSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServiceSection';


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
