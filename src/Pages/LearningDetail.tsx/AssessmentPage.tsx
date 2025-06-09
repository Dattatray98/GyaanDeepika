import { useState } from 'react';
import Navbar from '../LandingPage/Navbar';

const questions = [
  {
    question: 'What is the capital of India?',
    options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
    answer: 'Delhi',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
    answer: 'Mars',
  },
  // Add more questions as needed
];

const AssessmentPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-800 px-4 py-8 flex flex-col items-center">
      <Navbar />
      <div className="bg-white shadow-lg rounded-lg p-6 w-full">
        {!showResult ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-lg font-medium text-gray-800 mb-6">
              {questions[currentQuestion].question}
            </p>

            <div className="flex flex-col gap-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  className={`px-4 py-2 rounded border text-left max-w-2xl ${
                    selectedOption === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-blue-100'
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`mt-6 px-6 py-2 rounded font-semibold ${
                selectedOption
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Quiz Completed!</h2>
            <p className="text-xl text-gray-800">Your Score: {score} / {questions.length}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AssessmentPage;
