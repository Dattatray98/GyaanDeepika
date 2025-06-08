import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS styles

import Navbar from './Navbar';
import WelcomNote from './WelcomNote';
import FooterSection from '../LandingPage/FooterSection';
import SelectCourse from './SelectCourse';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,   // true = animate only once
      mirror: true,  // true = animate on scroll up as well
    });
  }, []);

  return (
    <div className='bg-gray-950'>
      <Navbar />
      <WelcomNote />
      <SelectCourse />
      <FooterSection />
    </div>
  );
};

export default LandingPage;

