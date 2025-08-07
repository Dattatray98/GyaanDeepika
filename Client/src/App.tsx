// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.tsx';

// User-facing pages
import LandingPage from "./Pages/LandingPage/LandingPage.tsx";
import BrowseCourses from "./Pages/BrowseCourse/BrowseCourse.tsx";
import HomePage from "./Pages/HomePage/HomePage.tsx";
import EnrolledCoursesPage from "./Pages/EnrolledCoursesPage/EnrolledCoursesPage.tsx";
import CourseContent from "./Pages/CourseContentPage/CourseContentPage.tsx";
import ProfilePage from "./Pages/Profile/ProfilePage.tsx";
import Settings from "./Pages/Settings/Settings.tsx";
import OAuthRedirect from "./Pages/Auth/OAuthRedirect.tsx";
import VideoPlayerPage from "./Pages/LearningPage/VideoPlayerPage.tsx";
import Auth from "./Pages/Auth/Auth.tsx";
import QuizPage from "./Pages/QuizPage/QuizPage.tsx";
import ProfileEditPage from "./Pages/Profile/ProfileEditPage.tsx";
import StudyHubPage from "./Pages/StudyHub/StudyHubPage.tsx";
import StudyHubUpload from "./Pages/Admin/StudyHubUpload.tsx";

// Admin dashboard
import AdminLayout from './Pages/Admin/AdminLayout.tsx';

// Auth
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import MaterialView from "./Pages/StudyHub/MaterialView.tsx";
import PrivacyPolicy from "./components/PrivacyPolicy.tsx";
import TermsAndConditions from "./components/TermsAndConditions.tsx";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* 🌐 Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/:type" element={<Auth />} />
          <Route path="/oauth-redirect" element={<OAuthRedirect />} />
          <Route path="/StudyHub" element={<StudyHubPage />} />
          <Route path="/StudyHub/Upload" element={<StudyHubUpload />} />
          <Route path="/material/:pdfUrl" element={<MaterialView />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions /> } />
          {/* If you want a more specific route for downloads: */}
          <Route path="/view-material/:id" element={<MaterialView />} />

          {/* 🔐 Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/profileEditPage" element={<ProfileEditPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/CourseContent/:courseId/content" element={<CourseContent />} />
            <Route path="/EnrolledCoursesPage" element={<EnrolledCoursesPage />} />
            <Route path="/BrowseCousre" element={<BrowseCourses />} />
            <Route path="/courses/:courseId/content/:contentId" element={<VideoPlayerPage />} />
            <Route path="/courses/:courseId/content/:contentId/quiz" element={<QuizPage />} />
          </Route>

          {/* <Route element={<AdminRoute />}> */}
          {/* </Route> */}
            <Route path="/admin/*" element={<AdminLayout />} />



          {/* ❓Fallback */}
          <Route path="*" element={<LandingPage />} />

        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
