import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

const OAuthRedirect = () => {
  const { handleToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processToken = async () => {
      try {
        const token = searchParams.get('token');
        const redirectTo = searchParams.get('redirect') || '/home';
        
        if (!token) {
          throw new Error('No token found in URL');
        }

        await handleToken(token);
        navigate(redirectTo);
      } catch (error) {
        console.error('OAuth redirect error:', error);
        navigate('/auth/login?error=oauth_failed');
      }
    };

    processToken();
  }, [handleToken, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white text-lg animate-pulse">
        Completing authentication...
      </div>
    </div>
  );
};

export default OAuthRedirect;