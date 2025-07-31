import axios from 'axios';
import type { NavigateFunction } from 'react-router-dom';
import type { Course } from '../components/Common/Types';

interface FetchUnenrolledCoursesOptions {
  navigate: NavigateFunction;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  token: string;
}

export const fetchUnenrolledCourses = async ({
  navigate,
  setCourses,
  setLoading,
  setError,
  token,
}: FetchUnenrolledCoursesOptions) => {
  try {
    setLoading(true);

    if (!token) {
      throw new Error('Authentication required');
    }

    const api = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${api}/api/courses/unenrolled`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status < 500,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch courses');
    }

    const formattedCourses: Course[] = response.data.data.map((course: any): Course => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      subtitle: course.subtitle,
      thumbnail: course.thumbnail,
      instructor: {
        _id: course.instructor._id,
        name: course.instructor.name,
        avatar: course.instructor.avatar,
        bio: course.instructor.bio || '',
        rating: course.instructor.rating || 0,
        students: course.instructor.students || 0,
      },
      price: course.price,
      category: course.category,
      level: course.level,
      duration: course.duration,
      rating: course.rating,
      totalStudents: course.totalStudents,
      students: 0,
      contents: [],
      content: [],
      announcements: [],
      createdAt: 'month',
      status: course.status,
      lessons: course.lessons,
      image: course.image,
      phone: course.phone
    }));

    setCourses(formattedCourses);
    setError('');
  } catch (err) {
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.error || err.message
      : err instanceof Error
        ? err.message
        : 'An unknown error occurred';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


export interface HandleEnrollOptions {
  navigate: NavigateFunction;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  alert: (message: string) => void;
  token: string;
  courseId: string;
}