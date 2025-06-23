// src/utils/useContentHandlers.ts
import axios from 'axios';
import type { ApiResponse } from '../components/Common/Types';
import { useAuth } from '../context/AuthContext';

export const fetchCourseContent = async (
  token: string,
  courseId: string,
  contentId: string,
  setLoading: (val: boolean) => void,
  setError: (val: string | null) => void,
  setCourseData: (val: any) => void,
  setCurrentContent: (val: any) => void
) => {
  try {
    setLoading(true);
    const api = import.meta.env.VITE_API_URL;

    const response = await axios.get<ApiResponse>(
      `${api}/api/enrolled/${courseId}/content/${contentId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

    setCourseData(response.data.course);
    setCurrentContent(response.data.content);
  } catch (err) {
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.message || err.message
      : err instanceof Error
        ? err.message
        : 'An unknown error occurred';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

export const fetchVideoProgress = async (
  token: string,
  courseId: string,
  contentId: string
) => {
  try {
    const api = import.meta.env.VITE_API_URL;
    const response = await axios.get(
      `${api}/api/progress/progress/${courseId}/${contentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.data || null;
  } catch (error) {
    console.error('Failed to fetch video progress:', error);
    return null;
  }
};

export const updateVideoProgress = async (
  courseId: string,
  contentId: string,
  watchedDuration: number,
  isCompleted: boolean
) => {
  const token = useAuth();
  try {
    const api = import.meta.env.VITE_API_URL;
    await axios.put(
      `${api}/api/progress`,
      { courseId, contentId, watchedDuration, isCompleted },
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
