import { Routes, Route } from 'react-router-dom';
import AiPage from './Pages/Ai-Page/AiPage';
import LandingPage from './Pages/LandingPage/LandingPage';
import AuthPage from './Pages/auth/auth';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ai" element={<AiPage />} />
        <Route path="/auth/:type" element={<AuthPage />} />
      </Routes>
  );
}
