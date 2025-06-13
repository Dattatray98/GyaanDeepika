import { Link } from "react-router-dom";

const CourseBlock: React.FC = () => {
  return (
    <div className="flex w-full border-[0.5px] border-gray-700 rounded-xl mb-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-h-[80vh] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white p-6">
        
        {/* Quick Access Dashboard */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3">Quick Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/CourseDashboard" className="bg-[#ff8c00] text-white px-4 py-2 rounded-lg text-center shadow-md hover:scale-[1.02] duration-200">
              Your Courses
            </Link>
            <Link to="/Assignments" className="bg-[#29a19c] text-white px-4 py-2 rounded-lg text-center shadow-md hover:scale-[1.02] duration-200">
              Assignments
            </Link>
            <Link to="/Certificates" className="bg-[#6c5ce7] text-white px-4 py-2 rounded-lg text-center shadow-md hover:scale-[1.02] duration-200">
              Certificates
            </Link>
          </div>
        </div>

        {/* Course Details */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Enrolled Course</h3>
          <div className="bg-[#ffffff0a] border border-white/10 rounded-lg p-4 shadow-md">
            <h4 className="text-lg font-bold mb-1 text-orange-400">Full Stack Web Development</h4>
            <p className="text-sm text-gray-300 mb-2">Progress: 45%</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <Link to="/CourseDashboard" className="underline text-sm text-orange-300 hover:text-orange-200">
              Continue Learning →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseBlock;
