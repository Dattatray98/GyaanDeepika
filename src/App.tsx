import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import AuthPage from './Pages/auth/auth';
import HomePage from './Pages/HomePage/HomePage';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth/:type" element={<AuthPage />} />
      </Routes>
  );
}
