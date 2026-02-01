"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/lib/progress-context";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Play,
  BookOpen,
  Layers,
  Puzzle,
  ExternalLink,
  Sparkles,
  Trophy,
  Target,
  Rocket,
} from "lucide-react";
import Background from "@/components/ui/Background";
import Card from "@/components/ui/Card";

// Learning Path Data
const LEARNING_PATH = [
  {
    id: "hiragana",
    phase: 1,
    title: "Hiragana ひらがな",
    duration: "1-2 minggu",
    description:
      "Huruf dasar Jepang untuk kata-kata asli. Fondasi paling penting!",
    icon: "あ",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-800",
    lessons: [
      { title: "46 Karakter Dasar (あ-ん)", link: "/learn" },
      { title: "Suara Kombinasi (きゃ, しゅ, ちょ)", link: "/learn" },
      { title: "Latihan Menulis", link: null },
    ],
    video: {
      title: "NHK Easy Japanese - Hiragana",
      embedId: "6p9Il_j0zjc",
      channel: "JapanesePod101",
    },
    tips: [
      "Pelajari 5-10 karakter per hari",
      "Gunakan flashcard untuk menghafal",
      "Tulis berulang kali untuk mengingat bentuk",
    ],
  },
  {
    id: "katakana",
    phase: 2,
    title: "Katakana カタカナ",
    duration: "1-2 minggu",
    description:
      "Huruf untuk kata serapan asing. Mirip hiragana tapi lebih angular.",
    icon: "ア",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    lessons: [
      { title: "46 Karakter Dasar (ア-ン)", link: "/learn" },
      { title: "Suara Kombinasi", link: "/learn" },
      { title: "Kata Serapan Umum (コーヒー, パソコン)", link: null },
    ],
    video: {
      title: "Learn ALL Katakana in 1 Hour",
      embedId: "s6DKRp-24-Q",
      channel: "JapanesePod101",
    },
    tips: [
      "Katakana mirip hiragana, jadi akan lebih cepat",
      "Perhatikan kata-kata Inggris yang di-Jepang-kan",
      "Baca menu restoran Jepang untuk latihan",
    ],
  },
  {
    id: "basic-kanji",
    phase: 3,
    title: "Kanji Dasar 漢字",
    duration: "4-6 minggu",
    description:
      "Mulai dengan kanji paling umum: angka, hari, kata benda dasar.",
    icon: "日",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    lessons: [
      { title: "Angka (一, 二, 三... 十, 百, 千)", link: "/kanji" },
      { title: "Hari & Waktu (日, 月, 年)", link: "/kanji" },
      { title: "Orang & Alam (人, 山, 川, 木)", link: "/kanji" },
      { title: "~80 Kanji N5", link: "/kanji" },
    ],
    video: {
      title: "Learn Basic Kanji - Beginner Japanese",
      embedId: "vdPx4lM0Ew4",
      channel: "JapanesePod101",
    },
    tips: [
      "Pelajari radikal untuk mudah mengingat",
      "Fokus pada arti dan bacaan paling umum dulu",
      "Gunakan Spaced Repetition (SRS)",
    ],
  },
  {
    id: "grammar",
    phase: 4,
    title: "Grammar Dasar 文法",
    duration: "4-8 minggu",
    description: "Struktur kalimat, partikel, dan konjugasi kata kerja.",
    icon: "文",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    lessons: [
      { title: "Struktur SOV (Subjek-Objek-Verb)", link: null },
      { title: "Partikel (は, が, を, に, で)", link: null },
      { title: "Kata Kerja Bentuk-ます", link: null },
      { title: "Kata Sifat (い & な)", link: null },
    ],
    video: {
      title: "Japanese Grammar Made Easy",
      embedId: "wN1pFUYOlnk",
      channel: "Organic Japanese",
    },
    tips: [
      "Jangan terlalu fokus grammar di awal, pahami polanya dulu",
      "Buat kalimat sederhana setiap hari",
      "Dengarkan native speaker untuk pola natural",
    ],
  },
  {
    id: "jlpt-n5",
    phase: 5,
    title: "Persiapan JLPT N5",
    duration: "4-8 minggu",
    description: "Konsolidasi dan persiapan ujian JLPT level pertama.",
    icon: "🎯",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    lessons: [
      { title: "800 Kosakata N5", link: null },
      { title: "100 Kanji N5", link: "/kanji" },
      { title: "Latihan Soal", link: "/quiz" },
      { title: "Listening Practice", link: null },
    ],
    video: {
      title: "JLPT N5 - Complete Vocabulary List",
      embedId: "oRmfNGpOmKQ",
      channel: "Nihongo no Mori",
    },
    tips: [
      "Kerjakan soal latihan JLPT",
      "Atur target waktu ujian",
      "Review materi yang masih lemah",
    ],
  },
];

