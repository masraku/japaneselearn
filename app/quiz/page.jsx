"use client";

import { useEffect, useState, useCallback } from "react";
import { useProgress } from "@/lib/progress-context";
import Link from "next/link";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const LEVELS = [
  { id: "N5", label: "JLPT N5", grades: ["1", "2"], description: "Beginner", color: "from-green-500 to-green-600" },
  { id: "N4", label: "JLPT N4", grades: ["3", "4"], description: "Elementary", color: "from-blue-500 to-blue-600" },
  { id: "N3", label: "JLPT N3", grades: ["5", "6"], description: "Intermediate", color: "from-purple-500 to-purple-600" },
  { id: "mixed", label: "Mixed", grades: ["1", "2", "3", "4", "5", "6"], description: "All Levels", color: "from-orange-500 to-red-600" },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

// Level Selection Component
function LevelSelector({ onSelect, quizStats }) {
  const [questionCount, setQuestionCount] = useState(10);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Kanji Quiz</h1>
        <p className="text-gray-600">Test your kanji knowledge</p>
      </div>

      {/* Question Count */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-700 mb-3">Number of Questions</h3>
        <div className="flex gap-2 justify-center">
          {QUESTION_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                questionCount === count
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Level Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {LEVELS.map((level) => {
          const stats = quizStats(level.id);
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level, questionCount)}
              className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 text-white text-left hover:scale-105 transition-transform shadow-lg`}
            >
              <div className="text-3xl font-bold mb-1">{level.label}</div>
              <p className="opacity-90 mb-4">{level.description}</p>
              {stats.totalQuizzes > 0 && (
                <div className="text-sm opacity-80 space-y-1">
                  <div>Quizzes: {stats.totalQuizzes}</div>
                  <div>Best: {stats.bestScore}%</div>
                  <div>Average: {stats.averageScore}%</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quiz History Preview */}
      <QuizHistorySection />
    </div>
  );
}

// Quiz History Section
function QuizHistorySection() {
  const { quizHistory } = useProgress();

  if (quizHistory.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
      <h3 className="font-bold text-gray-800 mb-4">📊 Recent Quiz Results</h3>
      <div className="space-y-3">
        {quizHistory.slice(0, 5).map((quiz) => {
          const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
          return (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    percentage >= 80
                      ? "bg-green-500"
                      : percentage >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {percentage}
                </span>
                <div>
                  <div className="font-medium">{quiz.level} Quiz</div>
                  <div className="text-xs text-gray-500">
                    {new Date(quiz.date).toLocaleDateString()} • {quiz.totalQuestions} questions
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-700">
                {quiz.score}/{quiz.totalQuestions}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Quiz Component
function Quiz({ level, questionCount, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);

  // Fetch kanji and generate quiz
  useEffect(() => {
    async function generateQuiz() {
      setLoading(true);
      setError(null);

      try {
        // Fetch kanji from all grades for this level
        const promises = level.grades.map((grade) =>
          fetch(`/api/kanji/grade?grade=${grade}`).then((res) => res.json())
        );
        const results = await Promise.all(promises);
        const allKanji = results.flatMap((r) => r.kanji || []);

        // Filter kanji with valid meanings
        const validKanji = allKanji.filter(
          (k) => k.character && k.meaning && k.meaning.trim() !== ""
        );

        if (validKanji.length < questionCount) {
          throw new Error(`Not enough kanji available. Found ${validKanji.length}, need ${questionCount}`);
        }

        // Select random kanji for questions
        const selectedKanji = shuffle(validKanji).slice(0, questionCount);

        // Create options pool from all meanings
        const allMeanings = validKanji.map((k) => k.meaning.split(",")[0].trim());

        // Build quiz questions
        const quizData = selectedKanji.map((kanji) => {
          const correctAnswer = kanji.meaning.split(",")[0].trim();
          const wrongAnswers = shuffle(
            allMeanings.filter((m) => m !== correctAnswer)
          ).slice(0, 3);

          return {
            kanji: kanji.character,
            correct: correctAnswer,
            fullMeaning: kanji.meaning,
            onyomi: kanji.onyomi?.romaji || "",
            kunyomi: kanji.kunyomi?.romaji || "",
            options: shuffle([correctAnswer, ...wrongAnswers]),
          };
        });

        setQuestions(quizData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    generateQuiz();
  }, [level, questionCount]);

  const handleAnswer = useCallback(
    (option) => {
      if (selected !== null) return;

      const q = questions[current];
      const correct = option === q.correct;
      
      setSelected(option);
      setIsCorrect(correct);
      
      if (correct) {
        setScore((prev) => prev + 1);
      }

      // Record answer
      setAnswers((prev) => [
        ...prev,
        {
          kanji: q.kanji,
          selected: option,
          correct: q.correct,
          isCorrect: correct,
        },
      ]);

      // Auto advance after delay
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);

        if (current + 1 < questions.length) {
          setCurrent((prev) => prev + 1);
        } else {
          onFinish({
            level: level.id,
            score: correct ? score + 1 : score,
            totalQuestions: questions.length,
            answers: [
              ...answers,
              {
                kanji: q.kanji,
                selected: option,
                correct: q.correct,
                isCorrect: correct,
              },
            ],
          });
        }
      }, 1000);
    },
    [selected, questions, current, score, onFinish, level.id, answers]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="text-center py-20">No questions available</p>;
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className={`px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${level.color}`}>
          {level.label}
        </span>
        <span className="text-gray-600">
          Question {current + 1} / {questions.length}
        </span>
        <span className="text-green-600 font-bold">Score: {score}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
        <div className="text-8xl font-bold mb-4">{q.kanji}</div>
        <p className="text-gray-500 text-sm">What does this kanji mean?</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {q.options.map((option, idx) => {
          let buttonClass = "bg-white hover:bg-blue-50 border-2 border-gray-200";
          
          if (selected !== null) {
            if (option === q.correct) {
              buttonClass = "bg-green-100 border-2 border-green-500 text-green-800";
            } else if (option === selected) {
              buttonClass = "bg-red-100 border-2 border-red-500 text-red-800";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`${buttonClass} rounded-xl p-4 font-medium transition-all ${
                selected === null ? "hover:scale-105" : ""
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected !== null && (
        <div
          className={`mt-6 p-4 rounded-xl text-center ${
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect ? (
            <span className="text-lg">✅ Correct!</span>
          ) : (
            <span className="text-lg">
              ❌ Wrong! The answer is: <strong>{q.correct}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Results Component
function QuizResults({ result, onRetry, onHome }) {
  const { addQuizResult } = useProgress();
  const [saved, setSaved] = useState(false);

  // Save result on mount
  useEffect(() => {
    if (!saved) {
      addQuizResult(result);
      setSaved(true);
    }
  }, [result, addQuizResult, saved]);

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  
  let grade, gradeColor, message;
  if (percentage >= 90) {
    grade = "A+";
    gradeColor = "text-green-600";
    message = "Excellent! You're a kanji master! 🏆";
  } else if (percentage >= 80) {
    grade = "A";
    gradeColor = "text-green-500";
    message = "Great job! Keep it up! 🌟";
  } else if (percentage >= 70) {
    grade = "B";
    gradeColor = "text-blue-600";
    message = "Good work! You're improving! 👍";
  } else if (percentage >= 60) {
    grade = "C";
    gradeColor = "text-yellow-600";
    message = "Not bad! Keep practicing! 📚";
  } else {
    grade = "D";
    gradeColor = "text-red-600";
    message = "Need more practice. Don't give up! 💪";
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Result Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete! 🎉</h1>
        <p className="text-gray-600 mb-6">{result.level} Quiz</p>

        <div className={`text-8xl font-bold ${gradeColor} mb-4`}>{grade}</div>
        
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {result.score} / {result.totalQuestions}
        </div>
        <div className="text-xl text-gray-600 mb-4">{percentage}%</div>
        
        <p className="text-lg text-gray-700">{message}</p>
      </div>

      {/* Answer Review */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="font-bold text-gray-800 mb-4">📝 Answer Review</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {result.answers.map((answer, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg ${
                answer.isCorrect ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{answer.kanji}</span>
                <span className="text-gray-600">→</span>
                <span className={answer.isCorrect ? "text-green-700" : "text-red-700"}>
                  {answer.selected}
                </span>
              </div>
              {!answer.isCorrect && (
                <span className="text-sm text-gray-500">
                  Correct: {answer.correct}
                </span>
              )}
              <span>{answer.isCorrect ? "✅" : "❌"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          🔄 Try Again
        </button>
        <button
          onClick={onHome}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
        >
          ← Back to Menu
        </button>
        <Link
          href="/kanji"
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          📚 Study Kanji
        </Link>
      </div>
    </div>
  );
}

// Main Quiz Page
export default function QuizPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [result, setResult] = useState(null);
  const { getQuizStats, isLoaded } = useProgress();

  const handleLevelSelect = (level, count) => {
    setSelectedLevel(level);
    setQuestionCount(count);
    setResult(null);
  };

  const handleFinish = (quizResult) => {
    setResult(quizResult);
  };

  const handleRetry = () => {
    setResult(null);
  };

  const handleHome = () => {
    setSelectedLevel(null);
    setResult(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show results
  if (result) {
    return (
      <QuizResults
        result={result}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    );
  }

  // Show quiz
  if (selectedLevel) {
    return (
      <div>
        <button
          onClick={handleHome}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-1"
        >
          ← Back to Menu
        </button>
        <Quiz
          level={selectedLevel}
          questionCount={questionCount}
          onFinish={handleFinish}
        />
      </div>
    );
  }

  // Show level selection
  return <LevelSelector onSelect={handleLevelSelect} quizStats={getQuizStats} />;
}
