"use client";

import { useProgress } from "@/lib/progress-context";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Languages,
  BrainCircuit,
  Flame,
  Library,
  CheckCircle2,
  History,
  ArrowRight,
  Trophy,
  Sparkles,
} from "lucide-react";
import Background from "@/components/ui/Background";
import Card from "@/components/ui/Card";

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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const todayStats = getTodayStats();
  const streak = getStudyStreak();
  const quizStats = getQuizStats();
  const recentActivity = getRecentActivity(5);
  const hiraganaProgress = getKanaProgress("hiragana");
  const katakanaProgress = getKanaProgress("katakana");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      title: "Belajar",
      description: "Kuasai Hiragana, Katakana & dasar Kanji",
      icon: <BookOpen className="w-8 h-8" />,
      href: "/learn",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Kanji",
      description: "Jelajahi perpustakaan Kanji JLPT N5-N3",
      icon: <Languages className="w-8 h-8" />,
      href: "/kanji",
      color: "bg-purple-500",
      gradient: "from-purple-500 to-fuchsia-600",
    },
    {
      title: "Kuis",
      description: "Uji kemampuanmu dan pantau progresmu",
      icon: <BrainCircuit className="w-8 h-8" />,
      href: "/quiz",
      color: "bg-emerald-500",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      <Background />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12 md:py-20 relative"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/20 text-sm font-medium text-indigo-900 shadow-sm"
        >
          Belajar bahasa Jepang dengan mudah & santai 🇯🇵
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-900">
          <span className="text-gradient">RakuGo</span>{" "}
          <span className="text-3xl md:text-5xl text-slate-500">らく語</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          楽語 — Belajar Hiragana, Katakana, dan Kanji secara interaktif. Pantau
          progresmu dan bangun kebiasaan belajar harian.
        </p>
      </motion.section>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="flex flex-col items-center justify-center text-center py-8 border-orange-100 bg-orange-50/50 dark:bg-orange-900/20">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
            <Flame className="w-6 h-6" />
          </div>
          <div className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {streak}
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Hari Streak
          </div>
        </Card>
        <Card
          delay={0.1}
          className="flex flex-col items-center justify-center text-center py-8 border-blue-100 bg-blue-50/50 dark:bg-blue-900/20"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Library className="w-6 h-6" />
          </div>
          <div className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {todayStats.total}
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Dipelajari Hari Ini
          </div>
        </Card>
        <Card
          delay={0.2}
          className="flex flex-col items-center justify-center text-center py-8 border-purple-100 bg-purple-50/50 dark:bg-purple-900/20"
        >
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <Languages className="w-6 h-6" />
          </div>
          <div className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {learnedKanji.length}
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Kanji Dikuasai
          </div>
        </Card>
        <Card
          delay={0.3}
          className="flex flex-col items-center justify-center text-center py-8 border-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/20"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {quizStats.totalQuizzes}
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Kuis Dikerjakan
          </div>
        </Card>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <Link key={feature.title} href={feature.href} className="group">
            <Card
              delay={0.4 + idx * 0.1}
              className="h-full relative overflow-hidden border-0 !bg-transparent !shadow-none p-0"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative p-8 text-white h-full flex flex-col items-start z-10">
                <div className="bg-white/20 p-3 rounded-2xl mb-6 backdrop-blur-sm">
                  {feature.icon}
                </div>
                <h2 className="text-3xl font-bold mb-2">{feature.title}</h2>
                <p className="text-blue-50/90 mb-8 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-auto flex items-center gap-2 font-semibold bg-white/20 pl-4 pr-3 py-2 rounded-full text-sm backdrop-blur-md transition-transform group-hover:translate-x-1">
                  Mulai Belajar <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Overview (2/3 width) */}
        <Card delay={0.6} className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Progresmu
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-2">🇯🇵 Hiragana</span>
                <span>{hiraganaProgress.learned} / 46</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${hiraganaProgress.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-blue-500 h-full rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-2">🎌 Katakana</span>
                <span>{katakanaProgress.learned} / 46</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${katakanaProgress.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                  className="bg-purple-500 h-full rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-2">💮 Kanji</span>
                <span>{learnedKanji.length} karakter</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.min((learnedKanji.length / 300) * 100, 100)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="bg-emerald-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Recent Activity (1/3 width) */}
        <Card delay={0.7} className="lg:col-span-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Aktivitas Terbaru
            </h2>
          </div>

          <div className="flex-1">
            {recentActivity.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm">
                  Belum ada aktivitas.
                  <br />
                  Mulai pelajaran pertamamu!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-slate-50/80 dark:bg-slate-700/50 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
                      ${
                        activity.type === "kanji"
                          ? "bg-emerald-100 text-emerald-700"
                          : activity.type === "hiragana"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {activity.type === "kanji"
                        ? "漢"
                        : activity.type === "hiragana"
                          ? "あ"
                          : "ア"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {activity.item}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(activity.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quiz History Section */}
      <Card delay={0.8}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Kuis Terbaru
            </h2>
          </div>
          {quizHistory.length > 0 && (
            <Link
              href="/quiz"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {quizHistory.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 mb-4">
              Kamu belum mengerjakan kuis apapun.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              <BrainCircuit className="w-4 h-4" /> Mulai Kuis Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                  <th className="py-3 pl-2 font-semibold">Level</th>
                  <th className="py-3 font-semibold">Tanggal</th>
                  <th className="py-3 font-semibold">Skor</th>
                  <th className="py-3 pr-2 font-semibold text-right">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {quizHistory.slice(0, 5).map((quiz) => (
                  <tr
                    key={quiz.id}
                    className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-3 pl-2 font-medium text-slate-700 dark:text-slate-200">
                      Kuis {quiz.level}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {new Date(quiz.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-200">
                      {quiz.score}/{quiz.totalQuestions}
                    </td>
                    <td className="py-3 pr-2 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
