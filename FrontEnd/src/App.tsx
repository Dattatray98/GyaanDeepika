import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import AuthPage from './Pages/auth/auth';
import HomePage from './Pages/HomePage/HomePage';
import Profile from './Pages/ProfilePage/ProfilePage';
import CourseDashboard from './Pages/ProfilePage/CourseDashboard';
import EditProfile from './Pages/ProfilePage/EditProfile';
import LearningPage from './Pages/LearningDetail.tsx/LearningPage';
import AssessmentPage from './Pages/LearningDetail.tsx/AssessmentPage';
import CourseContent from './Pages/LearningDetail.tsx/CourseContent';


export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auth/:type" element={<AuthPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/CourseDashboard" element={<CourseDashboard />} />
        <Route path="/ProfileEdit" element={<EditProfile />} />
        <Route path="/LearningPage" element={<LearningPage />} />
        <Route path="/AssessmentPage" element={<AssessmentPage />} />
        <Route path="/CourseContent" element={<CourseContent />} />

      </Routes>
  );
}
