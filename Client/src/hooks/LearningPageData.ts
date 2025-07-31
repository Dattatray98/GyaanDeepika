
import axios from 'axios';
import type { ApiResponse, CourseData, CourseContent } from '../components/Common/Types';
import type { Dispatch, SetStateAction } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  courseId: string;
  contentId: string;
  token: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setCourseData: Dispatch<SetStateAction<CourseData | null>>;
  setCurrentContent: Dispatch<SetStateAction<CourseContent | null>>;
}

export const fetchCourseContent = async ({
  courseId,
  contentId,
  setLoading,
  setError,
  setCourseData,
  setCurrentContent,
}: Props) => {
  const token = useAuth()
  try {
    setLoading(true);
    setError(null);

    if (!courseId || !contentId) {
      throw new Error('Course ID or Content ID is missing');
    }

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
