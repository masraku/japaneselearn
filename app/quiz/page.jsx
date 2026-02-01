"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useProgress } from "@/lib/progress-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  HelpCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Home,
  BookOpen,
  Flame,
  Volume2,
  Sparkles,
  Layers,
} from "lucide-react";
import Background from "@/components/ui/Background";
import Card from "@/components/ui/Card";
import confetti from "canvas-confetti";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const LEVELS = [
  {
    id: "N5",
    label: "JLPT N5",
    grades: ["1", "2"],
    description: "Beginner",
    color: "from-green-500 to-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600",
  },
  {
    id: "N4",
    label: "JLPT N4",
    grades: ["3", "4"],
    description: "Elementary",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600",
  },
  {
    id: "N3",
    label: "JLPT N3",
    grades: ["5", "6"],
    description: "Intermediate",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600",
  },
  {
    id: "mixed",
    label: "Campuran",
    grades: ["1", "2", "3", "4", "5", "6"],
    description: "Semua Level",
    color: "from-orange-500 to-red-600",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600",
  },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

// Level Selection Component
function LevelSelector({ onSelect, quizStats }) {
  const [questionCount, setQuestionCount] = useState(10);

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 z-10 relative">
      <div className="text-center py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight"
        >
          Kuis Kanji{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            挑戦
          </span>
        </motion.h1>
        <p className="text-slate-600 dark:text-slate-400 text-xl font-light">
          Uji kemampuanmu dan bangun streak belajar
        </p>
      </div>

      {/* Question Count */}
      <Card className="max-w-md mx-auto p-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/50 dark:border-white/10 shadow-xl">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" /> Soal
          </span>
          <div className="flex gap-1">
            {QUESTION_COUNTS.map((count) => (
              <motion.button
                key={count}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuestionCount(count)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                  questionCount === count
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {count}
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      {/* Level Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {LEVELS.map((level, idx) => {
          const stats = quizStats(level.id);
          return (
            <Card
              key={level.id}
              onClick={() => onSelect(level, questionCount)}
              delay={idx * 0.1}
              className={`group cursor-pointer relative overflow-hidden border-0 !bg-transparent p-0 min-h-[200px] shadow-xl hover:shadow-2xl transition-all duration-500`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-90 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100`}
              />

              {/* Decorative circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

              <div className="relative p-8 text-white h-full flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-4xl font-bold mb-1 tracking-tight">
                      {level.label}
                    </h3>
                    <p className="text-white/80 font-medium text-lg">
                      {level.description}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/20 group-hover:rotate-12 transition-transform duration-300">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>

                {stats.totalQuizzes > 0 ? (
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                      <div className="text-xs text-white/60 uppercase font-bold">
                        Skor Terbaik
                      </div>
                      <div className="text-xl font-bold">
                        {stats.bestScore}%
                      </div>
                    </div>
                    <div className="bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                      <div className="text-xs text-white/60 uppercase font-bold">
                        Kuis
                      </div>
                      <div className="text-xl font-bold">
                        {stats.totalQuizzes}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-sm font-medium opacity-80">
                      Siap mulai?
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                      Mulai Kuis <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </div>
            </Card>
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
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Play pronunciation
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // Fetch kanji and generate quiz
  useEffect(() => {
    async function generateQuiz() {
      setLoading(true);
      setError(null);

      try {
        const promises = level.grades.map((grade) =>
          fetch(`/api/kanji/grade?grade=${grade}`).then((res) => res.json()),
        );
        const results = await Promise.all(promises);
        const allKanji = results.flatMap((r) => r.kanji || []);

        const validKanji = allKanji.filter(
          (k) => k.character && k.meaning && k.meaning.trim() !== "",
        );

        if (validKanji.length < questionCount) {
          throw new Error(
            `Not enough kanji available. Found ${validKanji.length}, need ${questionCount}`,
          );
        }

        const selectedKanji = shuffle(validKanji).slice(0, questionCount);
        const allMeanings = validKanji.map((k) =>
          k.meaning.split(",")[0].trim(),
        );

        const quizData = selectedKanji.map((kanji) => {
          const correctAnswer = kanji.meaning.split(",")[0].trim();
          const wrongAnswers = shuffle(
            allMeanings.filter((m) => m !== correctAnswer),
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

      // Visual feedback & Audio
      if (correct) {
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        speak(q.kanji);
        if ((streak + 1) % 3 === 0) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#6366f1", "#a855f7", "#ec4899"],
          });
        }
      } else {
        setStreak(0);
        // Maybe play error sound? (Simple web audio oscillator could work but leaving out for now)
      }

      setAnswers((prev) => [
        ...prev,
        {
          kanji: q.kanji,
          selected: option,
          correct: q.correct,
          isCorrect: correct,
        },
      ]);

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
      }, 1500); // Slightly longer delay to see the feedback
    },
    [selected, questions, current, score, streak, onFinish, level.id, answers],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 z-10 relative">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-indigo-600 text-xl">
            ?
          </div>
        </div>
        <p className="mt-8 text-xl font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          Menyiapkan tantanganmu...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4 z-10 relative">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl max-w-md mx-auto border border-red-100 shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 text-lg mb-2 font-bold">
            Ada kesalahan
          </p>
          <p className="text-red-600 mb-8 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold shadow-lg hover:shadow-red-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 z-10 relative">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-r ${level.color} shadow-md flex items-center gap-2`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {level.label}
          </span>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full font-bold text-sm border border-orange-200 shadow-sm"
            >
              <Flame className="w-4 h-4 fill-orange-500" /> {streak} Streak
            </motion.div>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
            Soal
          </span>
          <span className="text-slate-800 dark:text-slate-100 font-black text-2xl leading-none">
            {current + 1}
            <span className="text-slate-400 dark:text-slate-600 text-base font-medium">
              /{questions.length}
            </span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-full h-3 mb-10 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="p-12 text-center mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />

            <motion.div
              className="text-[120px] leading-tight font-black mb-6 text-slate-800 dark:text-white"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              {q.kanji}
            </motion.div>

            <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400 font-medium bg-slate-100/50 dark:bg-slate-700/50 py-2 px-6 rounded-full w-fit mx-auto border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <span>Pilih arti yang benar</span>
            </div>

            <button
              onClick={() => speak(q.kanji)}
              className="absolute top-4 right-4 p-3 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </Card>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((option, idx) => {
              let buttonState = "default";

              if (selected !== null) {
                if (option === q.correct) {
                  buttonState = "correct";
                } else if (option === selected) {
                  buttonState = "wrong";
                } else {
                  buttonState = "disabled";
                }
              }

              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  whileHover={
                    selected === null ? { scale: 1.02, translateY: -2 } : {}
                  }
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={selected !== null}
                  className={`relative rounded-2xl p-6 font-bold text-lg transition-all border-2 shadow-sm ${
                    buttonState === "default"
                      ? "bg-white dark:bg-slate-800/50 border-white dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                      : buttonState === "correct"
                        ? "bg-green-100 dark:bg-green-900/40 border-green-500 dark:border-green-600 text-green-800 dark:text-green-300 shadow-green-100 ring-4 ring-green-100/50 scale-105 z-10"
                        : buttonState === "wrong"
                          ? "bg-red-100 dark:bg-red-900/40 border-red-500 dark:border-red-600 text-red-800 dark:text-red-300 opacity-60 shake"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-50 grayscale"
                  }`}
                >
                  <span className="relative z-10">{option}</span>
                  {buttonState === "correct" && (
                    <motion.div
                      layoutId="correct-icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full p-1"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.div>
                  )}
                  {buttonState === "wrong" && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Results Component
function QuizResults({ result, onRetry, onHome }) {
  const { addQuizResult } = useProgress();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (!saved) {
      addQuizResult(result);
      setSaved(true);
    }
  }, [result, addQuizResult, saved]);

  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  let grade, gradeColor, message, icon;
  if (percentage >= 90) {
    grade = "S";
    gradeColor = "text-yellow-500";
    message = "Kanji Master!";
    icon = <Trophy className="w-16 h-16 text-yellow-500" />;
  } else if (percentage >= 80) {
    grade = "A";
    gradeColor = "text-green-500";
    message = "Luar Biasa!";
    icon = <CheckCircle className="w-16 h-16 text-green-500" />;
  } else if (percentage >= 60) {
    grade = "B";
    gradeColor = "text-blue-500";
    message = "Kerja Bagus!";
    icon = <Target className="w-16 h-16 text-blue-500" />;
  } else {
    grade = "C";
    gradeColor = "text-slate-400";
    message = "Terus Berlatih!";
    icon = <BookOpen className="w-16 h-16 text-slate-400" />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 z-10 relative py-12">
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="inline-flex items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl mb-6 ring-4 ring-white/50 dark:ring-white/10"
        >
          {icon}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-black text-slate-800 dark:text-white mb-2 tracking-tight"
        >
          {message}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 dark:text-slate-400 font-medium text-lg"
        >
          Kamu menyelesaikan Kuis {result.level}
        </motion.p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="text-center py-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl shadow-indigo-500/20">
          <div className="text-6xl font-black mb-2">{result.score}</div>
          <div className="text-xs opacity-80 font-bold uppercase tracking-widest">
            Jawaban Benar
          </div>
        </Card>
        <Card className="text-center py-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-white/60 dark:border-white/10">
          <div className={`text-6xl font-black mb-2 ${gradeColor}`}>
            {percentage}%
          </div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Akurasi
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden mb-8 border-0 shadow-lg">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
          <span>Tinjau Kesalahan</span>
          <span className="text-xs font-normal text-slate-400 italic">
            Lihat yang benar untuk belajar
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto p-4 space-y-3 bg-white/80 dark:bg-slate-900/50">
          {result.answers.filter((a) => !a.isCorrect).length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-400" />
              </div>
              <p className="font-medium">Sempurna! Tidak ada kesalahan.</p>
            </div>
          ) : (
            result.answers.map((answer, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  answer.isCorrect
                    ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-60 hover:opacity-100"
                    : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className="text-4xl font-black text-slate-800 dark:text-slate-200 w-16 text-center">
                    {answer.kanji}
                  </span>
                  <div>
                    {!answer.isCorrect && (
                      <div className="mb-1">
                        <div className="text-[10px] text-red-400 uppercase font-bold tracking-wide">
                          Jawabanmu
                        </div>
                        <div className="text-red-700 dark:text-red-400 font-bold line-through decoration-red-300 decoration-2">
                          {answer.selected}
                        </div>
                      </div>
                    )}

                    <div>
                      {answer.isCorrect ? (
                        <div className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Benar
                        </div>
                      ) : (
                        <>
                          <div className="text-[10px] text-green-500 uppercase font-bold tracking-wide">
                            Jawaban Benar
                          </div>
                          <div className="text-green-700 dark:text-green-400 font-bold">
                            {answer.correct}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        <button
          onClick={onHome}
          className="flex-1 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" /> Ke Beranda
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-300 dark:shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Main Lagi
        </button>
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-12 min-h-screen">
      <Background />

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
          >
            <QuizResults
              result={result}
              onRetry={handleRetry}
              onHome={handleHome}
            />
          </motion.div>
        ) : selectedLevel ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            <div className="max-w-3xl mx-auto mb-2 px-4 pt-6 z-10 relative">
              <button
                onClick={handleHome}
                className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 dark:border-white/10 w-fit hover:bg-white dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" /> Keluar Kuis
              </button>
            </div>
            <Quiz
              level={selectedLevel}
              questionCount={questionCount}
              onFinish={handleFinish}
            />
          </motion.div>
        ) : (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LevelSelector
              onSelect={handleLevelSelect}
              quizStats={getQuizStats}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
