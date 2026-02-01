"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  TreeDeciduous,
  User,
  Cat,
  Calendar,
  Hash,
  Palette,
  Sparkles,
  X,
} from "lucide-react";
import Background from "@/components/ui/Background";
import Card from "@/components/ui/Card";

// Grade mapping to JLPT levels (approximate)
const LEVELS = [
  {
    id: "N5",
    label: "N5",
    grades: ["1", "2"],
    description: "Beginner",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-200",
  },
  {
    id: "N4",
    label: "N4",
    grades: ["3", "4"],
    description: "Elementary",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-200",
  },
  {
    id: "N3",
    label: "N3",
    grades: ["5", "6"],
    description: "Intermediate",
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-200",
  },
];

// Semantic Categories with keywords
const CATEGORIES = [
  {
    id: "all",
    label: "All",
    icon: Sparkles,
    keywords: [], // Empty means no filter
    color: "bg-slate-100 text-slate-600",
    activeColor: "bg-slate-800 text-white",
  },
  {
    id: "nature",
    label: "Nature",
    icon: TreeDeciduous,
    keywords: [
      "sun",
      "moon",
      "tree",
      "water",
      "mountain",
      "river",
      "rain",
      "snow",
      "sky",
      "wind",
      "fire",
      "earth",
      "flower",
      "forest",
      "sea",
      "ocean",
      "gold",
      "stone",
      "field",
      "rice",
      "grass",
      "cloud",
      "star",
      "light",
    ],
    color: "bg-green-100 text-green-700",
    activeColor: "bg-green-600 text-white",
  },
  {
    id: "people",
    label: "People",
    icon: User,
    keywords: [
      "person",
      "man",
      "woman",
      "child",
      "father",
      "mother",
      "self",
      "friend",
      "king",
      "master",
      "teacher",
      "student",
      "body",
      "hand",
      "foot",
      "eye",
      "ear",
      "mouth",
      "heart",
      "head",
      "life",
      "die",
      "live",
    ],
    color: "bg-blue-100 text-blue-700",
    activeColor: "bg-blue-600 text-white",
  },
  {
    id: "animals",
    label: "Animals",
    icon: Cat,
    keywords: [
      "dog",
      "cat",
      "bird",
      "fish",
      "cow",
      "horse",
      "animal",
      "insect",
      "deer",
      "pig",
      "sheep",
      "chicken",
      "dragon",
      "tiger",
    ],
    color: "bg-orange-100 text-orange-700",
    activeColor: "bg-orange-600 text-white",
  },
  {
    id: "time",
    label: "Time",
    icon: Calendar,
    keywords: [
      "day",
      "month",
      "year",
      "time",
      "week",
      "spring",
      "summer",
      "autumn",
      "winter",
      "morning",
      "evening",
      "night",
      "now",
      "before",
      "after",
      "early",
      "late",
      "old",
      "new",
      "begin",
      "end",
    ],
    color: "bg-purple-100 text-purple-700",
    activeColor: "bg-purple-600 text-white",
  },
  {
    id: "numbers",
    label: "Numbers",
    icon: Hash,
    keywords: [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "hundred",
      "thousand",
      "ten thousand",
      "half",
      "many",
      "few",
      "all",
      "every",
    ],
    color: "bg-indigo-100 text-indigo-700",
    activeColor: "bg-indigo-600 text-white",
  },
  {
    id: "adjectives",
    label: "Adjectives",
    icon: Palette,
    keywords: [
      "big",
      "small",
      "new",
      "old",
      "long",
      "short",
      "high",
      "low",
      "white",
      "black",
      "red",
      "blue",
      "green",
      "yellow",
      "bright",
      "dark",
      "strong",
      "weak",
      "good",
      "bad",
      "beautiful",
      "ugly",
      "fast",
      "slow",
      "hot",
      "cold",
      "heavy",
      "light",
      "easy",
      "difficult",
      "rich",
      "poor",
    ],
    color: "bg-pink-100 text-pink-700",
    activeColor: "bg-pink-600 text-white",
  },
];

