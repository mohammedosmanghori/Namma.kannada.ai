import React, { useState, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { VOCABULARY_ITEMS, KANNADA_VOWELS } from '../../data/curriculum';
import { VocabularyItem } from '../../types';
import {
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { KannadaText } from '../common/KannadaText';

export const FlashcardsSection: React.FC = () => {
  const {
    preferences,
    progress,
    recordItemPractice,
    toggleBookmarkItem,
    getReviewDeckItemIds,
  } = useLearning();

  const [activeDeckMode, setActiveDeckMode] = useState<'due' | 'all' | 'missed'>('due');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loopStep, setLoopStep] = useState<'learn' | 'understand' | 'practise' | 'recall' | 'review'>('learn');
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [hintLevel, setHintLevel] = useState<'full' | 'partial' | 'none'>('full');

  const isHindi = preferences.explanationLanguage === 'hi';
  const dueIds = getReviewDeckItemIds();

  // Active Deck Items
  const activeDeck: VocabularyItem[] = useMemo(() => {
    if (activeDeckMode === 'due') {
      const filtered = VOCABULARY_ITEMS.filter((item) => dueIds.includes(item.id));
      return filtered.length > 0 ? filtered : VOCABULARY_ITEMS.slice(0, 8);
    }
    if (activeDeckMode === 'missed') {
      const missed = VOCABULARY_ITEMS.filter((item) => progress.itemStats[item.id]?.isMissed);
      return missed.length > 0 ? missed : VOCABULARY_ITEMS.slice(0, 5);
    }
    return VOCABULARY_ITEMS;
  }, [activeDeckMode, dueIds, progress.itemStats]);

  const currentItem: VocabularyItem = activeDeck[currentIndex] || activeDeck[0] || VOCABULARY_ITEMS[0];
  const itemStat = progress.itemStats[currentItem?.id];
  const isBookmarked = progress.bookmarkedItemIds.includes(currentItem?.id);

  const handleNextCard = () => {
    setIsFlipped(false);
    setLoopStep('learn');
    setPracticeAnswer(null);
    setPracticeChecked(false);
    if (currentIndex < activeDeck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setLoopStep('learn');
    setPracticeAnswer(null);
    setPracticeChecked(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(activeDeck.length - 1);
    }
  };

  const handleRecallRating = (rating: 'needs_practice' | 'good' | 'mastered') => {
    const isCorrect = rating !== 'needs_practice';
    recordItemPractice(currentItem.id, isCorrect, rating);
    handleNextCard();
  };

  const handlePracticeSubmit = () => {
    if (practiceAnswer === null || practiceChecked) return;
    setPracticeChecked(true);
    const isCorrect = practiceAnswer === currentItem.practiceQuestion.correctIndex;
    recordItemPractice(currentItem.id, isCorrect);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isHindi ? 'ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ — फ्लैशकार्ड और पुनरावृत्ति' : 'Flashcards & Spaced Recall'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHindi
            ? 'प्रोग्रेसिव लर्निंग लूप: सीखें → समझें → अभ्यास → स्मरण → पुनरावृत्ति'
            : 'Progressive Learning Loop: Learn → Understand → Practise → Recall → Review'}
        </p>
      </div>

      {/* Deck Selector Tabs */}
      <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveDeckMode('due');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeDeckMode === 'due'
              ? 'bg-amber-500 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCcw size={14} />
          <span>{isHindi ? 'पुनरावृत्ति बाकी' : 'Due for Review'}</span>
          {dueIds.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeDeckMode === 'due' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-900'
              }`}
            >
              {dueIds.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveDeckMode('all');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeDeckMode === 'all'
              ? 'bg-amber-500 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isHindi ? 'सभी कार्ड' : 'All Flashcards'} ({VOCABULARY_ITEMS.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveDeckMode('missed');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeDeckMode === 'missed'
              ? 'bg-amber-500 text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isHindi ? 'गलत उत्तर' : 'Needs Practice'}
        </button>
      </div>

      {/* Progressive Learning Loop Step Stepper */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1 px-1">
          <span>Loop Mode:</span>
          <span className="text-amber-800 capitalize">{loopStep}</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-[11px] font-semibold text-center">
          {[
            { id: 'learn', label: '1. Learn' },
            { id: 'understand', label: '2. Understand' },
            { id: 'practise', label: '3. Practise' },
            { id: 'recall', label: '4. Recall' },
            { id: 'review', label: '5. Review' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setLoopStep(st.id as typeof loopStep);
                if (st.id === 'recall') {
                  setIsFlipped(false);
                  setHintLevel('none'); // progressively hide hints
                } else if (st.id === 'learn') {
                  setHintLevel('full');
                }
              }}
              className={`py-1.5 rounded-lg transition-all ${
                loopStep === st.id
                  ? 'bg-amber-500 text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="space-y-4">
        {/* Card Header Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Card {currentIndex + 1} of {activeDeck.length} ·{' '}
            <span className="capitalize">{currentItem.category}</span>
          </span>
          <div className="flex items-center gap-2">
            {/* Hint level toggles */}
            <span className="text-slate-400">Hints:</span>
            {(['full', 'none'] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHintLevel(h)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  hintLevel === h ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {h === 'full' ? 'Visible' : 'Hidden'}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 1 & 4 & 5: Interactive Flip Card */}
        {loopStep !== 'practise' && (
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[300px] p-7 sm:p-9 rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-lg flex flex-col justify-between relative group select-none hover:scale-[1.01] ${
              isFlipped
                ? 'bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/50 border-amber-400 shadow-amber-500/10'
                : 'bg-white border-slate-200/90 hover:border-amber-400'
            }`}
          >
            {/* Top row with level tag & bookmark */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 capitalize border border-slate-200/60">
                {currentItem.level} · {currentItem.category}
              </span>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => toggleBookmarkItem(currentItem.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    isBookmarked ? 'text-amber-600 bg-amber-100/70' : 'text-slate-400 hover:text-slate-600 bg-slate-50'
                  }`}
                >
                  {isBookmarked ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
                </button>
              </div>
            </div>

            {/* Center Content: Kannada Script on front, translations on back */}
            {!isFlipped ? (
              <div className="text-center space-y-4 py-8">
                <div className="font-kannada text-4xl sm:text-6xl font-black text-slate-950 tracking-wide leading-tight drop-shadow-2xs">
                  {currentItem.kannada}
                </div>

                {hintLevel === 'full' ? (
                  <div className="inline-block font-mono text-sm sm:text-base text-amber-900 font-extrabold bg-amber-100/70 border border-amber-300/70 px-3 py-1 rounded-xl shadow-2xs">
                    /{currentItem.transliteration}/
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    (Zero hints mode active - recall the sound)
                  </div>
                )}

                <div className="text-xs font-semibold text-slate-400 group-hover:text-amber-700 transition-colors pt-2 flex items-center justify-center gap-1.5">
                  <RotateCcw size={13} className="text-amber-600 animate-spin-slow" />
                  <span>{isHindi ? 'अर्थ देखने के लिए कार्ड पर टैप करें' : 'Tap card to flip & reveal meaning'}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-3 animate-fade-in">
                <div className="text-center space-y-1.5">
                  <div className="font-kannada text-3xl font-extrabold text-slate-950">
                    {currentItem.kannada}
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded-lg inline-block">
                    /{currentItem.transliteration}/
                  </div>
                </div>

                {/* Meanings */}
                <div className="p-4 bg-white/90 rounded-2xl border-2 border-amber-300/70 text-center space-y-1 shadow-sm">
                  <div className="text-lg font-black text-slate-950">
                    {isHindi ? currentItem.hindi : currentItem.english}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {isHindi ? `English: ${currentItem.english}` : `हिन्दी: ${currentItem.hindi}`}
                  </div>
                </div>

                {/* Usage note */}
                <div className="text-xs text-slate-800 bg-amber-100/60 p-3 rounded-2xl border border-amber-200/80 leading-relaxed font-medium">
                  <span className="font-extrabold text-amber-950">
                    {isHindi ? '💡 प्रयोग निर्देश: ' : '💡 Grammar & Usage: '}
                  </span>
                  {isHindi ? currentItem.explanation.hi : currentItem.explanation.en}
                </div>
              </div>
            )}

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
              <span className="font-medium">{isFlipped ? (isHindi ? 'अर्थ प्रकट हुआ' : 'Answer Revealed') : (isHindi ? 'फ्रंट साइड (कन्नड़)' : 'Front Side (Kannada)')}</span>
              {itemStat && (
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {itemStat.correct}✓ / {itemStat.attempts} attempts
                </span>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Multiple-choice Exercise Practice */}
        {loopStep === 'practise' && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Step 3 · Practice Exercise
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {isHindi
                ? currentItem.practiceQuestion.questionHi
                : currentItem.practiceQuestion.questionEn}
            </h3>

            <div className="space-y-2">
              {currentItem.practiceQuestion.options.map((opt, optIdx) => {
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50';
                if (practiceChecked) {
                  if (optIdx === currentItem.practiceQuestion.correctIndex) {
                    btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
                  } else if (practiceAnswer === optIdx) {
                    btnStyle = 'bg-red-500 text-white font-bold border-red-600';
                  } else {
                    btnStyle = 'bg-slate-50 text-slate-400 opacity-60';
                  }
                } else if (practiceAnswer === optIdx) {
                  btnStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => {
                      if (!practiceChecked) setPracticeAnswer(optIdx);
                    }}
                    disabled={practiceChecked}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {practiceChecked && optIdx === currentItem.practiceQuestion.correctIndex && (
                      <Check size={16} />
                    )}
                  </button>
                );
              })}
            </div>

            {!practiceChecked ? (
              <button
                type="button"
                onClick={handlePracticeSubmit}
                disabled={practiceAnswer === null}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-300 font-bold text-xs rounded-xl"
              >
                {isHindi ? 'जाँचिए' : 'Check Exercise'}
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 leading-relaxed">
                  <span className="font-bold">
                    {practiceAnswer === currentItem.practiceQuestion.correctIndex
                      ? '✓ Great! '
                      : '✗ Note: '}
                  </span>
                  {isHindi
                    ? currentItem.practiceQuestion.explanationHi
                    : currentItem.practiceQuestion.explanationEn}
                </div>
                <button
                  type="button"
                  onClick={() => setLoopStep('recall')}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  {isHindi ? 'अगला: स्मरण जाँच (Recall)' : 'Next: Recall Test →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Spaced Repetition Recall Ratings Bar */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-lg space-y-3">
          <div className="text-center">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              {isHindi ? 'स्मरण दर दर्ज करें (Rate Your Recall)' : 'Rate Your Recall Confidence'}
            </span>
            <p className="text-[11px] text-slate-400">
              {isHindi
                ? 'कमज़ोर शब्द पहले पुनरावृत्ति के लिए शेड्यूल होंगे'
                : 'Missed items are automatically scheduled for early spaced revision'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRecallRating('needs_practice')}
              className="p-3 rounded-2xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-200 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span>🔴 Needs Practice</span>
              <span className="text-[10px] text-red-400 font-normal">Review Tomorrow</span>
            </button>

            <button
              type="button"
              onClick={() => handleRecallRating('good')}
              className="p-3 rounded-2xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/80 text-amber-200 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span>🟡 Good</span>
              <span className="text-[10px] text-amber-400 font-normal">+2-3 Days</span>
            </button>

            <button
              type="button"
              onClick={() => handleRecallRating('mastered')}
              className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-200 text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span>🟢 Mastered</span>
              <span className="text-[10px] text-emerald-400 font-normal">+5-7 Days</span>
            </button>
          </div>
        </div>

        {/* Card Navigation Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePrevCard}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft size={15} />
            <span>{isHindi ? 'पिछला' : 'Previous'}</span>
          </button>

          <span className="text-xs text-slate-400">
            {currentIndex + 1} / {activeDeck.length}
          </span>

          <button
            type="button"
            onClick={handleNextCard}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          >
            <span>{isHindi ? 'अगला कार्ड' : 'Next Card'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
