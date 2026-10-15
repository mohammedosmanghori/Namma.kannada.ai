import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActiveSection, ExplanationLanguage, ItemRecallStat, LearningProgress, UserPreferences } from '../types';

interface LearningContextType {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  progress: LearningProgress;
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  selectedDialogueId: string | null;
  setSelectedDialogueId: (id: string | null) => void;
  markLessonComplete: (lessonId: string) => void;
  toggleBookmarkItem: (id: string) => void;
  toggleBookmarkDialogue: (id: string) => void;
  recordItemPractice: (
    itemId: string,
    isCorrect: boolean,
    rating?: 'needs_practice' | 'good' | 'mastered'
  ) => void;
  getReviewDeckItemIds: () => string[];
  resetAllProgress: () => void;
  seedSampleProgress: () => void;
}

const PREFERENCES_STORAGE_KEY = 'namma_kannada_preferences_v1';
const PROGRESS_STORAGE_KEY = 'namma_kannada_progress_v1';

const defaultPreferences: UserPreferences = {
  explanationLanguage: 'en',
  beginnerLevel: 'beginner',
  dailyTarget: 10,
  fontSize: 'normal',
  showTransliteration: true,
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const defaultProgress: LearningProgress = {
  completedLessonIds: [],
  masteredVocabIds: [],
  bookmarkedItemIds: ['vocab_namaskara', 'vocab_oota_ayta'],
  bookmarkedDialogueIds: [],
  itemStats: {},
  dailyHistory: [{ date: getTodayDateString(), itemsCompleted: 0 }],
  streak: 1,
  lastActiveDate: getTodayDateString(),
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const [progress, setProgress] = useState<LearningProgress>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultProgress, ...parsed };
      }
      return defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedDialogueId, setSelectedDialogueId] = useState<string | null>(null);

  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Failed to save preferences to localStorage', e);
    }
  }, [preferences]);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const markLessonComplete = (lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  };

  const toggleBookmarkItem = (id: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedItemIds.includes(id);
      return {
        ...prev,
        bookmarkedItemIds: exists
          ? prev.bookmarkedItemIds.filter((item) => item !== id)
          : [...prev.bookmarkedItemIds, id],
      };
    });
  };

  const toggleBookmarkDialogue = (id: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedDialogueIds.includes(id);
      return {
        ...prev,
        bookmarkedDialogueIds: exists
          ? prev.bookmarkedDialogueIds.filter((item) => item !== id)
          : [...prev.bookmarkedDialogueIds, id],
      };
    });
  };

  const recordItemPractice = (
    itemId: string,
    isCorrect: boolean,
    rating?: 'needs_practice' | 'good' | 'mastered'
  ) => {
    const today = getTodayDateString();

    setProgress((prev) => {
      const existingStat: ItemRecallStat = prev.itemStats[itemId] || {
        itemId,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        intervalDays: 1,
        isMissed: false,
      };

      const newAttempts = existingStat.attempts + 1;
      const newCorrect = isCorrect ? existingStat.correct + 1 : existingStat.correct;
      const newIncorrect = !isCorrect ? existingStat.incorrect + 1 : existingStat.incorrect;

      // Spaced review calculation
      let isMissed = !isCorrect;
      let nextInterval = existingStat.intervalDays || 1;

      if (!isCorrect || rating === 'needs_practice') {
        isMissed = true;
        nextInterval = 1; // repeat tomorrow or immediate revision
      } else if (rating === 'good') {
        isMissed = false;
        nextInterval = Math.max(2, nextInterval * 2);
      } else if (rating === 'mastered') {
        isMissed = false;
        nextInterval = Math.max(4, nextInterval * 3);
      } else if (isCorrect) {
        nextInterval = Math.max(2, nextInterval * 2);
      }

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextInterval);
      const nextReviewDate = nextDate.toISOString().split('T')[0];

      const updatedStat: ItemRecallStat = {
        itemId,
        attempts: newAttempts,
        correct: newCorrect,
        incorrect: newIncorrect,
        recallRating: rating || (isCorrect ? 'good' : 'needs_practice'),
        lastPracticed: today,
        nextReviewDate,
        intervalDays: nextInterval,
        isMissed,
      };

      // Update mastered items list
      let masteredVocabIds = [...prev.masteredVocabIds];
      if (rating === 'mastered' || (newCorrect >= 3 && newIncorrect === 0)) {
        if (!masteredVocabIds.includes(itemId)) {
          masteredVocabIds.push(itemId);
        }
      } else if (!isCorrect) {
        masteredVocabIds = masteredVocabIds.filter((id) => id !== itemId);
      }

      // Update daily history & streak
      const dailyHistory = [...prev.dailyHistory];
      const todayEntryIndex = dailyHistory.findIndex((entry) => entry.date === today);
      if (todayEntryIndex >= 0) {
        dailyHistory[todayEntryIndex] = {
          date: today,
          itemsCompleted: dailyHistory[todayEntryIndex].itemsCompleted + 1,
        };
      } else {
        dailyHistory.push({ date: today, itemsCompleted: 1 });
      }

      // Streak check
      let streak = prev.streak;
      if (prev.lastActiveDate !== today) {
        const lastActive = new Date(prev.lastActiveDate);
        const current = new Date(today);
        const diffDays = Math.round((current.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          streak += 1;
        } else if (diffDays > 1) {
          streak = 1;
        }
      }

      return {
        ...prev,
        itemStats: {
          ...prev.itemStats,
          [itemId]: updatedStat,
        },
        masteredVocabIds,
        dailyHistory,
        streak,
        lastActiveDate: today,
      };
    });
  };

  const getReviewDeckItemIds = (): string[] => {
    const today = getTodayDateString();
    const missedIds: string[] = [];
    const dueIds: string[] = [];

    Object.values(progress.itemStats).forEach((stat) => {
      if (stat.isMissed) {
        missedIds.push(stat.itemId);
      } else if (stat.nextReviewDate && stat.nextReviewDate <= today) {
        dueIds.push(stat.itemId);
      }
    });

    // Combine missed first, then due
    const combined = Array.from(new Set([...missedIds, ...dueIds]));
    return combined;
  };

  const resetAllProgress = () => {
    setProgress({
      completedLessonIds: [],
      masteredVocabIds: [],
      bookmarkedItemIds: [],
      bookmarkedDialogueIds: [],
      itemStats: {},
      dailyHistory: [{ date: getTodayDateString(), itemsCompleted: 0 }],
      streak: 1,
      lastActiveDate: getTodayDateString(),
    });
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  };

  const seedSampleProgress = () => {
    const today = getTodayDateString();
    setProgress({
      completedLessonIds: ['lesson_1_vowels', 'lesson_2_greetings'],
      masteredVocabIds: ['vocab_namaskara', 'vowel_a', 'vowel_aa'],
      bookmarkedItemIds: ['vocab_namaskara', 'vocab_oota_ayta', 'vocab_meter_haaki'],
      bookmarkedDialogueIds: ['dialogue_auto_rickshaw'],
      itemStats: {
        vocab_namaskara: {
          itemId: 'vocab_namaskara',
          attempts: 4,
          correct: 4,
          incorrect: 0,
          recallRating: 'mastered',
          lastPracticed: today,
          intervalDays: 7,
          isMissed: false,
        },
        vocab_meter_haaki: {
          itemId: 'vocab_meter_haaki',
          attempts: 2,
          correct: 1,
          incorrect: 1,
          recallRating: 'needs_practice',
          lastPracticed: today,
          nextReviewDate: today,
          intervalDays: 1,
          isMissed: true,
        },
        vocab_hegiddira: {
          itemId: 'vocab_hegiddira',
          attempts: 3,
          correct: 3,
          incorrect: 0,
          recallRating: 'good',
          lastPracticed: today,
          intervalDays: 4,
          isMissed: false,
        },
      },
      dailyHistory: [
        { date: '2026-10-13', itemsCompleted: 8 },
        { date: '2026-10-14', itemsCompleted: 12 },
        { date: today, itemsCompleted: 6 },
      ],
      streak: 3,
      lastActiveDate: today,
    });
  };

  return (
    <LearningContext.Provider
      value={{
        preferences,
        setPreferences,
        updatePreferences,
        progress,
        activeSection,
        setActiveSection,
        selectedLessonId,
        setSelectedLessonId,
        selectedDialogueId,
        setSelectedDialogueId,
        markLessonComplete,
        toggleBookmarkItem,
        toggleBookmarkDialogue,
        recordItemPractice,
        getReviewDeckItemIds,
        resetAllProgress,
        seedSampleProgress,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
