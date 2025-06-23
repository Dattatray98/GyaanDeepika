import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * Format duration to MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Fetch saved video progress
 */
export const fetchVideoProgress = async (courseId: string, contentId: string) => {
  const token = useAuth;
  try {
    if (!token) throw new Error('User not authenticated');

    const api = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${api}/api/progress/progress/${courseId}/${contentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.success ? response.data.data : null;
  } catch (error) {
    console.error('Failed to fetch video progress:', error);
    return null;
  }
};

/**
 * Handle video progress updates (throttled)
 */
export const handleVideoProgress = async (
  currentTime: number,
  duration: number,
  courseId: string,
  contentId: string,
  setVideoProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!courseId || !contentId || currentTime % 5 > 0.1) return;

  const completionPercentage = Math.round((currentTime / duration) * 100);
  const isCompleted = completionPercentage >= 95;

  setVideoProgress(completionPercentage);

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('User not authenticated');

    const api = import.meta.env.VITE_API_URL;
    await axios.put(
      `${api}/api/progress`,
      {
        courseId,
        contentId,
        watchedDuration: currentTime,
        isCompleted,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Failed to update video progress:', err);
  }
};

/**
 * Restore saved progress when video loads
 */
export const initializeVideoProgress = async (
  courseId: string,
  contentId: string,
  videoRef: React.RefObject<HTMLVideoElement>,
  setVideoProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const savedProgress = await fetchVideoProgress(courseId, contentId);

  if (savedProgress && videoRef.current) {
    const video = videoRef.current;

    video.addEventListener(
      'loadedmetadata',
      () => {
        video.currentTime = savedProgress.watchedDuration || 0;

        const percentage = Math.round(
          (savedProgress.watchedDuration / (video.duration || 1)) * 100
        );
        setVideoProgress(percentage);
      },
      { once: true }
    );
  }
};

/**
 * Handle video end: auto-play next content
 */
export const handleVideoEnd = (
  courseData: any,
  courseId: string,
  contentId: string,
  navigate: (url: string) => void
) => {
  if (!courseData || !contentId) return;

  const currentIndex = courseData.contents.findIndex((c: any) => c._id === contentId);
  if (currentIndex < courseData.contents.length - 1) {
    const nextContent = courseData.contents[currentIndex + 1];
    navigate(`/courses/${courseId}/content/${nextContent._id}`);
  }
};
