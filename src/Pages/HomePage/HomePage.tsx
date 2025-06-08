import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS styles

import Navbar from './Navbar';
import WelcomNote from './WelcomNote';
import FirstContent from './FirstContent';
import SecContent from './SecContent';
import ThirdContent from './ThirdContent';
import FooterSection from '../LandingPage/FooterSection';

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
      <WelcomNote />
      <FirstContent />
      <SecContent />
      <ThirdContent />
      <FooterSection />
    </>
  );
};

export default LandingPage;

