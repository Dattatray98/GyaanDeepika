import { useEffect } from 'react';
import axios from 'axios';
import type { UserData } from '../components/Common/Types';
import { useAuth } from '../context/AuthContext';

const ProfileFetchUser = (
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
    const { token } = useAuth();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const api = import.meta.env.VITE_API_URL;

                const response = await axios.get(`${api}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data) {
                    setUser(response.data); // assuming `response.data` is the user object
                }
            } catch (err) {
                console.error("❌ Error fetching user data:", err);
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [setUser, setLoading, setError]);
};

export default ProfileFetchUser;
