import { useEffect } from 'react';
import axios from 'axios';
import type { UserData, Course, Announcement } from '../components/Common/Types';
import { useAuth } from '../context/AuthContext';

type FetchHomepageData = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  setEnrolledCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setRecommendedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
};

const FetchHomepageData = ({
  setLoading,
  setError,
  setUserData,
  setEnrolledCourses,
  setRecommendedCourses,
  setAnnouncements
}: FetchHomepageData) => {
  const token = useAuth();

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!token) throw new Error('No auth token found');
        const api = import.meta.env.VITE_API_URL;

        // 1. Fetch user
        const userResponse = await axios.get(`${api}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal
        });
        if (!isMounted) return;
        setUserData(userResponse.data);

        // 2. Enrolled courses
        const enrolledResponse = await axios.get(`${api}/api/enrolled/enrolled`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: abortController.signal
        });

        const enrolledCoursesData = Array.isArray(enrolledResponse.data?.data)
          ? enrolledResponse.data.data
          : [];

        const course = enrolledCoursesData.map((course: any) => ({
          ...course,
        }));
        if (isMounted) setEnrolledCourses(course);

        // 3. Recommended
        const recommendedResponse = await axios.get(`${api}/api/courses/unenrolled`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal
        });
        if (isMounted) {
          setRecommendedCourses(recommendedResponse.data?.data || []);
        }

        // 4. Announcements
        if (enrolledCoursesData.length > 0) {
          const announcementPromises = enrolledCoursesData.map((course: any) =>
            axios
              .get(`${api}/api/enrolled/${course._id}/content`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: abortController.signal
              })
              .catch(() => ({ data: { announcements: [] } }))
          );

          const announcementResponses = await Promise.all(announcementPromises);
          const allAnnouncements: Announcement[] = announcementResponses.flatMap(
            (res) => res.data?.announcements || []
          );

          if (isMounted) {
            setAnnouncements(allAnnouncements);
          }
        }
      } catch (err) {
        if (!isMounted || axios.isCancel(err)) return;

        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : err instanceof Error
          ? err.message
          : 'Failed to load data';

        console.error('Fetch error:', err);
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);
};

export default FetchHomepageData;
