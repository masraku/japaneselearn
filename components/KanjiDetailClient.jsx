"use client";

import { useState, useRef } from "react";
import { useProgress } from "@/lib/progress-context";
import Link from "next/link";

export default function KanjiDetailClient({ kanji, kanjiData }) {
  const { isLearned, markAsLearned, unmarkAsLearned } = useProgress();
  const [isPlaying, setIsPlaying] = useState(null);
  const audioRef = useRef(null);

  const learned = isLearned(kanji.character);

  const handleToggleLearned = () => {
    if (learned) {
      unmarkAsLearned(kanji.character);
    } else {
      markAsLearned(kanji.character);
    }
  };

  const playAudio = (url, type) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(url);
    audioRef.current.play();
    setIsPlaying(type);
    audioRef.current.onended = () => setIsPlaying(null);
  };

  // Text-to-Speech for Japanese pronunciation
  const speakJapanese = (text, type) => {
    if (!text || text === "-") return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8; // Slower for learning
    
    setIsPlaying(type);
    utterance.onend = () => setIsPlaying(null);
    utterance.onerror = () => setIsPlaying(null);
    
    window.speechSynthesis.speak(utterance);
  };

  // Get audio URLs from the data
  const onyomiAudio = kanji.onyomi?.audio;
  const kunyomiAudio = kanji.kunyomi?.audio;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back Button */}
      <Link
        href="/kanji"
        className="inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Back to Kanji List
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Kanji Character */}
        <div className="relative inline-block">
          <h1 className="text-8xl font-bold text-gray-800 mb-4">
            {kanji.character}
          </h1>
          {learned && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
              ✓ Learned
            </span>
          )}
        </div>

        {/* Meaning */}
        <p className="text-2xl text-gray-600 mb-6">
          {kanji.meaning?.english || "-"}
        </p>

        {/* Mark as Learned Button */}
        <button
          onClick={handleToggleLearned}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            learned
              ? "bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600"
              : "bg-green-500 text-white hover:bg-green-600 shadow-lg"
          }`}
        >
          {learned ? "✓ Marked as Learned (Click to Unmark)" : "Mark as Learned"}
        </button>
      </div>

      {/* Readings with Audio */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Onyomi */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            音読み (Onyomi)
          </h3>
          <p className="text-2xl font-bold text-gray-800 mb-3">
            {kanji.onyomi?.katakana || "-"}
          </p>
          <p className="text-gray-600 mb-3">
            {kanji.onyomi?.romaji || "-"}
          </p>
          {kanji.onyomi?.katakana && (
            <button
              onClick={() => speakJapanese(kanji.onyomi.katakana, "onyomi")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isPlaying === "onyomi"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {isPlaying === "onyomi" ? "🔊 Playing..." : "🔈 Listen"}
            </button>
          )}
        </div>

        {/* Kunyomi */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            訓読み (Kunyomi)
          </h3>
          <p className="text-2xl font-bold text-gray-800 mb-3">
            {kanji.kunyomi?.hiragana || "-"}
          </p>
          <p className="text-gray-600 mb-3">
            {kanji.kunyomi?.romaji || "-"}
          </p>
          {kanji.kunyomi?.hiragana && (
            <button
              onClick={() => speakJapanese(kanji.kunyomi.hiragana, "kunyomi")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isPlaying === "kunyomi"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {isPlaying === "kunyomi" ? "🔊 Playing..." : "🔈 Listen"}
            </button>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600">
              {kanji.strokes?.count || "-"}
            </div>
            <div className="text-sm text-gray-500">Strokes</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xl font-bold text-purple-600">
              {kanji.radical?.character || "-"}
            </div>
            <div className="text-sm text-gray-500">Radical</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-lg font-bold text-green-600">
              {kanjiData?.references?.grade || "-"}
            </div>
            <div className="text-sm text-gray-500">Grade</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-lg font-bold text-orange-600">
              {kanjiData?.references?.kodansha || "-"}
            </div>
            <div className="text-sm text-gray-500">Kodansha</div>
          </div>
        </div>
      </div>

      {/* Stroke Order Video (if available) */}
      {kanji.strokes?.images && kanji.strokes.images.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Stroke Order</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {kanji.strokes.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Stroke ${idx + 1}`}
                className="w-16 h-16 border rounded"
              />
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {kanjiData?.examples && kanjiData.examples.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Example Words</h3>
          <div className="space-y-3">
            {kanjiData.examples.slice(0, 5).map((example, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="text-xl font-bold">
                    {example.japanese}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({example.meaning?.english || "-"})
                  </span>
                </div>
                {example.audio?.mp3 && (
                  <button
                    onClick={() => playAudio(example.audio.mp3, `example-${idx}`)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      isPlaying === `example-${idx}`
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    🔈
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
