import { useState, useEffect } from 'react';

import DeskTopView from '../LearningPage/DeskTopView.tsx';
import MobileView from '../LearningPage/MobileView.tsx';



const VideoPlayerPage = () => {
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

export default VideoPlayerPage;