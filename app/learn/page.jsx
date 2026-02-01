"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RotateCw,
  Volume2,
  LayoutGrid,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Lightbulb,
} from "lucide-react";
import Background from "@/components/ui/Background";
import Card from "@/components/ui/Card";

// Hiragana data
const HIRAGANA = [
  { char: "あ", romaji: "a" },
  { char: "い", romaji: "i" },
  { char: "う", romaji: "u" },
  { char: "え", romaji: "e" },
  { char: "お", romaji: "o" },
  { char: "か", romaji: "ka" },
  { char: "き", romaji: "ki" },
  { char: "く", romaji: "ku" },
  { char: "け", romaji: "ke" },
  { char: "こ", romaji: "ko" },
  { char: "さ", romaji: "sa" },
  { char: "し", romaji: "shi" },
  { char: "す", romaji: "su" },
  { char: "せ", romaji: "se" },
  { char: "そ", romaji: "so" },
  { char: "た", romaji: "ta" },
  { char: "ち", romaji: "chi" },
  { char: "つ", romaji: "tsu" },
  { char: "て", romaji: "te" },
  { char: "と", romaji: "to" },
  { char: "な", romaji: "na" },
  { char: "に", romaji: "ni" },
  { char: "ぬ", romaji: "nu" },
  { char: "ね", romaji: "ne" },
  { char: "の", romaji: "no" },
  { char: "は", romaji: "ha" },
  { char: "ひ", romaji: "hi" },
  { char: "ふ", romaji: "fu" },
  { char: "へ", romaji: "he" },
  { char: "ほ", romaji: "ho" },
  { char: "ま", romaji: "ma" },
  { char: "み", romaji: "mi" },
  { char: "む", romaji: "mu" },
  { char: "め", romaji: "me" },
  { char: "も", romaji: "mo" },
  { char: "や", romaji: "ya" },
  { char: "ゆ", romaji: "yu" },
  { char: "よ", romaji: "yo" },
  { char: "ら", romaji: "ra" },
  { char: "り", romaji: "ri" },
  { char: "る", romaji: "ru" },
  { char: "れ", romaji: "re" },
  { char: "ろ", romaji: "ro" },
  { char: "わ", romaji: "wa" },
  { char: "を", romaji: "wo" },
  { char: "ん", romaji: "n" },
];

// Katakana data
const KATAKANA = [
  { char: "ア", romaji: "a" },
  { char: "イ", romaji: "i" },
  { char: "ウ", romaji: "u" },
  { char: "エ", romaji: "e" },
  { char: "オ", romaji: "o" },
  { char: "カ", romaji: "ka" },
  { char: "キ", romaji: "ki" },
  { char: "ク", romaji: "ku" },
  { char: "ケ", romaji: "ke" },
  { char: "コ", romaji: "ko" },
  { char: "サ", romaji: "sa" },
  { char: "シ", romaji: "shi" },
  { char: "ス", romaji: "su" },
  { char: "セ", romaji: "se" },
  { char: "ソ", romaji: "so" },
  { char: "タ", romaji: "ta" },
  { char: "チ", romaji: "chi" },
  { char: "ツ", romaji: "tsu" },
  { char: "テ", romaji: "te" },
  { char: "ト", romaji: "to" },
  { char: "ナ", romaji: "na" },
  { char: "ニ", romaji: "ni" },
  { char: "ヌ", romaji: "nu" },
  { char: "ネ", romaji: "ne" },
  { char: "ノ", romaji: "no" },
  { char: "ハ", romaji: "ha" },
  { char: "ヒ", romaji: "hi" },
  { char: "フ", romaji: "fu" },
  { char: "ヘ", romaji: "he" },
  { char: "ホ", romaji: "ho" },
  { char: "マ", romaji: "ma" },
  { char: "ミ", romaji: "mi" },
  { char: "ム", romaji: "mu" },
  { char: "メ", romaji: "me" },
  { char: "モ", romaji: "mo" },
  { char: "ヤ", romaji: "ya" },
  { char: "ユ", romaji: "yu" },
  { char: "ヨ", romaji: "yo" },
  { char: "ラ", romaji: "ra" },
  { char: "リ", romaji: "ri" },
  { char: "ル", romaji: "ru" },
  { char: "レ", romaji: "re" },
  { char: "ロ", romaji: "ro" },
  { char: "ワ", romaji: "wa" },
  { char: "ヲ", romaji: "wo" },
  { char: "ン", romaji: "n" },
];

const CATEGORIES = [
  {
    id: "hiragana",
    label: "Hiragana",
    icon: "あ",
    description: "Huruf dasar Jepang",
    data: HIRAGANA,
    color: "text-blue-500",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "katakana",
    label: "Katakana",
    icon: "ア",
    description: "Untuk kata serapan asing",
    data: KATAKANA,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "kanji",
    label: "Kanji",
    icon: "字",
    description: "Karakter Tiongkok",
    data: null,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
  },
];

