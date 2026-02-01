"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";

// Hiragana data
const HIRAGANA = [
  { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" }, { char: "え", romaji: "e" }, { char: "お", romaji: "o" },
  { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" },
  { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
  { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" }, { char: "と", romaji: "to" },
  { char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" },
  { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
  { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" }, { char: "め", romaji: "me" }, { char: "も", romaji: "mo" },
  { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" },
  { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" },
  { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" },
];

// Katakana data
const KATAKANA = [
  { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" }, { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" },
  { char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" }, { char: "コ", romaji: "ko" },
  { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" },
  { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" },
  { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" },
  { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" },
  { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" }, { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" },
  { char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" },
  { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" },
  { char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" }, { char: "ン", romaji: "n" },
];

const CATEGORIES = [
  { id: "hiragana", label: "ひらがな", icon: "あ", description: "Basic Japanese alphabet", data: HIRAGANA },
  { id: "katakana", label: "カタカナ", icon: "ア", description: "Used for foreign words", data: KATAKANA },
  { id: "kanji", label: "漢字", icon: "字", description: "Chinese characters", data: null },
];

// Flashcard Component
function Flashcard({ item, isFlipped, onFlip, onNext, onPrev, onSpeak, currentIndex, total }) {
  return (
    <div className="flex flex-col items-center">
      {/* Progress indicator */}
      <div className="text-sm text-gray-500 mb-4">
        {currentIndex + 1} / {total}
      </div>

      {/* Card */}
      <div
        onClick={onFlip}
        className="relative w-72 h-80 cursor-pointer perspective-1000"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-8xl font-bold mb-4">{item.char || item.character}</span>
            <span className="text-sm opacity-75">Click to reveal</span>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-6xl font-bold mb-2">{item.char || item.character}</span>
            <span className="text-3xl mb-2">{item.romaji}</span>
            {item.meaning && (
              <span className="text-lg opacity-90 text-center px-4">{item.meaning}</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold"
        >
          ← Prev
        </button>
        <button
          onClick={() => onSpeak(item.char || item.character)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🔊 Speak
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold"
        >
          Next →
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-gray-400 mt-4">
        Use ← → arrow keys to navigate, Space to flip, S to speak
      </p>
    </div>
  );
}

// Study Mode Selection
function StudyModeSelector({ onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all text-center group"
        >
          <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">
            {cat.icon}
          </span>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{cat.label}</h3>
          <p className="text-gray-500">{cat.description}</p>
          {cat.data && (
            <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {cat.data.length} characters
            </span>
          )}
          {cat.id === "kanji" && (
            <span className="inline-block mt-3 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
              Go to Kanji page →
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Chart View for Hiragana/Katakana
function CharacterChart({ data, title, onStartStudy }) {
  const [learned, setLearned] = useState(new Set());

  const toggleLearned = (char) => {
    setLearned((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(char)) {
        newSet.delete(char);
      } else {
        newSet.add(char);
      }
      return newSet;
    });
  };

  const speakChar = (char) => {
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // Group by rows (5 per row for vowel groups)
  const vowelGroups = [
    { label: "Vowels", chars: data.slice(0, 5) },
    { label: "K-row", chars: data.slice(5, 10) },
    { label: "S-row", chars: data.slice(10, 15) },
    { label: "T-row", chars: data.slice(15, 20) },
    { label: "N-row", chars: data.slice(20, 25) },
    { label: "H-row", chars: data.slice(25, 30) },
    { label: "M-row", chars: data.slice(30, 35) },
    { label: "Y-row", chars: data.slice(35, 38) },
    { label: "R-row", chars: data.slice(38, 43) },
    { label: "W-row + N", chars: data.slice(43) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title} Chart</h2>
        <div className="flex gap-2">
          <button
            onClick={onStartStudy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            📚 Flashcard Mode
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-gray-500 pb-4 pr-4">Group</th>
              {["a", "i", "u", "e", "o"].map((v) => (
                <th key={v} className="text-center text-gray-500 pb-4 px-2 min-w-[60px]">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vowelGroups.map((group, idx) => (
              <tr key={idx} className="border-t border-gray-100">
                <td className="text-sm text-gray-500 py-3 pr-4">{group.label}</td>
                {[0, 1, 2, 3, 4].map((i) => {
                  const item = group.chars[i];
                  if (!item) return <td key={i} className="text-center py-3 px-2"></td>;
                  const isLearned = learned.has(item.char);
                  return (
                    <td key={i} className="text-center py-3 px-2">
                      <button
                        onClick={() => speakChar(item.char)}
                        onDoubleClick={() => toggleLearned(item.char)}
                        className={`inline-flex flex-col items-center p-2 rounded-lg transition hover:bg-blue-50 ${
                          isLearned ? "bg-green-100 ring-2 ring-green-400" : ""
                        }`}
                        title="Click to hear, double-click to mark learned"
                      >
                        <span className="text-2xl font-bold">{item.char}</span>
                        <span className="text-xs text-gray-500">{item.romaji}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Click a character to hear pronunciation • Double-click to mark as learned</p>
        <p className="mt-1">
          Progress: {learned.size} / {data.length} learned
        </p>
      </div>
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
      setCurrentIndex((prev) => (prev - 1 + shuffledData.length) % shuffledData.length);
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
  }, [studyMode, selectedCategory, goNext, goPrev, currentIndex, shuffledData, speakJapanese]);

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
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">📖 Learn Japanese</h1>
        <p className="text-gray-600 mt-2">
          Master Hiragana, Katakana, and Kanji step by step
        </p>
      </div>

      {/* Breadcrumb / Back button */}
      {selectedCategory && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (studyMode === "flashcard") {
                setStudyMode("chart");
              } else {
                setSelectedCategory(null);
              }
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← Back
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{selectedCategory.label}</span>
          {studyMode === "flashcard" && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Flashcards</span>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      {!selectedCategory ? (
        // Category Selection
        <StudyModeSelector onSelect={handleCategorySelect} />
      ) : studyMode === "chart" ? (
        // Chart View
        <CharacterChart
          data={selectedCategory.data}
          title={selectedCategory.label}
          onStartStudy={startFlashcardMode}
        />
      ) : (
        // Flashcard View
        shuffledData.length > 0 && (
          <div className="flex flex-col items-center py-8">
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
              className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              🔀 Shuffle Cards
            </button>
          </div>
        )
      )}

      {/* Tips Section */}
      {!selectedCategory && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-4xl mx-auto">
          <h3 className="font-bold text-gray-800 mb-3">💡 Study Tips</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• Start with <strong>Hiragana</strong> - the foundation of Japanese writing</li>
            <li>• Learn <strong>Katakana</strong> next - used for foreign words and emphasis</li>
            <li>• Progress to <strong>Kanji</strong> after mastering the kana systems</li>
            <li>• Use the <strong>flashcard mode</strong> for active recall practice</li>
            <li>• Click characters to hear their pronunciation</li>
          </ul>
        </div>
      )}
    </div>
  );
}
