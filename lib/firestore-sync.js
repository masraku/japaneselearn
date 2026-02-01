import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Save user progress to Firestore
 */
export async function saveProgressToCloud(userId, progressData) {
  if (!userId) return;
  
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      progress: {
        learnedKanji: progressData.learnedKanji || [],
        learnedHiragana: progressData.learnedHiragana || [],
        learnedKatakana: progressData.learnedKatakana || [],
        quizHistory: progressData.quizHistory || [],
      },
      lastUpdated: serverTimestamp(),
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error saving progress to cloud:", error);
    return false;
  }
}

/**
 * Load user progress from Firestore
 */
export async function loadProgressFromCloud(userId) {
  if (!userId) return null;
  
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data().progress;
    }
    return null;
  } catch (error) {
    console.error("Error loading progress from cloud:", error);
    return null;
  }
}

/**
 * Merge local and cloud progress (cloud takes precedence for conflicts)
 */
export function mergeProgress(localProgress, cloudProgress) {
  if (!cloudProgress) return localProgress;
  if (!localProgress) return cloudProgress;
  
  // Merge arrays, removing duplicates
  const mergeArrays = (local, cloud) => {
    const combined = [...new Set([...(local || []), ...(cloud || [])])];
    return combined;
  };
  
  return {
    learnedKanji: mergeArrays(localProgress.learnedKanji, cloudProgress.learnedKanji),
    learnedHiragana: mergeArrays(localProgress.learnedHiragana, cloudProgress.learnedHiragana),
    learnedKatakana: mergeArrays(localProgress.learnedKatakana, cloudProgress.learnedKatakana),
    quizHistory: [
      ...(cloudProgress.quizHistory || []),
      ...(localProgress.quizHistory || []).filter(
        local => !(cloudProgress.quizHistory || []).some(cloud => cloud.id === local.id)
      ),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)),
  };
}
