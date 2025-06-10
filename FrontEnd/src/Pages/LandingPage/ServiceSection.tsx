import { useEffect, useState } from 'react';

interface Offering {
  title: string;
  description: string;
  image: string;
}

const ServiceSection = ({ category }: { category: string }) => {
  const [offering, setOffering] = useState<Offering[]>([]);

  useEffect(() => {
    fetch('/jsondatafile/data.json') // Make sure path is correct relative to `public` directory
      .then((res) => res.json())
      .then((data) => {
        setOffering(data[category] || []);
      });
  }, [category]);

  return (
    <section className="dark:bg-gray-900 text-white py-16 px-6 md:px-16" id="offerings">
      <div data-aos="fade-up" className="max-w-6xl mx-auto text-center">
        <h2 data-aos="fade-up" className="text-4xl font-bold mb-4">What We Offer</h2>
        <p data-aos="fade-up" className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Empowering rural students through accessible education and essential health knowledge with AI and modern tech.
        </p>
        <div  className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {offering.map((item, index) => (
            <div
            data-aos="fade-up"
              key={index}
              className="bg-gray-600 p-6 rounded-xl border border-gray-200 shadow hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.image}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
