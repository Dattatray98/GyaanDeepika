

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Basic Mathematics',
    description: 'Build your foundation in addition, subtraction, and more.',
    category: 'Education',
    thumbnail: '/courses/math.jpg',
  },
  {
    id: 2,
    title: 'Health & Hygiene',
    description: 'Learn essential tips to stay healthy and clean.',
    category: 'Wellness',
    thumbnail: '/courses/health.jpg',
  },
  {
    id: 3,
    title: 'English Speaking Skills',
    description: 'Improve your communication with simple English.',
    category: 'Language',
    thumbnail: '/courses/english.jpg',
  },
  {
    id: 4,
    title: 'Science in Daily Life',
    description: 'Understand how science impacts the world around you.',
    category: 'Education',
    thumbnail: '/courses/science.jpg',
  },
];

const ExploreCourse = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6 sm:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 ">
        📚 Explore Our Courses
      </h1>
        <div className='border-b-2 border-gray-400 h-15 w-full mb-10 flex items-center pl-3 gap-5 '>
            <b>Basic Mathematics</b>
            <b>Scince In Daily Life</b>
            <b>Helth & Hygiene</b>
            <b>English Speaking Skills</b>
        </div>

      <div data-aos="fade-up"  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                {course.category}
              </span>
              <h2 className="mt-2 text-lg font-semibold text-gray-800">{course.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
              <button className="mt-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreCourse;
