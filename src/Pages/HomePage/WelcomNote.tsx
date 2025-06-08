import { useEffect, useState } from 'react';

const greetings = [
  'नमस्ते',       // Hindi
  'Hello',        // English
  'வணக்கம்',      // Tamil
  'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', // Punjabi
  'ନମସ୍କାର',       // Odia
  'নমস্কার',       // Bengali
  'నమస్కారం',     // Telugu
  'ನಮಸ್ಕಾರ',      // Kannada
  'नमस्कार',       // Marathi
  'سلام',          // Urdu
  'Bonjour',       // French
  'Hola',          // Spanish
];

const WelcomeNote = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 1500); // change greeting every 1 second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-12 px-6 md:px-16 rounded-lg shadow-xl overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/classroom-kids.png')] bg-cover bg-center pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Greeting animation */}
        <div className="h-[70px] overflow-hidden mb-1">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateY(-${index * 70}px)`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {greetings.map((greet, idx) => (
              <div
                key={idx}
                className="h-[70px] text-3xl sm:text-4xl font-bold text-yellow-300 p-3"
              >
                {greet}
              </div>
            ))}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
          Welcome to <span className="text-yellow-300">GyaanDeepika</span> ✨
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
          Bringing high-quality learning to every corner of India — regardless of geography or language. Start your journey toward knowledge today.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full transition duration-300">
            Start Learning
          </button>
          <button className="bg-white text-gray-800 hover:bg-blue-200 font-medium py-2 px-6 rounded-full transition duration-300">
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNote;
