import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, CheckCircle, Clock,
    ChevronLeft, ChevronRight,
    Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import Loading from '../../components/Common/Loading.tsx';
import AOS from 'aos';

type QuizQuestion = {
    question: string;
    options: string[];
    questionId: number;
};

type QuizData = {
    title: string;
    description: string;
    quizzes: QuizQuestion[];
};

type QuizResult = {
    success: boolean;
    score: number;
    total: number;
    results: {
        questionId: number;
        question: string;
        yourAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }[];
};

const QuizPage = () => {
    const { courseId, contentId } = useParams<{ courseId: string; contentId: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800);
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const api = import.meta.env.VITE_API_URL;
                const response = await axios.get(
                    `${api}/api/${courseId}/${contentId}/quiz`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (response.data && response.data.success && response.data.data) {
                    setQuizData(response.data.data);
                    setTimeLeft(1800);
                } else {
                    throw new Error('Quiz not found');
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to load quiz data');
                setLoading(false);
            }
        };

        if (token && courseId && contentId) {
            fetchQuiz();
        }
    }, [courseId, contentId, token]);

    // Timer effect
    useEffect(() => {
        if (!quizData || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizData, isSubmitted]);

    const currentQuestion = quizData?.quizzes?.[currentQuestionIndex];
    const progress = quizData ? ((currentQuestionIndex + 1) / quizData.quizzes.length) * 100 : 0;

    const handleOptionSelect = (option: string) => {
        if (isSubmitted || !currentQuestion) return;

        setSelectedOptions(prev => ({
            ...prev,
            [currentQuestion.questionId]: option
        }));
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const goToNext = () => {
        if (quizData && currentQuestionIndex < quizData.quizzes.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleSubmit = async () => {
        if (!quizData || !courseId || !contentId) return;

        try {
            // Format answers according to API requirements
            const answers = Object.entries(selectedOptions).map(([questionId, answer]) => ({
                questionId: parseInt(questionId),
                answer
            }));
            const api = import.meta.env.VITE_API_URL;
            const response = await axios.post(
                `${api}/api/${courseId}/${contentId}/quiz/submit`,
                { answers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setResult(response.data);
            setIsSubmitted(true);
        } catch (err) {
            setError('Failed to submit quiz');
            console.error('Quiz submission error:', err);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F0F0F] text-white">
                <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-orange-500">Error</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!quizData) {
        return null;
    }

    if (isSubmitted && result) {
        return (
            <div className="bg-gray-900 text-white min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <header className="bg-gray-800 p-6 rounded-t-lg flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-white hover:text-orange-500 mr-4"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="font-bold text-xl">{quizData.title}</h1>
                                <p className="text-gray-400 text-sm">{quizData.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-4xl font-bold mb-1 ${result.score / result.total >= 0.7
                                ? 'text-green-500'
                                : result.score / result.total >= 0.5
                                    ? 'text-yellow-500'
                                    : 'text-red-500'
                                }`}>
                                {Math.round((result.score / result.total) * 100)}%
                            </div>
                            <div className="text-gray-400 text-sm">
                                {result.score} out of {result.total} correct
                            </div>
                        </div>
                    </header>

                    <div className="bg-gray-800 rounded-lg p-8" data-aos="zoom-in">
                        <div className="grid grid-cols-1 gap-6">
                            {result.results.map((item, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${item.isCorrect
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-red-500 bg-red-500/10'
                                        }`}
                                >
                                    <h3 className="font-bold text-lg mb-3">
                                        Q{index + 1}: {item.question}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Your answer:</p>
                                            <p className={`font-medium ${item.isCorrect ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {item.yourAnswer}
                                            </p>
                                        </div>
                                        {!item.isCorrect && (
                                            <div>
                                                <p className="text-sm text-gray-400">Correct answer:</p>
                                                <p className="text-green-400 font-medium">
                                                    {item.correctAnswer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => navigate(`/courses/${courseId}/content/${contentId}`)}
                                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Back to Content
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentQuestionIndex(0);
                                    setSelectedOptions({});
                                    setIsSubmitted(false);
                                    setResult(null);
                                    setTimeLeft(1800);
                                }}
                                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <header className="bg-gray-800 p-6 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-orange-500 mr-4"
                        data-aos='zoom-in'
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center" data-aos='zoom-in'>
                        <div>
                            <h1 className="font-bold text-lg">{quizData.title}</h1>
                            <p className="text-gray-400 text-sm">{quizData.description}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400" data-aos='zoom-in'>
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(timeLeft)} remaining</span>
                    </div>
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex">
                <main className="flex-1 p-6">
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold mb-1">
                                    Question {currentQuestionIndex + 1} of {quizData.quizzes.length}
                                </h2>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-orange-500 font-medium">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-6">{currentQuestion?.question}</h3>
                            <div className="space-y-3">
                                {currentQuestion?.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`w-full text-left p-4 rounded-lg transition-colors ${selectedOptions[currentQuestion.questionId] === option
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-700 hover:bg-gray-600'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={goToPrevious}
                                disabled={currentQuestionIndex === 0}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${currentQuestionIndex === 0
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Previous</span>
                            </button>

                            {currentQuestionIndex === quizData.quizzes.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                                >
                                    <span>Submit Quiz</span>
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={goToNext}
                                    className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </main>

                <aside className="w-80 bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
                    <h3 className="font-bold text-lg mb-6">Quiz Navigation</h3>
                    <div className="space-y-3" data-aos='zoom-in'>
                        {quizData.quizzes.map((question, index) => (
                            <button
                                key={question.questionId}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-full flex items-center p-4 rounded-lg text-left transition-colors ${currentQuestionIndex === index
                                    ? 'bg-orange-500/20 border border-orange-500/30'
                                    : selectedOptions[question.questionId]
                                        ? 'bg-blue-500/10 border border-blue-500/20'
                                        : 'hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center mr-4">
                                    {selectedOptions[question.questionId] ? (
                                        <CheckCircle className="w-6 h-6 text-blue-500" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-medium ${currentQuestionIndex === index ? 'text-orange-500' : 'text-white'
                                        }`}>
                                        Question {index + 1}
                                    </h4>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-700 rounded-lg" data-aos='zoom-in'>
                        <h4 className="font-medium mb-2">Quiz Progress</h4>
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>
                                {Object.keys(selectedOptions).length} of {quizData.quizzes.length} answered
                            </span>
                            <span>
                                {Math.round((Object.keys(selectedOptions).length / quizData.quizzes.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                            <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{
                                    width: `${(Object.keys(selectedOptions).length / quizData.quizzes.length) * 100}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default QuizPage;