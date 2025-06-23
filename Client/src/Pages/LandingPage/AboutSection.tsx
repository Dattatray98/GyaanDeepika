

// About Section
const AboutSection = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-6"
              data-aos="fade-right"
            >
              Empowering Rural Education & Awareness
            </h2>
            <p 
              className="text-lg text-gray-300 mb-6 leading-relaxed"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <span className="font-semibold text-purple-400">GyaanDeepika</span> bridges the education gap in rural areas using <span className="font-semibold">AI + Connectivity</span> to deliver school education and essential knowledge to learners who need it most.
            </p>
            <ul className="space-y-3 text-gray-300 font-medium mb-8">
              {[
                "AI-powered lessons in local languages",
                "Designed for low-connectivity areas",
                "Mobile-first accessible interface",
                "Collaboration with schools and community centers"
              ].map((item, index) => (
                <li 
                  key={index}
                  data-aos="fade-right"
                  data-aos-delay={200 + (index * 100)}
                >
                  ✔️ {item}
                </li>
              ))}
            </ul>
            <button
              data-aos="fade-up"
              data-aos-delay="600"
              className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Learn more about us
            </button>
          </div>

          {/* Image */}
          <div data-aos="zoom-in" data-aos-delay="300">
            <img
              src="/about.png"
              alt="Digital learning"
              className="w-full max-w-md rounded-lg shadow-xl mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};


export default AboutSection
