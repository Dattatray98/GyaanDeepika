import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS styles

import Navbar from './Navbar';
import MainContainer from './MainContainer';
import AboutContainer from './AboutContainer';
import ServiceSection from './ServiceSection';
import Carousel from './Carousel';
import FooterSection from './FooterSection';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,   // true = animate only once
      mirror: true,  // true = animate on scroll up as well
    });
  }, []);

  return (
    <>
      <Navbar />
      <MainContainer />
      <AboutContainer />
      <ServiceSection category={'Offering'} />
      <Carousel />
      <FooterSection />
    </>
  );
};

export default LandingPage;
