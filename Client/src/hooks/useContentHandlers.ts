
import axios from 'axios';
import type { ApiResponse } from '../components/Common/Types';

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
