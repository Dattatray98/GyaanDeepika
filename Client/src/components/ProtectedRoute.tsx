import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const ProtectedRoute = () => {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate 
      to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} 
      replace 
      state={{ from: location }}
    />
  );
};

export default ProtectedRoute;