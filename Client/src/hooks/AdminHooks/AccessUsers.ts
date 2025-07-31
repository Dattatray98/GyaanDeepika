import { useEffect } from 'react';
import axios from 'axios';
import type { UserData } from '../../components/Common/Types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const AccessUsers = (
  setUsers: React.Dispatch<React.SetStateAction<UserData[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          throw new Error('Authentication token missing - please login again');
        }

        const api = import.meta.env.VITE_API_URL;
        const url = `${api}/users/allusers`;

        console.debug('[API Request] Fetching users from:', url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          validateStatus: (status) => status < 500,
        });

        console.debug('[API Response] Status:', response.status, 'Data:', response.data);

        if (response.status === 401) {
          console.warn('Authentication failed - redirecting to login');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const responseData = response.data;

        if (!responseData?.success || !Array.isArray(responseData.data)) {
          throw new Error(responseData?.error || 'Invalid API response format');
        }

        const userData: UserData[] = responseData.data
          .map((user: any) => {
            if (!user.id || !user.name || !user.email) {
              console.warn('Invalid user data skipped:', user);
              return null;
            }

            return {
              id: user.id,
              firstName: user.firstName,
              lastName : user.lastName,
              email: user.email,
              phone: user.phone || 'Not provided',
              location: user.location || 'Not provided',
              joinDate: new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
              status: user.status || 'inactive',
              role: user.role || 'user',
              avatar: user.avatar || user.name.charAt(0).toUpperCase(),
              courses: user.courses || 0,
              certificates: user.certificates || 0,
            };
          })
          .filter((u:any): u is UserData => u !== null);


        setUsers(userData);
        console.debug('[Success] Users loaded:', userData.length);
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch users';

        if (axios.isAxiosError(err)) {
          if (err.response) {
            console.error('[API Error] Server responded with:', err.response.status, err.response.data);
            errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
          } else if (err.request) {
            console.error('[API Error] No response received:', err.request);
            errorMessage = 'Server not responding - check your connection';
          } else {
            console.error('[API Error] Request setup failed:', err.message);
            errorMessage = err.message;
          }
        } else if (err instanceof Error) {
          console.error('[Error]', err.message);
          errorMessage = err.message;
        }

        setError(errorMessage);
        console.error('Full error object:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setError('Authentication required');
      setLoading(false);
      navigate('/login');
    }
  }, [token, navigate, setUsers, setLoading, setError]);
};

export default AccessUsers;
