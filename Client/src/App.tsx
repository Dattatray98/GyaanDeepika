// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import LandingPage from "./Pages/LandingPage/LandingPage";
import BrowseCourses from "./Pages/BrowseCourse/BrowseCousre";
import HomePage from "./Pages/HomePage/HomePage";
import EnrolledCoursesPage from "./Pages/EnrolledCoursesPage/EnrolledCoursesPage";
import LearningPage from "./Pages/LearningPage/LearningPage";
import Auth from "./Pages/Auth/auth";
import CourseContent from "./Pages/CourseContentPage/CourseContent";
import ProfilePage from "./Pages/Profile/ProfilePage";
import Settings from "./Pages/Settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthRedirect from "./Pages/Auth/OAuthRedirect";

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
            <Route path="/CourseContent" element={<CourseContent />} />
            <Route path="/EnrolledCoursesPage" element={<EnrolledCoursesPage />} />
            <Route path="/BrowseCousre" element={<BrowseCourses />} />
            <Route path="/LearningPage" element={<LearningPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;