
const SelectCourse = () => {
  return (
    <div className="bg-white px-6 py-10 md:px-12 lg:px-20 text-center rounded-lg shadow-md">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-10">
        🎓 Start Your Learning Journey Today!
      </h2>

      <p className="text-[#4b5563] text-lg md:text-xl mb-6">
        Join our free and flexible courses designed especially for rural learners. Learn in your language, at your pace, from trusted educators.
      </p>

      <ul className="text-left text-[#374151] text-base md:text-lg mb-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <li>📚 Classes from <b>5 to 12</b> for all major subjects</li>
        <li>🧑‍🏫 <b>Expert teachers</b> guiding every step</li>
        <li>🌐 Available in <b>Marathi, Hindi, English </b> and more language</li>
        <li>📱 Works on <b>low internet & mobile</b> devices</li>
        <li>🕒 Learn at <b>your own pace</b>, anytime</li>
        <li>🆓 <b>Completely free</b> for all rural learners</li>
      </ul>

      <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
        Register Now
      </button>
    </div>
  );
};

export default SelectCourse;


