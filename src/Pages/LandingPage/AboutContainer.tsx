
const AboutContainer = () => {
  return (
    <section  className="bg-white dark:bg-gray-900 py-20 px-6 md:px-12 lg:px-24">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      {/* Text Content */}
      <div data-aos="fade-up">
        <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Empowering Rural Education & Awareness
        </h2>

        <p data-aos="fade-up" className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          <span className="font-semibold text-purple-700 dark:text-purple-400">GyaanDeepika</span> is a social innovation that bridges the education and awareness gap in underserved rural areas. Using <span className="font-semibold">AI + Connectivity</span>, we deliver school education and life-essential knowledge to learners who need it the most.
        </p>

        <ul className="space-y-3 text-gray-700 dark:text-gray-300 font-medium">
          <li data-aos="fade-up">📘 AI-powered lessons in local languages</li>
          <li data-aos="fade-up">📡 Designed for low-connectivity areas (5G, Edge, IoT ready)</li>
          <li data-aos="fade-up">📱 Mobile-first & accessible interface</li>
          <li data-aos="fade-up">🏫 Collaboration with schools and community centers</li>
        </ul>

        <p data-aos="fade-up" className="mt-6 text-md font-semibold text-purple-700 dark:text-purple-300">
          Lighting the path of knowledge — one village at a time.
        </p>
      </div>

      {/* Image or Illustration */}
      <div data-aos="zoom-in" className="flex justify-center md:justify-end">
        <img

          src="/about.png" // Replace with your actual image path
          alt="Illustration of digital learning"
          className="w-full max-w-md rounded-lg animate-fade-in"
        />
      </div>
      <div>
        <button data-aos="fade-up" className="ml-22 px-5 py-2 border-2 border-white rounded-[8px] text-white font-medium">
          Learn more about us
        </button>
      </div>
    </div>
  </section>
  )
}

export default AboutContainer