function PhaseCard({ phase, isExpanded, onToggle, isCompleted, isCurrent }) {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

      {/* Timeline Dot */}
      <div
        className={`absolute left-4 top-6 w-5 h-5 rounded-full border-4 z-10 transition-all ${
          isCompleted
            ? "bg-green-500 border-green-200"
            : isCurrent
              ? "bg-indigo-500 border-indigo-200 animate-pulse"
              : "bg-white border-slate-300"
        }`}
      />

      <Card
        className={`ml-12 cursor-pointer transition-all hover:shadow-lg ${
          isCurrent ? "ring-2 ring-indigo-500/30" : ""
        } ${phase.bgColor} ${phase.borderColor}`}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
            >
              {phase.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Phase {phase.phase}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">
                  {phase.duration}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {phase.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {phase.description}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-white/50 space-y-6">
                {/* Lessons */}
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Materi
                  </h4>
                  <ul className="space-y-2">
                    {phase.lessons.map((lesson, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Circle className="w-3 h-3 text-slate-400" />
                        {lesson.link ? (
                          <Link
                            href={lesson.link}
                            className="text-sm text-indigo-600 hover:underline font-medium"
                          >
                            {lesson.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {lesson.title}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video */}
                {phase.video && (
                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4" /> Video Pembelajaran
                    </h4>
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${phase.video.embedId}`}
                        title={phase.video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {phase.video.title} • {phase.video.channel}
                    </p>
                  </div>
                )}

                {/* Tips */}
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Tips
                  </h4>
                  <ul className="space-y-2">
                    {phase.tips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span className="text-indigo-500 mt-0.5">💡</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

export default function GuidePage() {
  const [expandedPhase, setExpandedPhase] = useState("hiragana");
  const { isLoaded } = useProgress();

  // Simulate current phase based on progress
  const currentPhaseIndex = 0; // Would be calculated from actual progress

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-12 min-h-screen">
      <Background />

      {/* Header */}
      <div className="text-center py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4"
        >
          <Rocket className="w-4 h-4" /> Learning Path
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4"
        >
          Panduan Belajar <span className="text-indigo-500">日本語</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg"
        >
          Ikuti jalur pembelajaran terstruktur dari nol hingga siap JLPT N5.
          Setiap fase dilengkapi materi, video, dan tips praktis.
        </motion.p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 relative z-10">
        <Card className="text-center py-4">
          <Target className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            5
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Phases
          </div>
        </Card>
        <Card className="text-center py-4">
          <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            ~6
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Bulan
          </div>
        </Card>
        <Card className="text-center py-4">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            N5
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Target
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto space-y-6 relative z-10 px-4">
        {LEARNING_PATH.map((phase, idx) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <PhaseCard
              phase={phase}
              isExpanded={expandedPhase === phase.id}
              onToggle={() =>
                setExpandedPhase(expandedPhase === phase.id ? null : phase.id)
              }
              isCompleted={idx < currentPhaseIndex}
              isCurrent={idx === currentPhaseIndex}
            />
          </motion.div>
        ))}
      </div>

      {/* External Resources */}
      <div className="max-w-3xl mx-auto mt-12 px-4 relative z-10">
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-indigo-500" /> Sumber Belajar
            Tambahan
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://minato-jf.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
                JF
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Minato
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Japan Foundation e-learning
                </div>
              </div>
            </a>
            <a
              href="https://www.nhk.or.jp/lesson/english/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                NHK
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  NHK World
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Easy Japanese lessons
                </div>
              </div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
