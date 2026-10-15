import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { QUIZ_BANK, VOCABULARY_ITEMS, KANNADA_VOWELS } from '../../data/curriculum';
import { QuizQuestion } from '../../types';
import {
  HelpCircle,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Award,
  Check,
  X,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const QuizSection: React.FC = () => {
  const { preferences, progress, recordItemPractice, setActiveSection } = useLearning();

  const [activeCategory, setActiveCategory] = useState<'all' | 'script' | 'phrases' | 'missed'>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const isHindi = preferences.explanationLanguage === 'hi';

  // Filter questions based on category
  const activeQuestions: QuizQuestion[] = React.useMemo(() => {
    if (activeCategory === 'script') {
      return QUIZ_BANK.filter((q) => q.type === 'script-match' || q.lessonId === 'lesson_1_vowels');
    }
    if (activeCategory === 'phrases') {
      return QUIZ_BANK.filter((q) => q.lessonId !== 'lesson_1_vowels');
    }
    if (activeCategory === 'missed') {
      // Find questions matching missed vocab
      const missedVocabIds = Object.keys(progress.itemStats).filter(
        (id) => progress.itemStats[id]?.isMissed
      );
      const matched = QUIZ_BANK.filter(
        (q) => (q.relatedVocabId && missedVocabIds.includes(q.relatedVocabId)) || missedVocabIds.includes(q.id)
      );
      return matched.length > 0 ? matched : QUIZ_BANK.slice(0, 5);
    }
    return QUIZ_BANK;
  }, [activeCategory, progress.itemStats]);

  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Persist practice in context (records attempts, misses, schedules spaced review)
    recordItemPractice(currentQ.relatedVocabId || currentQ.id, isCorrect);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = (category: typeof activeCategory = activeCategory) => {
    setActiveCategory(category);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-3xl mx-auto">
      {/* Section Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isHindi ? 'ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ — संवादात्मक क्विज़' : 'Interactive Kannada Quizzes'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHindi
            ? 'अपनी समझ की परीक्षा लें। गलत उत्तर स्वतः आगामी रिवीजन में शामिल किए जाते हैं।'
            : 'Test your script recognition, vocabulary meanings, and practical sentence construction.'}
        </p>
      </div>

      {/* Quiz Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', labelEn: 'All Questions', labelHi: 'सभी प्रश्न' },
          { id: 'script', labelEn: 'Script & Vowels', labelHi: 'स्वर व लिपि' },
          { id: 'phrases', labelEn: 'Practical Phrases', labelHi: 'व्यावहारिक वाक्य' },
          { id: 'missed', labelEn: 'Missed Items Drill', labelHi: 'गलत उत्तर अभ्यास' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleRestart(tab.id as typeof activeCategory)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeCategory === tab.id
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isHindi ? tab.labelHi : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Finished Summary Screen */}
      {quizFinished ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Award size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {isHindi ? 'क्विज़ परिणाम' : 'Quiz Completed'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {score} / {activeQuestions.length}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              {score === activeQuestions.length
                ? (isHindi ? 'शानदार! आपने शत-प्रतिशत सही उत्तर दिए।' : 'Flawless score! You have mastered these curriculum items.')
                : (isHindi ? 'बहुत अच्छा प्रयास! छूटे हुए या गलत प्रश्नों को स्वचालित रूप से रिवीजन डेक में जोड़ दिया गया है।' : 'Great effort! Missed items have been automatically scheduled for spaced recall.')}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleRestart()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <RotateCcw size={16} />
              <span>{isHindi ? 'फिर से खेलें' : 'Retry This Quiz'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('flashcards')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-sm rounded-xl transition-all"
            >
              {isHindi ? 'रिवीजन डेक पर जाएँ' : 'Go to Revision Deck'}
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          {/* Progress Top Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
              <span className="text-amber-800">
                Score: {score}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Prompt Box */}
          {currentQ.kannadaPrompt && (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-kannada text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {currentQ.kannadaPrompt}
                </span>
                {currentQ.transliterationPrompt && (
                  <span className="font-mono text-sm font-semibold text-amber-800">
                    /{currentQ.transliterationPrompt}/
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {isHindi ? currentQ.questionHi : currentQ.questionEn}
          </h3>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
              let optStyle = 'bg-slate-50/80 border-2 border-slate-200 text-slate-900 hover:border-amber-400 hover:bg-amber-50/50';

              if (isSubmitted) {
                if (optIdx === currentQ.correctIndex) {
                  optStyle = 'bg-emerald-600 text-white font-extrabold border-2 border-emerald-700 shadow-md';
                } else if (selectedOption === optIdx) {
                  optStyle = 'bg-red-500 text-white font-extrabold border-2 border-red-600 shadow-md';
                } else {
                  optStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                }
              } else if (selectedOption === optIdx) {
                optStyle = 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-extrabold shadow-xs';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between text-xs sm:text-sm ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                        isSubmitted && optIdx === currentQ.correctIndex
                          ? 'bg-white text-emerald-700'
                          : isSubmitted && selectedOption === optIdx
                          ? 'bg-white text-red-600'
                          : selectedOption === optIdx
                          ? 'bg-amber-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <span className="font-medium leading-relaxed">{optionText}</span>
                  </div>
                  {isSubmitted && optIdx === currentQ.correctIndex && <Check size={20} className="shrink-0" />}
                  {isSubmitted && selectedOption === optIdx && optIdx !== currentQ.correctIndex && (
                    <X size={20} className="shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Action Row */}
          {!isSubmitted ? (
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-amber-300 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{isHindi ? 'उत्तर सबमिट करें' : 'Submit Answer'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-3">
              <div
                className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50 text-emerald-950 border-2 border-emerald-300'
                    : 'bg-amber-50 text-amber-950 border-2 border-amber-300'
                }`}
              >
                <div className="font-extrabold mb-1.5 flex items-center gap-2 text-sm">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <CheckCircle size={18} className="text-emerald-600" />
                      <span>{isHindi ? 'बिल्कुल सही! उत्तम।' : 'Correct! Outstanding work.'}</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw size={18} className="text-amber-700" />
                      <span>{isHindi ? 'व्याकरण स्पष्टीकरण:' : 'Linguistic Grammar Note:'}</span>
                    </>
                  )}
                </div>
                <div className="font-medium text-slate-800">{isHindi ? currentQ.explanationHi : currentQ.explanationEn}</div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>
                    {currentQuestionIndex < activeQuestions.length - 1
                      ? (isHindi ? 'अगला प्रश्न' : 'Next Question')
                      : (isHindi ? 'परिणाम देखें' : 'View Results')}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
