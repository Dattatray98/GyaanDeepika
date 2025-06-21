import { useEffect, useState } from 'react';
import DeskTopView from './DeskTopView.tsx';
import MobileView from './MobileView.tsx';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  <><MobileView /><DeskTopView /></>

  return isMobile ? <MobileView /> : <DeskTopView />;
};

export default HomePage;