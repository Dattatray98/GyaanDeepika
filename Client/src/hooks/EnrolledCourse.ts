// ✅ Updated Function
import axios from 'axios';
import type { Course } from '../components/Common/Types';

interface FetchOptions {
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  token: string; // ✅ Add token to parameters
}

export const fetchEnrolledCourses = (options: FetchOptions) => {
  let isMounted = true;
  const abortController = new AbortController();

  const fetchCourses = async () => {
    const { setCourses, setLoading, setError, token } = options;

    try {
      if (!token) throw new Error('Authentication token is missing');

      setLoading(true);
      setError('');
      const api = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${api}/api/enrolled/enrolled`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
      });

      if (!isMounted) return;

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch courses');
      }

      const coursesData: Course[] = response.data.data.map((course: any) => ({
        _id: course._id,
        title: course.title,
        description: course.description,
        subtitle: course.subtitle,
        thumbnail: course.thumbnail,
        instructor: {
          _id: course.instructor._id,
          name: course.instructor.name,
          avatar: course.instructor.avatar,
          email: course.instructor.email,
        },
        price: course.price,
        rating: course.rating,
        totalStudents: course.totalStudents,
        duration: course.duration,
        category: course.category,
        level: course.level,
        content: course.content,
        progress: {
          completionPercentage: course.totalProgress || 0,
          lastAccessed: course.lastUpdated,
          currentVideoId: null,
          currentVideoProgress: 0,
        },
      }));

      setCourses(coursesData);
    } catch (err) {
      if (!isMounted || axios.isCancel(err)) return;

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error
        ? err.message
        : 'Failed to load courses';

      console.error('Fetch error:', err);
      setError(message);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchCourses();

  return () => {
    isMounted = false;
    abortController.abort();
  };
};
