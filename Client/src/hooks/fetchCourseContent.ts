import axios from 'axios';

interface FetchCourseOptions {
  courseId: string | undefined;
  token: string | null;
  setCourseData: React.Dispatch<React.SetStateAction<any>>;
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const fetchCourseContent = async ({
  courseId,
  setCourseData,
  setExpandedSections,
  setLoading,
  setError,
  token
}: FetchCourseOptions) => {
  try {
    setLoading(true);
    setError('');

    if (!courseId || !token) {
      throw new Error('Missing course ID or authentication token');
    }

    const api = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${api}/api/enrolled/${courseId}/content`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const courseData = response.data?.data?.course || response.data?.data;

    if (!courseData || !courseData.courseTitle || !courseData.courseDescription) {
      throw new Error('Invalid course data structure');
    }

    setCourseData(courseData);

    const content = courseData.content || courseData.course?.content;
    if (content?.length) {
      setExpandedSections([content[0]._id]);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.message || 'Request failed';
      setError(errorMessage);
      console.error('Axios error:', errorMessage);
    } else if (err instanceof Error) {
      setError(err.message);
      console.error('Error:', err.message);
    } else {
      setError('An unknown error occurred');
      console.error('Unknown error:', err);
    }
  } finally {
    setLoading(false);
  }
};
