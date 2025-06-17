import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  googleLogin: () => void;
  logout: () => void;
  loading: boolean;
  error: string | null;
  handleToken: (token: string) => Promise<void>;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const handleToken = useCallback(async (token: string) => {
    try {
      localStorage.setItem('token', token);
      setToken(token);
      
      const response = await axios.get(`http://localhost:8000/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser({
        id: response.data.id,
        name: response.data.name || `${response.data.firstName} ${response.data.lastName}`,
        email: response.data.email
      });
    } catch (err) {
      console.error('Token validation failed:', err);
      logout();
      throw err;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !user) {
        try {
          await handleToken(storedToken);
        } catch {
          logout();
        }
      }
      setInitialized(true);
    };

    initializeAuth();
  }, [handleToken, user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:8000/users/login`, { email, password });
      await handleToken(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:8000/users/signup`, userData);
      await handleToken(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.location.href = `http://localhost:8000/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      signup, 
      googleLogin, 
      logout, 
      loading, 
      error,
      handleToken,
      initialized
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};