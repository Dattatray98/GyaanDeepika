

// Call to Action
const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center">
        <h2 
          className="text-3xl sm:text-4xl font-bold text-white mb-6"
          data-aos="fade-up"
        >
          Ready to Make a Difference?
        </h2>
        <p 
          className="text-gray-200 max-w-2xl mx-auto mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Join us in our mission to bring quality education to every corner of India.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Donate Now
          </button>
          <button
            data-aos="fade-up"
            data-aos-delay="300"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors"
          >
            Volunteer
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction
