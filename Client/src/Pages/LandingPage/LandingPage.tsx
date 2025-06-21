import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './Navbar.tsx';
import HeroSection from "./HeroSection.tsx"
import AboutSection from './AboutSection.tsx';
import ServicesSection from './ServicesSection.tsx';
import TestimonialsSection from './TestimonialsSection.tsx';
import CallToAction from './CallToAction.tsx';
import Footer from './Footer.tsx';
import Loading from '../../components/Common/Loading.tsx';
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
  
  // Loading Screen
  if (loading) {
    return (<Loading />);
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