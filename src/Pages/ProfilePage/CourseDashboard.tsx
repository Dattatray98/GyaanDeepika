
const courses = [
  {
    id: 1,
    title: "📖 Basic Math (Class 6-8)",
    description: "Understand numbers, fractions, and equations easily.",
    progress: 60,
    language: "Hindi",
  },
  {
    id: 2,
    title: "🌱 Life Skills for Rural Teens",
    description: "Learn communication, safety, and daily life skills.",
    progress: 20,
    language: "Marathi",
  },
  {
    id: 3,
    title: "🧪 Science Experiments at Home",
    description: "Fun and safe experiments using home materials.",
    progress: 0,
    language: "Telugu",
  },
  {
    id: 4,
    title: "💻 Digital Skills for Beginners",
    description: "Learn how to use a computer and internet safely.",
    progress: 75,
    language: "English",
  },
];

const CourseDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fa] p-6 sm:p-10">
      <h2 className="text-3xl font-bold text-[#1d1d1d] mb-6">📚 My Courses</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold text-[#1d1d1d] mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#1d1d1d] font-medium">Language: {course.language}</span>
              <span className="text-sm text-[#ff8c00] font-semibold">
                {course.progress}% Complete
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-green-500 rounded transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>

            <button
              className="mt-4 w-full py-2 bg-[#1d1d1d] text-white rounded-md hover:bg-[#333]"
              onClick={() => alert(`Continue: ${course.title}`)}
            >
              {course.progress > 0 ? "Continue Learning" : "Start Course"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDashboard;
