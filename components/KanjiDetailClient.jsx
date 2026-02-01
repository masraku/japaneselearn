"use client";

import { useState, useRef } from "react";
import { useProgress } from "@/lib/progress-context";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  CheckCircle2,
  BookOpen,
  PenTool,
  Layers,
  GraduationCap,
} from "lucide-react";
import Background from "@/components/ui/Background";
import Card from "@/components/ui/Card";

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
    if (!url) return;
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

  return (
    <div className="pb-12 min-h-screen">
      <Background />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center"
        >
          <Link
            href="/kanji"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </Link>

          <button
            onClick={handleToggleLearned}
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all shadow-md ${
              learned
                ? "bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600 border border-green-200"
                : "bg-white text-slate-600 hover:bg-green-50 hover:text-green-600 border border-slate-200"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {learned ? "Marked as Learned" : "Mark as Learned"}
          </button>
        </motion.div>

        {/* Main Hero Card */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 flex flex-col items-center justify-center text-center py-12 bg-white/60 backdrop-blur-xl border-white/60">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative"
            >
              <h1 className="text-9xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
                {kanji.character}
              </h1>
              {learned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
              )}
            </motion.div>
            <p className="text-2xl font-medium text-slate-600 capitalize">
              {kanji.meaning?.english || "-"}
            </p>
          </Card>

          <div className="md:col-span-2 space-y-6">
            {/* Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {/* Onyomi */}
              <Card className="flex flex-col justify-between bg-indigo-50/50 border-indigo-100">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <Volume2 className="w-5 h-5" />
                    </span>
                    <h3 className="font-bold text-indigo-900">
                      Onyomi (Chinese)
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-slate-800">
                      {kanji.onyomi?.katakana || "-"}
                    </p>
                    <p className="text-slate-500 font-medium">
                      {kanji.onyomi?.romaji || "-"}
                    </p>
                  </div>
                </div>
                {kanji.onyomi?.katakana && (
                  <button
                    onClick={() =>
                      speakJapanese(kanji.onyomi.katakana, "onyomi")
                    }
                    className="mt-4 w-full py-2 bg-white text-indigo-600 rounded-xl font-semibold shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying === "onyomi" ? (
                      <Volume2 className="animate-pulse w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    Listen
                  </button>
                )}
              </Card>

              {/* Kunyomi */}
              <Card className="flex flex-col justify-between bg-emerald-50/50 border-emerald-100">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <Volume2 className="w-5 h-5" />
                    </span>
                    <h3 className="font-bold text-emerald-900">
                      Kunyomi (Japanese)
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-slate-800">
                      {kanji.kunyomi?.hiragana || "-"}
                    </p>
                    <p className="text-slate-500 font-medium">
                      {kanji.kunyomi?.romaji || "-"}
                    </p>
                  </div>
                </div>
                {kanji.kunyomi?.hiragana && (
                  <button
                    onClick={() =>
                      speakJapanese(kanji.kunyomi.hiragana, "kunyomi")
                    }
                    className="mt-4 w-full py-2 bg-white text-emerald-600 rounded-xl font-semibold shadow-sm hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying === "kunyomi" ? (
                      <Volume2 className="animate-pulse w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    Listen
                  </button>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center py-4 bg-white/50 backdrop-blur-sm">
            <PenTool className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-slate-800">
              {kanji.strokes?.count || "-"}
            </div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Strokes
            </div>
          </Card>
          <Card className="text-center py-4 bg-white/50 backdrop-blur-sm">
            <Layers className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-slate-800">
              {kanji.radical?.character || "-"}
            </div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Radical
            </div>
          </Card>
          <Card className="text-center py-4 bg-white/50 backdrop-blur-sm">
            <GraduationCap className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-slate-800">
              {kanjiData?.references?.grade || "-"}
            </div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Grade
            </div>
          </Card>
          <Card className="text-center py-4 bg-white/50 backdrop-blur-sm">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-slate-800">
              {kanjiData?.references?.kodansha || "-"}
            </div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Kodansha
            </div>
          </Card>
        </div>

        {/* Stroke Order */}
        {kanji.strokes?.images && kanji.strokes.images.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-md">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-slate-500" /> Stroke Order
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {kanji.strokes.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Stroke ${idx + 1}`}
                    className="w-16 h-16 border border-slate-200 rounded-lg bg-white"
                  />
                  <span className="absolute -top-2 -left-2 bg-slate-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
            {kanji.strokes?.video && (
              <div className="mt-6 flex justify-center">
                <video
                  src={kanji.strokes.video}
                  controls
                  className="rounded-xl shadow-md max-w-full md:max-w-sm border border-slate-200"
                />
              </div>
            )}
          </Card>
        )}

        {/* Example Words */}
        {kanjiData?.examples && kanjiData.examples.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-md">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-500" /> Example Words
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {kanjiData.examples.slice(0, 6).map((example, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="text-xl font-bold text-slate-800 mb-1">
                      {example.japanese}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                      {example.meaning?.english || "-"}
                    </div>
                  </div>
                  {example.audio?.mp3 && (
                    <button
                      onClick={() =>
                        playAudio(example.audio.mp3, `example-${idx}`)
                      }
                      className="p-3 bg-slate-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      {isPlaying === `example-${idx}` ? (
                        <Volume2 className="animate-pulse w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
