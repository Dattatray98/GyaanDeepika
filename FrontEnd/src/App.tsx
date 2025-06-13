import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import AuthPage from './Pages/auth/auth';
import ResponsiveLayout from './Pages/HomePage/HomePage';
import Profile from './Pages/ProfilePage/ProfilePage';
import CourseDashboard from './Pages/ProfilePage/CourseDashboard';
import EditProfile from './Pages/ProfilePage/EditProfile';
import LearningPage from './Pages/LearningDetail/LearningPage';
import AssessmentPage from './Pages/LearningDetail/AssessmentPage';
import CourseContent from './Pages/LearningDetail/CourseContent';
import DataComponent from './testfiles/DataComponent';
import DataUpload from './testfiles/VideoUploader';
import BrowseCourses from './Pages/LearningDetail/BrowseCourses';
import EnrolledCoursesPage from './Pages/LearningDetail/EnrolledCoursesPage';



export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<ResponsiveLayout />} />
        <Route path="/auth/:type" element={<AuthPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/CourseDashboard" element={<CourseDashboard />} />
        <Route path="/ProfileEdit" element={<EditProfile />} />
        <Route path="/LearningPage" element={<LearningPage />} />
        <Route path="/AssessmentPage" element={<AssessmentPage />} />
        <Route path="/CourseContent" element={<CourseContent />} />
        <Route path="/DataComponents" element={<DataComponent />} />
        <Route path="/DataUpload" element={<DataUpload />} />
        <Route path="/BrowseCourses" element={<BrowseCourses />} />
        <Route path='/EnrolledCoursesPage' element={<EnrolledCoursesPage />} />
      </Routes>
  );
}