// Flashcard Component
function Flashcard({
  item,
  isFlipped,
  onFlip,
  onNext,
  onPrev,
  onSpeak,
  currentIndex,
  total,
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
        <span className="bg-slate-200 px-2 py-0.5 rounded text-xs">
          {currentIndex + 1}
        </span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="dark:text-slate-400">{total}</span>
      </div>

      {/* Card */}
      <div
        onClick={onFlip}
        className="relative w-full aspect-[4/5] max-w-xs cursor-pointer perspective-1000 group"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="relative w-full h-full transform-style-preserve-3d"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col items-center justify-center text-slate-800 dark:text-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-9xl font-bold mb-8 bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {item.char || item.character}
            </span>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium bg-slate-100 dark:bg-slate-700/50 px-4 py-1.5 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              <RotateCw className="w-4 h-4" /> Ketuk untuk balik
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white border border-white/20"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-7xl font-bold mb-4">
              {item.char || item.character}
            </span>
            <span className="text-4xl font-medium mb-6 opacity-90">
              {item.romaji}
            </span>
            {item.meaning && (
              <span className="text-lg opacity-90 text-center px-6 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                {item.meaning}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(item.char || item.character);
              }}
              className="mt-8 p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-10 w-full">
        <button
          onClick={onPrev}
          className="p-4 rounded-full bg-white text-slate-600 shadow-lg border border-slate-100 hover:bg-slate-50 hover:scale-110 transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => onSpeak(item.char || item.character)}
          className="p-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 transition-all active:scale-95"
        >
          <Volume2 className="w-8 h-8" />
        </button>

        <button
          onClick={onNext}
          className="p-4 rounded-full bg-white text-slate-600 shadow-lg border border-slate-100 hover:bg-slate-50 hover:scale-110 transition-all active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-8 font-medium bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 dark:border-white/5">
        Gunakan Arrow Keys untuk navigasi • Spasi untuk balik • 'S' untuk suara
      </p>
    </div>
  );
}

