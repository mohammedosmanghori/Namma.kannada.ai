import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { EDUCATIONAL_DIALOGUES } from '../../data/curriculum';
import { Dialogue, DialogueLine } from '../../types';
import {
  MessageSquareQuote,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DialoguesSection: React.FC = () => {
  const {
    preferences,
    progress,
    selectedDialogueId,
    setSelectedDialogueId,
    toggleBookmarkDialogue,
    recordItemPractice,
  } = useLearning();

  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [showAllLines, setShowAllLines] = useState(false);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'quiz'>('dialogue');

  // Comprehension quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  const isHindi = preferences.explanationLanguage === 'hi';

  const currentDialogue: Dialogue =
    EDUCATIONAL_DIALOGUES.find((d) => d.id === selectedDialogueId) ||
    EDUCATIONAL_DIALOGUES[0];

  const isBookmarked = progress.bookmarkedDialogueIds.includes(currentDialogue.id);

  // If viewing list of all dialogues
  if (!selectedDialogueId) {
    return (
      <div className="space-y-6 animate-fade-in pb-16">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isHindi ? 'ಕನ್ನಡ ಸಂಭಾಷಣೆ — व्यावहारिक संवाद' : 'Guided Educational Dialogues'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'बेंगलुरु के वास्तविक परिवेश में बातचीत: ऑटो यात्रा, दर्शनी नाश्ता, सब्ज़ी बाज़ार और पड़ोसियों से संवाद।'
              : 'Interactive real-world scenarios: Hailing autos, ordering at Darshinis, vegetable markets, and friendly neighbors.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EDUCATIONAL_DIALOGUES.map((dlg) => {
            const isSaved = progress.bookmarkedDialogueIds.includes(dlg.id);

            return (
              <div
                key={dlg.id}
                onClick={() => {
                  setSelectedDialogueId(dlg.id);
                  setActiveLineIndex(0);
                  setShowAllLines(false);
                  setActiveTab('dialogue');
                  setQuizAnswers({});
                  setQuizSubmitted({});
                }}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 capitalize">
                      {dlg.category}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">{dlg.level}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {dlg.title}
                  </h3>
                  <div className="font-kannada text-xs font-semibold text-amber-900">
                    {dlg.titleKannada}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {isHindi ? dlg.situationHindi : dlg.situation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{dlg.lines.length} Speaking Turns</span>
                  <span className="text-amber-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Practise <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Dialogue Turn-by-Turn Experience
  const currentLine = currentDialogue.lines[activeLineIndex];
  const canGoNext = activeLineIndex < currentDialogue.lines.length - 1;
  const canGoPrev = activeLineIndex > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSelectedDialogueId(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? 'सभी संवाद' : 'All Dialogues'}</span>
        </button>

        <div className="text-center truncate px-2">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Guided Dialogue
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {currentDialogue.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => toggleBookmarkDialogue(currentDialogue.id)}
          className={`p-2 rounded-xl transition-colors ${
            isBookmarked
              ? 'text-amber-600 bg-amber-50'
              : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark this dialogue'}
        >
          {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Situation Context Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1">
        <div className="font-bold text-amber-950 flex items-center gap-1.5">
          <Info size={16} className="text-amber-600" />
          <span>{isHindi ? 'परिस्थिति संदर्भ:' : 'Context Situation:'}</span>
        </div>
        <p className="text-slate-700 leading-relaxed">
          {isHindi ? currentDialogue.situationHindi : currentDialogue.situation}
        </p>
      </div>

      {/* View Mode Toggle: Interactive Step-by-Step vs Full Script */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dialogue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dialogue'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {isHindi ? 'संवाद प्रस्तुति' : 'Interactive Dialogue'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {isHindi ? 'समझ क्विज़' : 'Comprehension Quiz'}
          </button>
        </div>

        {activeTab === 'dialogue' && (
          <button
            type="button"
            onClick={() => setShowAllLines(!showAllLines)}
            className="text-xs font-bold text-amber-700 hover:underline"
          >
            {showAllLines
              ? (isHindi ? 'चरणबद्ध देखें' : 'Step-by-step mode')
              : (isHindi ? 'सभी संवाद दिखाएँ' : 'Show full conversation')}
          </button>
        )}
      </div>

      {/* Dialogue Mode */}
      {activeTab === 'dialogue' && (
        <div className="space-y-4">
          {!showAllLines ? (
            /* Step-by-Step Interactive Turn Card */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-md space-y-6">
              {/* Speaker Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black flex items-center justify-center text-base shadow-sm">
                    {currentLine.speaker.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-base sm:text-lg">
                      {currentLine.speaker}
                    </h4>
                    <span className="text-xs text-amber-900 font-bold bg-amber-100/70 px-2 py-0.5 rounded-md">
                      {currentLine.speakerRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {activeLineIndex + 1} of {currentDialogue.lines.length}
                  </span>
                </div>
              </div>

              {/* Spoken Text Bubble */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-amber-50/60 border border-amber-200 space-y-3 shadow-2xs">
                <div className="font-kannada text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-relaxed tracking-wide">
                  {currentLine.kannada}
                </div>
                <div>
                  <span className="inline-block font-mono text-xs sm:text-sm font-bold text-amber-900 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-300/80 shadow-2xs">
                    /{currentLine.transliteration}/
                  </span>
                </div>
                <div className="text-sm sm:text-base text-slate-900 font-bold pt-1">
                  {isHindi ? currentLine.hindi : currentLine.english}
                </div>
                {isHindi && (
                  <div className="text-xs text-slate-500 font-medium">
                    <span className="font-semibold text-slate-600">English:</span> {currentLine.english}
                  </div>
                )}
              </div>

              {/* Grammatical Breakdown Chips */}
              {currentLine.breakdown && currentLine.breakdown.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    {isHindi ? 'वाक्य पद-विच्छेद (Word Breakdown):' : 'Key Phrase Breakdown:'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentLine.breakdown.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-kannada font-bold text-slate-950 text-sm">{b.word}</span>
                          <span className="font-mono text-[11px] text-amber-900 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                            /{b.transliteration}/
                          </span>
                        </div>
                        <div className="text-slate-600 text-xs font-medium">
                          {isHindi ? b.meaningHi : b.meaningEn}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural Context Note if present */}
              {currentLine.culturalNote && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100/70 to-orange-100/50 border border-amber-300 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                  <Sparkles size={18} className="text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-extrabold text-amber-950">Cultural Etiquette: </span>
                    {isHindi ? currentLine.culturalNote.hi : currentLine.culturalNote.en}
                  </div>
                </div>
              )}

              {/* Turn Stepper Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveLineIndex((prev) => Math.max(0, prev - 1))}
                  disabled={!canGoPrev}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  ← Previous Line
                </button>

                <div className="flex gap-1.5">
                  {currentDialogue.lines.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveLineIndex(dotIdx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeLineIndex === dotIdx ? 'bg-amber-600 w-6' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (canGoNext) {
                      setActiveLineIndex((prev) => prev + 1);
                    } else {
                      setActiveTab('quiz');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>{canGoNext ? (isHindi ? 'अगली पंक्ति' : 'Next Line') : (isHindi ? 'क्विज़ पर जाएँ' : 'Take Quiz')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Full Conversation Scroll Mode */
            <div className="space-y-3">
              {currentDialogue.lines.map((line, idx) => {
                const isFirstSpeaker = idx % 2 === 0;
                return (
                  <div
                    key={line.id}
                    className={`p-5 rounded-3xl border-2 space-y-2.5 transition-colors shadow-2xs ${
                      isFirstSpeaker
                        ? 'bg-white border-amber-200/90'
                        : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-amber-950 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {line.speaker} ({line.speakerRole})
                      </span>
                    </div>
                    <div className="font-kannada text-xl sm:text-2xl font-bold text-slate-950">{line.kannada}</div>
                    <div className="inline-block font-mono text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                      /{line.transliteration}/
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 font-medium">
                      {isHindi ? line.hindi : line.english}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Comprehension Quiz Mode */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'संवाद समझ जाँच (Comprehension Check)' : 'Dialogue Comprehension Check'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'जाँचिए कि आपने संवाद के मुख्य भाव और शब्दों को कितना समझा।'
                : 'Verify how well you understood the key vocabulary and cultural context of this conversation.'}
            </p>
          </div>

          <div className="space-y-4">
            {currentDialogue.comprehensionQuiz.map((q, qIdx) => {
              const selected = quizAnswers[qIdx];
              const isSubmitted = quizSubmitted[qIdx];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Question {qIdx + 1} of {currentDialogue.comprehensionQuiz.length}</span>
                    {isSubmitted && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {isHindi ? q.questionHi : q.questionEn}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50';
                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
                        } else if (selected === optIdx) {
                          btnStyle = 'bg-red-500 text-white font-bold border-red-600';
                        } else {
                          btnStyle = 'bg-slate-50 text-slate-400 opacity-60';
                        }
                      } else if (selected === optIdx) {
                        btnStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            if (!isSubmitted) {
                              setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                            }
                          }}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optIdx === q.correctIndex && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>

                  {!isSubmitted ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (selected !== undefined) {
                          setQuizSubmitted((prev) => ({ ...prev, [qIdx]: true }));
                          recordItemPractice(`dlg_${currentDialogue.id}_${qIdx}`, selected === q.correctIndex);
                        }
                      }}
                      disabled={selected === undefined}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-300 font-bold text-xs rounded-xl"
                    >
                      {isHindi ? 'जाँचिए' : 'Check'}
                    </button>
                  ) : (
                    <div
                      className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-50 text-amber-950 border border-amber-200'
                      }`}
                    >
                      <span className="font-bold">{isCorrect ? 'Excellent! ' : 'Note: '}</span>
                      {isHindi ? q.feedbackHi : q.feedbackEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('dialogue')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              ← Back to Dialogue
            </button>
            <button
              type="button"
              onClick={() => setSelectedDialogueId(null)}
              className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md"
            >
              {isHindi ? 'सभी संवाद सूची' : 'Back to Dialogue Catalog'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
