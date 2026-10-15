import React from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  STRUCTURED_LESSONS,
  VOCABULARY_ITEMS,
  KANNADA_VOWELS,
} from '../../data/curriculum';
import {
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  TrendingUp,
  CheckCircle,
  Play,
  RotateCcw,
  Flame,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const DashboardSection: React.FC = () => {
  const {
    preferences,
    progress,
    setActiveSection,
    setSelectedLessonId,
    getReviewDeckItemIds,
  } = useLearning();

  const isHindi = preferences.explanationLanguage === 'hi';
  const reviewDeckIds = getReviewDeckItemIds();

  // Find next uncompleted lesson
  const nextLesson =
    STRUCTURED_LESSONS.find((l) => !progress.completedLessonIds.includes(l.id)) ||
    STRUCTURED_LESSONS[0];

  // Daily target calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayHistory = progress.dailyHistory.find((h) => h.date === todayStr);
  const itemsDoneToday = todayHistory ? todayHistory.itemsCompleted : 0;
  const target = preferences.dailyTarget || 10;
  const targetPercent = Math.min(100, Math.round((itemsDoneToday / target) * 100));

  const startLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveSection('lessons');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          {/* Header pill badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" />
              <span>Interactive Kannada Learning</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-orange-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>English & Hindi Learners</span>
            </div>
          </div>

          {/* Title Row with NAMMA KANNADA AI */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans text-white drop-shadow-sm">
              NAMMA <span className="text-amber-400">KANNADA</span> AI
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
              {isHindi
                ? 'हिंदी और अंग्रेज़ी भाषियों के लिए संवादात्मक, व्यावहारिक और चरणबद्ध कन्नड़ शिक्षण मंच। स्वर, दैनिक बोलचाल, ऑटो यात्रा, दर्शनी नाश्ता, बाज़ार और आदरसूचक वाक्यों को व्यावहारिक रूप से सीखें।'
                : 'Interactive, structured Kannada learning built specifically for English and Hindi speakers. Master script, practical conversations, auto rides, restaurant orders, and everyday grammar with zero guesswork.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => startLesson(nextLesson.id)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play size={17} className="fill-slate-950" />
              <span>
                {isHindi
                  ? `पाठ जारी रखें (${nextLesson.order}/10): ${nextLesson.title}`
                  : `Resume Lesson ${nextLesson.order}: ${nextLesson.title}`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('flashcards')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 shadow-md backdrop-blur-sm transition-all hover:scale-[1.02]"
            >
              <Layers size={17} className="text-amber-300" />
              <span>{isHindi ? 'प्रोग्रेसिव रिव्यू लूप' : 'Progressive Review Deck'}</span>
              {reviewDeckIds.length > 0 && (
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow-xs">
                  {reviewDeckIds.length} due
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progressive Learning Loop Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-sm">
              <RotateCcw size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {isHindi ? 'प्रोग्रेसिव लर्निंग लूप' : 'Progressive Learning Loop'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                  Innovation
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'सीखें → समझें → अभ्यास करें → स्मरण करें → पुनरावृत्ति'
                  : 'Learn → Understand → Practise → Recall → Review'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveSection('flashcards')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all self-start sm:self-auto hover:scale-[1.02]"
          >
            <span>{isHindi ? 'लूप अभ्यास शुरू करें' : 'Launch Practice Loop'}</span>
            <ArrowRight size={14} className="text-amber-700" />
          </button>
        </div>

        {/* 5-Step Visualizer Journey */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50/90 to-amber-100/40 border border-amber-200 text-center space-y-1 shadow-2xs hover:border-amber-400 transition-all">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
              Step 1
            </span>
            <div className="font-extrabold text-slate-900 text-sm">Learn</div>
            <div className="text-[11px] text-slate-600 font-medium">
              {isHindi ? 'कन्नड़ लिपि व अर्थ' : 'Script & Meanings'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50/90 to-amber-100/40 border border-amber-200 text-center space-y-1 shadow-2xs hover:border-amber-400 transition-all">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
              Step 2
            </span>
            <div className="font-extrabold text-slate-900 text-sm">Understand</div>
            <div className="text-[11px] text-slate-600 font-medium">
              {isHindi ? 'व्याकरण व संदर्भ' : 'Grammar & Usage'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50/90 to-amber-100/40 border border-amber-200 text-center space-y-1 shadow-2xs hover:border-amber-400 transition-all">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
              Step 3
            </span>
            <div className="font-extrabold text-slate-900 text-sm">Practise</div>
            <div className="text-[11px] text-slate-600 font-medium">
              {isHindi ? 'संकेत सहित प्रश्न' : 'MCQs with Hints'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50/90 to-amber-100/40 border border-amber-200 text-center space-y-1 shadow-2xs hover:border-amber-400 transition-all">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
              Step 4
            </span>
            <div className="font-extrabold text-slate-900 text-sm">Recall</div>
            <div className="text-[11px] text-slate-600 font-medium">
              {isHindi ? 'बिना संकेत स्मरण' : 'Zero-Hint Recall'}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-gradient-to-b from-amber-100 to-orange-100/70 border-2 border-amber-400 text-center space-y-1 shadow-sm">
            <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
              Step 5
            </span>
            <div className="font-extrabold text-slate-950 text-sm">Review</div>
            <div className="text-[11px] text-amber-950 font-bold">
              {isHindi ? 'अन्तराल पुनरावृत्ति' : 'Spaced Repetition'}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Daily Target Progress */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{isHindi ? 'दैनिक लक्ष्य' : 'Daily Goal'}</span>
            <span className="font-bold text-amber-800">{targetPercent}%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {itemsDoneToday} <span className="text-xs text-slate-400 font-normal">/ {target} items</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${targetPercent}%` }}
            />
          </div>
        </div>

        {/* Learning Streak */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{isHindi ? 'लर्निंग स्ट्रीक' : 'Streak'}</span>
            <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {progress.streak} <span className="text-xs text-slate-400 font-normal">{isHindi ? 'दिन' : 'days active'}</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {isHindi ? 'निरंतरता ही सफलता की कुंजी है' : 'Daily consistency builds fluency'}
          </p>
        </div>

        {/* Mastered Vocabulary */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{isHindi ? 'कंठस्थ शब्द' : 'Mastered Words'}</span>
            <CheckCircle size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {progress.masteredVocabIds.length}{' '}
            <span className="text-xs text-slate-400 font-normal">
              / {VOCABULARY_ITEMS.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {isHindi ? 'स्मरण दर: 3+ सही' : 'Recall confidence: High'}
          </p>
        </div>

        {/* Due For Review */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{isHindi ? 'पुनरावृत्ति बाकी' : 'Due for Review'}</span>
            <RotateCcw size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {reviewDeckIds.length}{' '}
            <span className="text-xs text-slate-400 font-normal">items</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('flashcards')}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 hover:underline inline-flex items-center gap-1"
          >
            <span>{reviewDeckIds.length > 0 ? (isHindi ? 'अभी दोहराएँ →' : 'Review queue →') : (isHindi ? 'सब अद्यतन है ✓' : 'Deck is up to date ✓')}</span>
          </button>
        </div>
      </div>

      {/* Next Recommended Step Card */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-100/50 border-2 border-amber-300/80 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-800 rounded-lg">
              <BookOpen size={15} />
            </div>
            <span>
              {isHindi ? 'अनुशंसित अगला कदम' : 'Recommended Next Action'} · Lesson {nextLesson.order}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {nextLesson.title}{' '}
            <span className="font-kannada text-amber-900 font-bold text-lg sm:text-xl">
              ({nextLesson.titleKannada})
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isHindi ? nextLesson.descriptionHi : nextLesson.descriptionEn}
          </p>
        </div>

        <button
          type="button"
          onClick={() => startLesson(nextLesson.id)}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-sm rounded-2xl shadow-lg transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{isHindi ? 'पाठ शुरू करें' : 'Start Lesson Now'}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Curriculum Modules Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {isHindi ? 'पाठ्यक्रम मॉड्यूल' : 'Structured Curriculum Course'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHindi
                ? '10 संरचित पाठ: स्वर से लेकर व्यावहारिक संवाद तक'
                : '10 Structured Beginner Lessons: From vowels to practical dialogues'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('lessons')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline inline-flex items-center gap-1"
          >
            <span>{isHindi ? 'सभी 10 पाठ देखें →' : 'View all 10 lessons →'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STRUCTURED_LESSONS.slice(0, 6).map((lesson) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => startLesson(lesson.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer group hover:shadow-lg relative flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-slate-200/90 hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                      Module {lesson.order}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle size={12} />
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Start →
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-800 transition-colors">
                    {lesson.title}
                  </h3>
                  <div className="font-kannada text-sm text-amber-900 font-bold my-1">
                    {lesson.titleKannada}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {isHindi ? lesson.descriptionHi : lesson.descriptionEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{lesson.vocabularyIds.length} Core Items</span>
                  <span>{lesson.grammarNotes.length} Grammar Rules</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kannada Vowels Quick Reference Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-kannada font-black text-2xl text-amber-700">ಸ್ವರಗಳು</span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {isHindi ? 'कन्नड़ स्वर त्वरित पट्टी' : 'Kannada Vowels Quick Guide'}
              </div>
              <div className="text-xs text-slate-500">14 Core Vowels with phonetic guide</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => startLesson('lesson_1_vowels')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline"
          >
            {isHindi ? 'स्वर पाठ खोलें →' : 'Open Vowels Lesson →'}
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1">
          {KANNADA_VOWELS.map((v) => (
            <div
              key={v.id}
              className="p-3.5 rounded-2xl border-2 border-slate-200/90 bg-gradient-to-b from-slate-50 to-amber-50/30 hover:bg-amber-50 hover:border-amber-400 hover:shadow-md transition-all flex flex-col items-center min-w-[80px] shrink-0 text-center space-y-1"
            >
              <span className="font-kannada text-3xl font-extrabold text-slate-950">{v.char}</span>
              <span className="text-xs font-mono font-bold text-amber-800">/{v.transliteration}/</span>
              <span className="text-[11px] text-slate-500 font-medium">
                {isHindi ? v.hindiChar : v.englishSound.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