// Study Mode Selection
function StudyModeSelector({ onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
      {CATEGORIES.map((cat, idx) => (
        <Card
          key={cat.id}
          delay={idx * 0.1}
          onClick={() => onSelect(cat)}
          className="relative group cursor-pointer overflow-hidden border-0 !bg-transparent p-0 h-80"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 transition-opacity group-hover:opacity-100`}
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative h-full p-8 flex flex-col items-center text-center justify-center z-10 text-white"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl mb-6 backdrop-blur-md shadow-inner border border-white/30 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <h3 className="text-3xl font-bold mb-3">{cat.label}</h3>
            <p className="text-white/80 text-sm mb-6 max-w-[200px]">
              {cat.description}
            </p>

            {cat.data ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md group-hover:bg-white/30 transition-colors">
                <Layers className="w-4 h-4" /> {cat.data.length} Karakter
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md group-hover:bg-white/30 transition-colors">
                Ke Perpustakaan Kanji{" "}
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </span>
            )}
          </motion.div>
        </Card>
      ))}
    </div>
  );
}
// Chart View for Hiragana/Katakana
function CharacterChart({ data, title, onStartStudy, kanaType }) {
  const { markKanaLearned, isKanaLearned } = useProgress();

  const toggleLearned = (char) => {
    markKanaLearned(char, kanaType);
  };

  const speakChar = (char) => {
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // Group by rows (5 per row for vowel groups)
  const vowelGroups = [
    { label: "Vokal", chars: data.slice(0, 5) },
    { label: "Baris K", chars: data.slice(5, 10) },
    { label: "Baris S", chars: data.slice(10, 15) },
    { label: "Baris T", chars: data.slice(15, 20) },
    { label: "Baris N", chars: data.slice(20, 25) },
    { label: "Baris H", chars: data.slice(25, 30) },
    { label: "Baris M", chars: data.slice(30, 35) },
    { label: "Baris Y", chars: data.slice(35, 38) },
    { label: "Baris R", chars: data.slice(38, 43) },
    { label: "Baris W + N", chars: data.slice(43) },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Tabel {title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Klik untuk dengar • Klik 2x untuk tandai sudah dipelajari
          </p>
        </div>
        <button
          onClick={onStartStudy}
          className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-md shadow-indigo-200 flex items-center gap-2"
        >
          <Layers className="w-5 h-5" /> Mode Flashcard
        </button>
      </div>

      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold uppercase text-slate-400">
                  Grup
                </th>
                {["a", "i", "u", "e", "o"].map((v) => (
                  <th
                    key={v}
                    className="p-4 text-center text-xs font-semibold uppercase text-slate-400 min-w-[60px]"
                  >
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {vowelGroups.map((group, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap bg-slate-50/30 dark:bg-slate-800/30 sticky left-0 backdrop-blur-sm z-10">
                    {group.label}
                  </td>
                  {[0, 1, 2, 3, 4].map((i) => {
                    const item = group.chars[i];
                    if (!item) return <td key={i} className="p-2"></td>;
                    const isLearned = isKanaLearned(item.char, kanaType);
                    return (
                      <td key={i} className="p-2 text-center">
                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(255,255,255,1)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => speakChar(item.char)}
                          onDoubleClick={() => toggleLearned(item.char)}
                          className={`w-14 h-16 flex flex-col items-center justify-center rounded-xl transition-all shadow-sm ${
                            isLearned
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-2 ring-green-400/50"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:shadow-md border border-slate-100 dark:border-slate-700"
                          }`}
                        >
                          <span className="text-xl font-bold">{item.char}</span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                            {item.romaji}
                          </span>
                        </motion.button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [studyMode, setStudyMode] = useState("chart"); // "chart" or "flashcard"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledData, setShuffledData] = useState([]);
  const { isLoaded } = useProgress();

  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled data when category changes
  useEffect(() => {
    if (selectedCategory?.data) {
      setShuffledData(shuffleArray(selectedCategory.data));
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [selectedCategory]);

  // Speak function
  const speakJapanese = useCallback((text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Navigation functions
  const goNext = useCallback(() => {
    if (shuffledData.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledData.length);
    }, 150);
  }, [shuffledData.length]);

  const goPrev = useCallback(() => {
    if (shuffledData.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + shuffledData.length) % shuffledData.length,
      );
    }, 150);
  }, [shuffledData.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (studyMode !== "flashcard" || !selectedCategory?.data) return;

      switch (e.key) {
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case " ":
          e.preventDefault();
          setIsFlipped((prev) => !prev);
          break;
        case "s":
        case "S":
          if (shuffledData[currentIndex]) {
            speakJapanese(shuffledData[currentIndex].char);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    studyMode,
    selectedCategory,
    goNext,
    goPrev,
    currentIndex,
    shuffledData,
    speakJapanese,
  ]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (category.id === "kanji") {
      // Redirect to kanji page
      window.location.href = "/kanji";
      return;
    }
    setSelectedCategory(category);
    setStudyMode("chart");
  };

  // Start flashcard mode
  const startFlashcardMode = () => {
    setShuffledData(shuffleArray(selectedCategory.data));
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyMode("flashcard");
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 min-h-screen">
      <Background />

      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Belajar Bahasa Jepang <span className="text-indigo-500">日本語</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Kuasai Hiragana, Katakana, dan Kanji langkah demi langkah
        </p>
      </div>

      {/* Breadcrumb / Back button */}
      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 max-w-5xl mx-auto px-4"
          >
            <button
              onClick={() => {
                if (studyMode === "flashcard") {
                  setStudyMode("chart");
                } else {
                  setSelectedCategory(null);
                }
              }}
              className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 dark:border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <span className="text-slate-300">/</span>
            <span className={`font-bold ${selectedCategory.color}`}>
              {selectedCategory.label}
            </span>
            {studyMode === "flashcard" && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600 font-medium">Flashcards</span>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          // Category Selection
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StudyModeSelector onSelect={handleCategorySelect} />

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600 mt-1">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-800 mb-2">
                      Tips Belajar
                    </h3>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        Mulai dengan <strong>Hiragana</strong> - fondasi tulisan
                        Jepang
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        Lanjut ke <strong>Katakana</strong> - untuk kata serapan
                        asing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Pelajari <strong>Kanji</strong> setelah menguasai kana
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Gunakan <strong>mode flashcard</strong> untuk melatih
                        ingatan
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ) : studyMode === "chart" ? (
          // Chart View
          <motion.div
            key="chart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CharacterChart
              data={selectedCategory.data}
              title={selectedCategory.label}
              onStartStudy={startFlashcardMode}
              kanaType={selectedCategory.id}
            />
          </motion.div>
        ) : (
          // Flashcard View
          shuffledData.length > 0 && (
            <motion.div
              key="flashcard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center py-4"
            >
              <Flashcard
                item={shuffledData[currentIndex]}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                onNext={goNext}
                onPrev={goPrev}
                onSpeak={speakJapanese}
                currentIndex={currentIndex}
                total={shuffledData.length}
              />

              {/* Shuffle button */}
              <button
                onClick={() => {
                  setShuffledData(shuffleArray(selectedCategory.data));
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="mt-8 px-6 py-2.5 bg-white text-slate-600 rounded-full hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 shadow-sm border border-slate-200 transition-all text-sm font-medium hover:shadow-md"
              >
                <Shuffle className="w-4 h-4" /> Shuffle Cards
              </button>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
