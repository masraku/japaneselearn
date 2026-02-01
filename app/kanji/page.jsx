"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";
import ProgressBar from "@/components/ProgressBar";

// Grade mapping to JLPT levels (approximate)
// Grade 1-2 ≈ N5, Grade 3-4 ≈ N4, Grade 5-6 ≈ N3
const LEVELS = [
  { id: "N5", label: "N5", grades: ["1", "2"], description: "Beginner" },
  { id: "N4", label: "N4", grades: ["3", "4"], description: "Elementary" },
  { id: "N3", label: "N3", grades: ["5", "6"], description: "Intermediate" },
];

export default function KanjiPage() {
  const [activeLevel, setActiveLevel] = useState("N5");
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
        // Fetch kanji for each grade in this level
        const promises = level.grades.map((grade) =>
          fetch(`/api/kanji/grade?grade=${grade}`).then((res) => res.json())
        );

        const results = await Promise.all(promises);
        
        // Combine all kanji from all grades
        const allKanji = results.flatMap((r) => r.kanji || []);
        
        // Remove duplicates based on character
        const uniqueKanji = allKanji.filter(
          (kanji, index, self) =>
            index === self.findIndex((k) => k.character === kanji.character)
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

  const currentKanji = kanjiData[activeLevel] || [];
  const kanjiCharacters = currentKanji.map((k) => k.character);
  const progress = getProgress(kanjiCharacters);

  // Get overall progress across all loaded levels
  const allLoadedKanji = Object.values(kanjiData).flat().map((k) => k.character);
  const overallProgress = getProgress(allLoadedKanji);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">📚 Kanji Learning</h1>
        <p className="text-gray-600 mt-2">
          Master kanji from JLPT N5 to N3 (powered by Kanji Alive API)
        </p>
      </div>

      {/* Overall Progress */}
      {allLoadedKanji.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Overall Progress</h2>
          <ProgressBar
            learned={overallProgress.learned}
            total={overallProgress.total}
            label="All Levels"
          />
        </div>
      )}

      {/* Level Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {LEVELS.map((level) => {
          const levelKanji = kanjiData[level.id] || [];
          const levelProgress = getProgress(levelKanji.map((k) => k.character));
          return (
            <button
              key={level.id}
              onClick={() => setActiveLevel(level.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeLevel === level.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
            >
              <div>{level.label}</div>
              <div className="text-xs opacity-75">{level.description}</div>
              {levelKanji.length > 0 && (
                <div className="text-xs opacity-75">
                  {levelProgress.learned}/{levelKanji.length}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Level Progress */}
      {currentKanji.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <ProgressBar
            learned={progress.learned}
            total={progress.total}
            label={`${activeLevel} Progress`}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading kanji from API...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => {
              setKanjiData((prev) => ({ ...prev, [activeLevel]: undefined }));
              setError(null);
            }}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Kanji Grid */}
      {!loading && !error && currentKanji.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentKanji.map((kanji, idx) => {
            const learned = isLearned(kanji.character);
            return (
              <Link
                key={`${kanji.character}-${idx}`}
                href={`/kanji/${encodeURIComponent(kanji.character)}`}
                className={`relative flex flex-col items-center p-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg ${
                  learned
                    ? "bg-green-100 text-green-800 ring-2 ring-green-400"
                    : "bg-white text-gray-800 shadow hover:bg-blue-50"
                }`}
              >
                {/* Kanji Character */}
                <span className="text-4xl font-bold mb-2">{kanji.character}</span>
                
                {/* English Meaning */}
                {kanji.meaning && (
                  <span className="text-xs text-gray-600 text-center font-medium mb-1">
                    {kanji.meaning.split(",").slice(0, 2).join(", ")}
                  </span>
                )}
                
                {/* Romaji */}
                <div className="text-[10px] text-gray-400 text-center">
                  {kanji.onyomi?.romaji && (
                    <span className="block">音: {kanji.onyomi.romaji}</span>
                  )}
                  {kanji.kunyomi?.romaji && (
                    <span className="block">訓: {kanji.kunyomi.romaji}</span>
                  )}
                </div>
                
                {learned && (
                  <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {!loading && currentKanji.length > 0 && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-3xl font-bold text-blue-600">
              {currentKanji.length}
            </div>
            <div className="text-sm text-gray-500">Total Kanji</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-3xl font-bold text-green-600">
              {progress.learned}
            </div>
            <div className="text-sm text-gray-500">Learned</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-3xl font-bold text-orange-600">
              {progress.total - progress.learned}
            </div>
            <div className="text-sm text-gray-500">Remaining</div>
          </div>
        </div>
      )}

      {/* API Info */}
      <div className="text-center text-xs text-gray-400 mt-8">
        Data powered by{" "}
        <a
          href="https://kanjialive.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          Kanji Alive API
        </a>
      </div>
    </div>
  );
}

