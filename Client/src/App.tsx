// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import BrowseCourses from "./Pages/BrowseCourse/BrowseCousre";
import HomePage from "./Pages/HomePage/HomePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/BrowseCousre" element={<BrowseCourses />} />
      </Routes>
    </Router>
  );
}

export default App;
