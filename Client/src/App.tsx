// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import BrowseCourses from "./Pages/BrowseCourse/BrowseCousre";
import HomePage from "./Pages/HomePage/HomePage";
import EnrolledCoursesPage from "./Pages/EnrolledCoursesPage/EnrolledCoursesPage";
import LearningPage from "./Pages/LearningPage/LearningPage";
// import SignUp from "./Pages/Auth/SignUp";
// import Login from "./Pages/Auth/Login";
import Auth from "./Pages/Auth/Auth";



function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/:type" element={<Auth />} />
          {/* <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login " element={<Login />} /> */}
          <Route path="/HomePage" element={<HomePage />} />

          <Route path="/EnrolledCoursesPage" element={<EnrolledCoursesPage />} />
          <Route path="/BrowseCousre" element={<BrowseCourses />} />
          <Route path="/LearningPage" element={<LearningPage />} />
        </Routes>
      </Router>
  );
}

export default App;
