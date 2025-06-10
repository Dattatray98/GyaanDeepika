
const LearningPage = () => {
  return (
    <div className="border-2 border-red-800 bg-[#f9fafb] p-2 h-full">
      {/* Top Section: Video + Lesson Info */}
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 w-full h-[70vh]">
        
        {/* Video Player */}
        <div className=" w-full max-h-[70vh] min-h-[20vh] border-2 border-yellow-800 col-span-2 bg-black rounded-lg overflow-hidden shadow-lg">
         <iframe className="w-full h-full"
        src="https://www.youtube.com/embed/JgDNFQ2RaLQ" title="Ed Sheeran - Sapphire (Official Music Video)" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>

        {/* Lesson Information Panel */}
        <div className="bg-white rounded-lg p-4 shadow-md space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">Lesson 1: Introduction to Solar Energy</h2>
          <p className="text-gray-600 text-sm">Understand the basics of solar energy, how it works, and why it's important.</p>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4">
            ✅ Mark as Completed
          </button>

          <div className="mt-5">
            <h4 className="font-semibold text-gray-700 mb-2">Resources</h4>
            <ul className="list-disc list-inside text-sm text-blue-600">
              <li><a href="/files/solar-intro.pdf" target="_blank">Download Notes (PDF)</a></li>
              <li><a href="/files/solar-poster.jpg" target="_blank">Infographic</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section: AI Doubt Assistant */}
      <div className="max-w-6xl mx-auto mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">💬 Ask Your Doubts</h3>
        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Type your question here..."
            className="flex-grow border border-gray-300 rounded-md px-4 py-2"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
            Ask AI
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default LearningPage;



