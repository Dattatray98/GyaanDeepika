import { useState, useEffect } from 'react';
import MobileView from './MobileView.tsx';
import DesktopView from './DesktopView.tsx';
import AOS from "aos"

const CourseContentPage = () => {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      AOS.refresh();
    };
  }, []);

  <><MobileView /><DesktopView /></>

  return isMobile ? <MobileView /> : <DesktopView />;
};

export default CourseContentPage;