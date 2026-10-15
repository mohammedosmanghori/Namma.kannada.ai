export type ExplanationLanguage = 'en' | 'hi';

export type BeginnerLevel = 'beginner' | 'novice' | 'elementary';

export interface UserPreferences {
  explanationLanguage: ExplanationLanguage;
  beginnerLevel: BeginnerLevel;
  dailyTarget: number; // e.g. 5, 10, 15, 20
  fontSize: 'normal' | 'large';
  showTransliteration: boolean;
}

export interface ExampleSentence {
  kannada: string;
  transliteration: string;
  english: string;
  hindi: string;
  contextNote?: string;
}

export interface VocabularyItem {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  hindi: string;
  category: 'vowel' | 'greeting' | 'pronoun' | 'question' | 'verb' | 'number' | 'commute' | 'food' | 'market' | 'polite';
  level: BeginnerLevel;
  explanation: {
    en: string;
    hi: string;
  };
  examples: ExampleSentence[];
  practiceQuestion: {
    questionEn: string;
    questionHi: string;
    options: string[];
    correctIndex: number;
    explanationEn: string;
    explanationHi: string;
  };
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole: string; // e.g. "Auto Driver (ರಮೇಶ್)", "Passenger (ಪ್ರಿಯಾ)"
  kannada: string;
  transliteration: string;
  english: string;
  hindi: string;
  breakdown?: {
    word: string;
    transliteration: string;
    meaningEn: string;
    meaningHi: string;
  }[];
  culturalNote?: {
    en: string;
    hi: string;
  };
}

export interface Dialogue {
  id: string;
  title: string;
  titleKannada: string;
  situation: string;
  situationHindi: string;
  category: 'auto' | 'restaurant' | 'market' | 'greeting' | 'directions' | 'workplace';
  level: BeginnerLevel;
  lines: DialogueLine[];
  comprehensionQuiz: {
    questionEn: string;
    questionHi: string;
    options: string[];
    correctIndex: number;
    feedbackEn: string;
    feedbackHi: string;
  }[];
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  titleKannada: string;
  level: BeginnerLevel;
  category: string;
  descriptionEn: string;
  descriptionHi: string;
  objectivesEn: string[];
  objectivesHi: string[];
  vocabularyIds: string[];
  grammarNotes: {
    headingEn: string;
    headingHi: string;
    contentEn: string;
    contentHi: string;
    formula?: string;
    sampleRule?: string;
  }[];
  workedDialogueId?: string;
  miniQuizIds: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'script-match' | 'fill-blank' | 'meaning-match';
  lessonId?: string;
  kannadaPrompt?: string;
  transliterationPrompt?: string;
  questionEn: string;
  questionHi: string;
  options: string[]; // Options displayed to user
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
  relatedVocabId?: string;
}

export interface ItemRecallStat {
  itemId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  recallRating?: 'needs_practice' | 'good' | 'mastered';
  lastPracticed?: string; // ISO date
  nextReviewDate?: string; // ISO date
  intervalDays: number;
  isMissed: boolean;
}

export interface LearningProgress {
  completedLessonIds: string[];
  masteredVocabIds: string[];
  bookmarkedItemIds: string[];
  bookmarkedDialogueIds: string[];
  itemStats: Record<string, ItemRecallStat>;
  dailyHistory: {
    date: string; // YYYY-MM-DD
    itemsCompleted: number;
  }[];
  streak: number;
  lastActiveDate: string;
}

export type ActiveSection =
  | 'home'
  | 'lessons'
  | 'vocabulary'
  | 'dialogues'
  | 'quizzes'
  | 'flashcards'
  | 'saved'
  | 'progress';
