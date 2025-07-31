// src/api/AvailableCourses.ts
import { useEffect } from 'react';
import axios from 'axios';
import type { CourseData } from '../../components/Common/Types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AvailableCourses = (
  setCourses: React.Dispatch<React.SetStateAction<CourseData[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          throw new Error('Authentication token missing – please login again');
        }

        const api = import.meta.env.VITE_API_URL;

        const response = await axios.get(`${api}/api/courses/getallcourses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          validateStatus: (status) => status < 500, // Accept 2xx, 4xx
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.data?.success || !Array.isArray(response.data.data)) {
          throw new Error('Invalid or unexpected API response');
        }

        const formattedCourses: CourseData[] = response.data.data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          createdAt: course.createdAt,
          instructor: course.instructor
            ? {
              _id: course.instructor._id,
              name: course.instructor.name,
              avatar: course.instructor.avatar,
              bio: course.instructor.bio || '',
              rating: parseFloat(course.instructor.rating) || 0,
              students: course.instructor.students || 0,
            }
            : undefined,
          rating: parseFloat(course.rating) || 0,
          totalStudents: course.totalStudents || 0,
        }));

        setCourses(formattedCourses);
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch courses';

        if (axios.isAxiosError(err)) {
          if (err.response) {
            errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
          } else if (err.request) {
            errorMessage = 'Server not responding – check your internet connection.';
          } else {
            errorMessage = err.message;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCourseData();
    } else {
      setError('Authentication required');
      setLoading(false);
      navigate('/login');
    }
  }, [token, navigate, setCourses, setLoading, setError]);
};

export default AvailableCourses;
