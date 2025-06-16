// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './Pages/context/AuthContext';
import LandingPage from "./Pages/LandingPage/LandingPage";
import BrowseCourses from "./Pages/BrowseCourse/BrowseCousre";
import HomePage from "./Pages/HomePage/HomePage";
import EnrolledCoursesPage from "./Pages/EnrolledCoursesPage/EnrolledCoursesPage";
import LearningPage from "./Pages/LearningPage/LearningPage";
import Auth from "./Pages/Auth/auth";
import CourseContent from "./Pages/CourseContentPage/CourseContent";
import ProfilePage from "./Pages/Profile/ProfilePage";
import Settings from "./Pages/Settings/Settings";
import ProtectedRoute from "./Pages/components/ProtectedRoute";
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/course-content" element={<CourseContent />} />
            <Route path="/enrolled-courses" element={<EnrolledCoursesPage />} />
            <Route path="/browse-courses" element={<BrowseCourses />} />
            <Route path="/learning" element={<LearningPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;