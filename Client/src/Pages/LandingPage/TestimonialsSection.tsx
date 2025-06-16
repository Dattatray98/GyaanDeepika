
// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "GyaanDeepika has transformed our village school. Students are more engaged and learning outcomes have improved dramatically.",
      author: "Rajesh Kumar, Teacher",
      location: "Rural Maharashtra"
    },
    {
      quote: "The health awareness programs have made a real difference in our community. We're seeing better hygiene practices now.",
      author: "Priya Sharma, Community Leader",
      location: "Odisha"
    },
    {
      quote: "Finally, quality education that works even with our intermittent internet connection. A game-changer for rural India.",
      author: "Amit Patel, Parent",
      location: "Uttar Pradesh"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            data-aos="fade-up"
          >
            Success Stories
          </h2>
          <p 
            className="text-gray-400 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Hear from those whose lives we've impacted through our initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg"
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              <div className="text-gray-300 mb-4 italic">"{testimonial.quote}"</div>
              <div className="border-t border-gray-700 pt-4">
                <p className="font-medium text-white">{testimonial.author}</p>
                <p className="text-gray-400 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection
