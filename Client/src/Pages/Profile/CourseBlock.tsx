import { Link } from "react-router-dom";

const CourseBlock: React.FC = () => {
  return (
    <div className="rounded-xl p-6 w-full bg-gray-800">
      {/* Quick Access */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-white">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/EnrolledCoursesPage" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg text-center transition-colors shadow-md">
            Your Courses
          </Link>
          <Link to="/Assignments" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center transition-colors shadow-md">
            Assignments
          </Link>
          <Link to="/Certificates" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-center transition-colors shadow-md">
            Certificates
          </Link>
        </div>
      </div>

      {/* Enrolled Course */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Enrolled Course</h3>
        <div className="rounded-lg p-4 bg-gray-700/50">
          <h4 className="text-lg font-bold mb-2 text-orange-500">Full Stack Web Development</h4>
          <p className="text-sm mb-3 text-gray-300">Progress: 45%</p>
          <div className="w-full rounded-full h-2.5 mb-4 bg-gray-600">
            <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "45%" }}></div>
          </div>
          <Link to="/EnrolledCoursesPage" className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors inline-flex items-center">
            Continue Learning
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseBlock;
