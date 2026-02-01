"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { saveProgressToCloud, loadProgressFromCloud, mergeProgress } from "./firestore-sync";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const { data: session, status } = useSession();
  const [learnedKanji, setLearnedKanji] = useState([]);
  const [learnedHiragana, setLearnedHiragana] = useState([]);
  const [learnedKatakana, setLearnedKatakana] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Track previous auth status to detect logout
  const prevStatusRef = useRef(status);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKanji = localStorage.getItem("learnedKanji");
    const savedHiragana = localStorage.getItem("learnedHiragana");
    const savedKatakana = localStorage.getItem("learnedKatakana");
    const savedQuizHistory = localStorage.getItem("quizHistory");
    const savedStudySessions = localStorage.getItem("studySessions");
    
    if (savedKanji) setLearnedKanji(JSON.parse(savedKanji));
    if (savedHiragana) setLearnedHiragana(JSON.parse(savedHiragana));
    if (savedKatakana) setLearnedKatakana(JSON.parse(savedKatakana));
    if (savedQuizHistory) setQuizHistory(JSON.parse(savedQuizHistory));
    if (savedStudySessions) setStudySessions(JSON.parse(savedStudySessions));
    
    setIsLoaded(true);
  }, []);

  // Detect logout and clear localStorage for previously authenticated users
  useEffect(() => {
    if (prevStatusRef.current === "authenticated" && status === "unauthenticated") {
      // User just logged out - clear localStorage
      localStorage.removeItem("learnedKanji");
      localStorage.removeItem("learnedHiragana");
      localStorage.removeItem("learnedKatakana");
      localStorage.removeItem("quizHistory");
      localStorage.removeItem("studySessions");
      
      // Reset state
      setLearnedKanji([]);
      setLearnedHiragana([]);
      setLearnedKatakana([]);
      setQuizHistory([]);
      setStudySessions([]);
      
      console.log("User logged out - localStorage cleared");
    }
    
    // Update previous status ref
    prevStatusRef.current = status;
  }, [status]);

  // Sync with cloud when user logs in
  useEffect(() => {
    const syncWithCloud = async () => {
      if (status === "authenticated" && session?.user?.id && isLoaded) {
        setIsSyncing(true);
        
        try {
          // Load cloud progress
          const cloudProgress = await loadProgressFromCloud(session.user.id);
          
          if (cloudProgress) {
            // Merge local and cloud
            const localProgress = {
              learnedKanji,
              learnedHiragana,
              learnedKatakana,
              quizHistory,
            };
            
            const merged = mergeProgress(localProgress, cloudProgress);
            
            // Update local state with merged data
            setLearnedKanji(merged.learnedKanji || []);
            setLearnedHiragana(merged.learnedHiragana || []);
            setLearnedKatakana(merged.learnedKatakana || []);
            setQuizHistory(merged.quizHistory || []);
          }
        } catch (error) {
          console.error("Error syncing with cloud:", error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncWithCloud();
  }, [status, session?.user?.id, isLoaded]);

  // Save to localStorage and cloud on change
  useEffect(() => {
    if (isLoaded) {
      // Always save to localStorage
      localStorage.setItem("learnedKanji", JSON.stringify(learnedKanji));
      localStorage.setItem("learnedHiragana", JSON.stringify(learnedHiragana));
      localStorage.setItem("learnedKatakana", JSON.stringify(learnedKatakana));
      localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
      localStorage.setItem("studySessions", JSON.stringify(studySessions));

      // Also save to cloud if logged in (debounced)
      if (status === "authenticated" && session?.user?.id && !isSyncing) {
        const timeoutId = setTimeout(() => {
          saveProgressToCloud(session.user.id, {
            learnedKanji,
            learnedHiragana,
            learnedKatakana,
            quizHistory,
          });
        }, 2000); // Debounce 2 seconds

        return () => clearTimeout(timeoutId);
      }
    }
  }, [learnedKanji, learnedHiragana, learnedKatakana, quizHistory, studySessions, isLoaded, status, session?.user?.id, isSyncing]);

  // Kanji functions
  const markAsLearned = (kanji) => {
    if (!learnedKanji.includes(kanji)) {
      setLearnedKanji((prev) => [...prev, kanji]);
      addStudySession("kanji", kanji);
    }
  };

  const unmarkAsLearned = (kanji) => {
    setLearnedKanji((prev) => prev.filter((k) => k !== kanji));
  };

  const isLearned = (kanji) => {
    return learnedKanji.includes(kanji);
  };

  const getProgress = (kanjiList) => {
    const learned = kanjiList.filter((k) => learnedKanji.includes(k)).length;
    return {
      learned,
      total: kanjiList.length,
      percentage: kanjiList.length > 0 ? Math.round((learned / kanjiList.length) * 100) : 0,
    };
  };

  // Hiragana/Katakana functions
  const markKanaLearned = (char, type) => {
    if (type === "hiragana" && !learnedHiragana.includes(char)) {
      setLearnedHiragana((prev) => [...prev, char]);
      addStudySession("hiragana", char);
    } else if (type === "katakana" && !learnedKatakana.includes(char)) {
      setLearnedKatakana((prev) => [...prev, char]);
      addStudySession("katakana", char);
    }
  };

  const isKanaLearned = (char, type) => {
    if (type === "hiragana") return learnedHiragana.includes(char);
    if (type === "katakana") return learnedKatakana.includes(char);
    return false;
  };

  const getKanaProgress = (type) => {
    const total = 46; // Basic kana count
    const learned = type === "hiragana" ? learnedHiragana.length : learnedKatakana.length;
    return {
      learned,
      total,
      percentage: Math.round((learned / total) * 100),
    };
  };

  // Quiz history functions
  const addQuizResult = (result) => {
    const newResult = {
      ...result,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setQuizHistory((prev) => [newResult, ...prev].slice(0, 50)); // Keep last 50
  };

  const getQuizStats = (level = null) => {
    const filtered = level 
      ? quizHistory.filter((q) => q.level === level)
      : quizHistory;
    
    if (filtered.length === 0) {
      return { totalQuizzes: 0, averageScore: 0, bestScore: 0, totalQuestions: 0 };
    }

    const totalQuizzes = filtered.length;
    const totalScore = filtered.reduce((sum, q) => sum + q.score, 0);
    const totalQuestions = filtered.reduce((sum, q) => sum + q.totalQuestions, 0);
    const averageScore = Math.round((totalScore / totalQuestions) * 100);
    const bestScore = Math.max(...filtered.map((q) => Math.round((q.score / q.totalQuestions) * 100)));

    return { totalQuizzes, averageScore, bestScore, totalQuestions };
  };

  // Study session tracking
  const addStudySession = (type, item) => {
    const session = {
      id: Date.now(),
      type,
      item,
      date: new Date().toISOString(),
    };
    setStudySessions((prev) => [session, ...prev].slice(0, 100)); // Keep last 100
  };

  const getRecentActivity = (limit = 10) => {
    return studySessions.slice(0, limit);
  };

  const getStudyStreak = () => {
    if (studySessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;

    // Group sessions by date
    const sessionDates = new Set(
      studySessions.map((s) => {
        const d = new Date(s.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    // Count consecutive days
    while (sessionDates.has(currentDate.getTime())) {
      streak++;
      currentDate = new Date(currentDate.getTime() - 86400000); // Go back 1 day
    }

    return streak;
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = studySessions.filter((s) => {
      const sessionDate = new Date(s.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    const kanjiLearned = todaySessions.filter((s) => s.type === "kanji").length;
    const hiraganaLearned = todaySessions.filter((s) => s.type === "hiragana").length;
    const katakanaLearned = todaySessions.filter((s) => s.type === "katakana").length;

    return {
      total: todaySessions.length,
      kanji: kanjiLearned,
      hiragana: hiraganaLearned,
      katakana: katakanaLearned,
    };
  };

  const resetProgress = () => {
    setLearnedKanji([]);
    setLearnedHiragana([]);
    setLearnedKatakana([]);
    setQuizHistory([]);
    setStudySessions([]);
  };

  return (
    <ProgressContext.Provider
      value={{
        // Kanji
        learnedKanji,
        markAsLearned,
        unmarkAsLearned,
        isLearned,
        getProgress,
        // Kana
        learnedHiragana,
        learnedKatakana,
        markKanaLearned,
        isKanaLearned,
        getKanaProgress,
        // Quiz
        quizHistory,
        addQuizResult,
        getQuizStats,
        // Study sessions
        studySessions,
        getRecentActivity,
        getStudyStreak,
        getTodayStats,
        // General
        resetProgress,
        isLoaded,
        isSyncing,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
