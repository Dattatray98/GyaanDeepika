
// Services Section
const ServicesSection = () => {
  const services = [
    {
      title: "Interactive Learning Modules",
      description: "Engaging educational content designed for rural students with limited resources.",
      icon: "📚"
    },
    {
      title: "Health Awareness Programs",
      description: "Essential health knowledge delivered through interactive mobile platforms.",
      icon: "🏥"
    },
    {
      title: "Teacher Training",
      description: "Empowering local educators with modern teaching methodologies.",
      icon: "👩‍🏫"
    },
    {
      title: "Community Engagement",
      description: "Building sustainable learning ecosystems in rural communities.",
      icon: "🤝"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            data-aos="fade-up"
          >
            What We Offer
          </h2>
          <p 
            className="text-gray-400 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Empowering rural students through accessible education and essential health knowledge with AI and modern tech.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-700 p-6 rounded-xl hover:bg-gray-600 transition-colors"
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection
