"use client";

import { useProgress } from "@/lib/progress-context";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";

export default function Home() {
  const {
    learnedKanji,
    learnedHiragana,
    learnedKatakana,
    getKanaProgress,
    getQuizStats,
    getRecentActivity,
    getStudyStreak,
    getTodayStats,
    quizHistory,
    isLoaded,
  } = useProgress();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const todayStats = getTodayStats();
  const streak = getStudyStreak();
  const quizStats = getQuizStats();
  const recentActivity = getRecentActivity(5);
  const hiraganaProgress = getKanaProgress("hiragana");
  const katakanaProgress = getKanaProgress("katakana");

  // Feature cards for navigation
  const features = [
    {
      title: "Learn",
      description: "Study Hiragana, Katakana & Kanji",
      icon: "📖",
      href: "/learn",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Kanji",
      description: "Browse JLPT N5-N3 Kanji",
      icon: "漢",
      href: "/kanji",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Quiz",
      description: "Test your knowledge",
      icon: "🎯",
      href: "/quiz",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <main className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Japanese Learning App 🇯🇵
        </h1>
        <p className="text-gray-600">
          Master Hiragana, Katakana, and Kanji step by step
        </p>
      </div>

      {/* Streak & Today Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-4 text-white text-center">
          <div className="text-4xl mb-1">🔥</div>
          <div className="text-3xl font-bold">{streak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-white text-center">
          <div className="text-4xl mb-1">📚</div>
          <div className="text-3xl font-bold">{todayStats.total}</div>
          <div className="text-sm opacity-90">Learned Today</div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 text-white text-center">
          <div className="text-4xl mb-1">漢</div>
          <div className="text-3xl font-bold">{learnedKanji.length}</div>
          <div className="text-sm opacity-90">Kanji Mastered</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 text-white text-center">
          <div className="text-4xl mb-1">✅</div>
          <div className="text-3xl font-bold">{quizStats.totalQuizzes}</div>
          <div className="text-sm opacity-90">Quizzes Taken</div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg`}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
            <p className="opacity-90">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Your Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Hiragana</span>
              <span>{hiraganaProgress.learned}/46</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${hiraganaProgress.percentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Katakana</span>
              <span>{katakanaProgress.learned}/46</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${katakanaProgress.percentage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Kanji Learned</span>
              <span>{learnedKanji.length} characters</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((learnedKanji.length / 300) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🕐 Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No activity yet. Start learning!
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-2xl">
                    {activity.type === "kanji" ? "漢" : activity.type === "hiragana" ? "あ" : "ア"}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{activity.item}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.type === "kanji"
                        ? "bg-green-100 text-green-700"
                        : activity.type === "hiragana"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Quiz History</h2>
          {quizHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No quizzes taken yet</p>
              <Link
                href="/quiz"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Take a Quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.slice(0, 5).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{quiz.level} Quiz</div>
                    <div className="text-xs text-gray-500">
                      {new Date(quiz.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        quiz.score / quiz.totalQuestions >= 0.8
                          ? "text-green-600"
                          : quiz.score / quiz.totalQuestions >= 0.5
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {quiz.score}/{quiz.totalQuestions}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
              {quizHistory.length > 5 && (
                <Link
                  href="/quiz"
                  className="block text-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  View all quizzes →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Quick Start Guide</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <div className="font-semibold">Learn Hiragana</div>
              <p className="text-gray-600">Master the basic alphabet first</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <div className="font-semibold">Study Katakana</div>
              <p className="text-gray-600">Used for foreign words</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">3️⃣</span>
            <div>
              <div className="font-semibold">Practice Kanji</div>
              <p className="text-gray-600">Start with JLPT N5 level</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
