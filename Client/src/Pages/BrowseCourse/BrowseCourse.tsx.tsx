import { useEffect, useState } from 'react';
// import 'aos/dist/aos.css';
import MobileView from './MobileView.tsx';
import DeskTopView from './DeskTopView.tsx';

const BrowseCourses = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);


    <><MobileView /><DeskTopView /></>

  return isMobile ? <MobileView /> : <DeskTopView />;

};

export default BrowseCourses;