export default function KanjiPage() {
  const [activeLevel, setActiveLevel] = useState("N5");
  const [activeCategory, setActiveCategory] = useState("all");
  const [kanjiData, setKanjiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLearned, getProgress, isLoaded } = useProgress();

  // Fetch kanji from API based on selected level
  useEffect(() => {
    async function fetchKanjiByLevel() {
      const level = LEVELS.find((l) => l.id === activeLevel);
      if (!level) return;

      // Check if already cached
      if (kanjiData[activeLevel]) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const promises = level.grades.map((grade) =>
          fetch(`/api/kanji/grade?grade=${grade}`).then((res) => res.json()),
        );

        const results = await Promise.all(promises);
        const allKanji = results.flatMap((r) => r.kanji || []);

        const uniqueKanji = allKanji.filter(
          (kanji, index, self) =>
            index === self.findIndex((k) => k.character === kanji.character),
        );

        setKanjiData((prev) => ({
          ...prev,
          [activeLevel]: uniqueKanji,
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchKanjiByLevel();
  }, [activeLevel, kanjiData]);

  // Filter kanji by category
  const currentKanji = useMemo(() => {
    const levelKanji = kanjiData[activeLevel] || [];

    if (activeCategory === "all") {
      return levelKanji;
    }

    const category = CATEGORIES.find((c) => c.id === activeCategory);
    if (!category || category.keywords.length === 0) {
      return levelKanji;
    }

    return levelKanji.filter((kanji) => {
      const meaning = (kanji.meaning || "").toLowerCase();
      return category.keywords.some((keyword) =>
        meaning.includes(keyword.toLowerCase()),
      );
    });
  }, [kanjiData, activeLevel, activeCategory]);

  const kanjiCharacters = currentKanji.map((k) => k.character);
  const progress = getProgress(kanjiCharacters);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="space-y-6 pb-12">
      <Background />

      {/* Header */}
      <div className="text-center py-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3"
        >
          Pustaka Kanji <span className="text-indigo-500">漢字</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg"
        >
          Kuasai kanji dari JLPT N5 hingga N3. Filter berdasarkan kategori.
        </motion.p>
      </div>

      {/* Level Tabs */}
      <Card className="p-2 flex flex-wrap justify-center gap-2 md:gap-4 bg-white/40 backdrop-blur-md sticky top-4 z-20 shadow-md border-white/40">
        {LEVELS.map((level) => {
          const levelKanji = kanjiData[level.id] || [];
          const levelProgress = getProgress(levelKanji.map((k) => k.character));
          const isActive = activeLevel === level.id;

          return (
            <button
              key={level.id}
              onClick={() => setActiveLevel(level.id)}
              className={`relative px-6 py-3 rounded-xl transition-all duration-300 flex flex-col items-center min-w-[100px] ${
                isActive
                  ? "bg-white dark:bg-slate-800 shadow-md scale-105 ring-1 ring-black/5 dark:ring-white/10"
                  : "hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <div
                className={`font-bold text-lg ${isActive ? level.color : ""}`}
              >
                {level.label}
              </div>
              <div className="text-xs font-medium opacity-70">
                {level.description}
              </div>
              {levelKanji.length > 0 && (
                <div className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {levelProgress.learned}/{levelKanji.length}
                </div>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-xl ring-2 ring-indigo-500/20`}
                />
              )}
            </button>
          );
        })}
      </Card>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 border ${
                isActive
                  ? `${category.activeColor} border-transparent shadow-md`
                  : `${category.color} border-transparent hover:shadow-sm`
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </motion.button>
          );
        })}
      </div>

      {/* Active Filter Indicator */}
      <AnimatePresence>
        {activeCategory !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Menampilkan{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {currentKanji.length}
              </span>{" "}
              hasil untuk "
              {CATEGORIES.find((c) => c.id === activeCategory)?.label}"
            </span>
            <button
              onClick={() => setActiveCategory("all")}
              className="p-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Progress for Current Level */}
      <AnimatePresence mode="wait">
        {currentKanji.length > 0 && (
          <motion.div
            key={`${activeLevel}-${activeCategory}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-blue-100 dark:border-blue-900/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-full ${LEVELS.find((l) => l.id === activeLevel)?.bg}`}
                  >
                    <BookOpen
                      className={`w-6 h-6 ${LEVELS.find((l) => l.id === activeLevel)?.color}`}
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      {activeLevel} Progress
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {progress.learned} dari {currentKanji.length} karakter
                      dipelajari
                    </p>
                  </div>
                </div>

                <div className="flex-1 w-full md:max-w-md">
                  <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-600 dark:text-slate-300">
                    <span>{Math.round(progress.percentage)}% Selesai</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        activeLevel === "N5"
                          ? "from-green-400 to-green-600"
                          : activeLevel === "N4"
                            ? "from-blue-400 to-blue-600"
                            : "from-purple-400 to-purple-600"
                      }`}
                    ></motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-indigo-500">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-medium animate-pulse">Fetching Kanji...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-red-700 mb-2">
            Failed to load Kanji
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setKanjiData((prev) => ({ ...prev, [activeLevel]: undefined }));
              setError(null);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm hover:shadow-md"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Empty State for Category */}
      {!loading &&
        !error &&
        currentKanji.length === 0 &&
        activeCategory !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
              Tidak ditemukan
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Tidak ada Kanji di level {activeLevel} yang cocok dengan kategori
              "{CATEGORIES.find((c) => c.id === activeCategory)?.label}".
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Tampilkan Semua
            </button>
          </motion.div>
        )}

      {/* Kanji Grid */}
      {!loading && !error && currentKanji.length > 0 && (
        <motion.div
          key={`${activeLevel}-${activeCategory}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {currentKanji.map((kanji, idx) => {
            const learned = isLearned(kanji.character);
            return (
              <motion.div
                key={`${kanji.character}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02, duration: 0.3 }}
              >
                <Link
                  href={`/kanji/${encodeURIComponent(kanji.character)}`}
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 h-full border ${
                    learned
                      ? "bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:shadow-green-100 hover:border-green-300"
                      : "bg-white/70 dark:bg-slate-800/70 border-white/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 hover:-translate-y-1"
                  } backdrop-blur-sm shadow-sm`}
                >
                  {/* Kanji Character */}
                  <span
                    className={`text-5xl font-bold mb-3 transition-colors ${
                      learned
                        ? "text-green-700 dark:text-green-400"
                        : "text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  >
                    {kanji.character}
                  </span>

                  {/* English Meaning */}
                  {kanji.meaning && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium line-clamp-1 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                      {kanji.meaning.split(",").slice(0, 1).join("")}
                    </span>
                  )}

                  {/* Readings */}
                  <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center space-y-0.5 opacity-80 group-hover:opacity-100">
                    {kanji.onyomi?.romaji && (
                      <span className="block">{kanji.onyomi.romaji}</span>
                    )}
                    {kanji.kunyomi?.romaji && (
                      <span className="block">{kanji.kunyomi.romaji}</span>
                    )}
                  </div>

                  {/* Badge */}
                  {learned && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Stats Footer */}
      {!loading && currentKanji.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 text-center mt-8"
        >
          <Card className="py-4">
            <div className="text-3xl font-bold text-indigo-600">
              {currentKanji.length}
            </div>
            <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Total Kanji
            </div>
          </Card>
          <Card className="py-4">
            <div className="text-3xl font-bold text-green-600">
              {progress.learned}
            </div>
            <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Dikuasai
            </div>
          </Card>
          <Card className="py-4">
            <div className="text-3xl font-bold text-orange-500">
              {progress.total - progress.learned}
            </div>
            <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Tersisa
            </div>
          </Card>
        </motion.div>
      )}

      {/* API Info */}
      <div className="text-center text-xs text-slate-400 mt-12 pb-4">
        Data powered by{" "}
        <a
          href="https://kanjialive.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-indigo-500 transition-colors"
        >
          Kanji Alive API
        </a>
      </div>
    </div>
  );
}
