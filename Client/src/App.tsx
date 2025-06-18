// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import LandingPage from "./Pages/LandingPage/LandingPage";
import BrowseCourses from "./Pages/BrowseCourse/BrowseCourse.tsx.tsx";
import HomePage from "./Pages/HomePage/HomePage";
import EnrolledCoursesPage from "./Pages/EnrolledCoursesPage/EnrolledCoursesPage";
import Auth from "./Pages/Auth/auth";
import CourseContent from "./Pages/CourseContentPage/CourseContentPage";
import ProfilePage from "./Pages/Profile/ProfilePage";
import Settings from "./Pages/Settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthRedirect from "./Pages/Auth/OAuthRedirect";
import VideoPlayerPage from "./Pages/LearningPage/VideoPlayerPage";
import Test from "./Pages/test/Test.tsx";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/:type" element={<Auth />} />
          <Route path="/oauth-redirect" element={<OAuthRedirect />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/CourseContent/:courseId/content" element={<CourseContent />} />
            <Route path="/EnrolledCoursesPage" element={<EnrolledCoursesPage />} />
            <Route path="/BrowseCousre" element={<BrowseCourses />} />
            <Route path="/VideoPlayerPage" element={<VideoPlayerPage/>} />
            <Route path="/Test" element={<Test />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;