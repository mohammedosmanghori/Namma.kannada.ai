import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  STRUCTURED_LESSONS,
  VOCABULARY_ITEMS,
  KANNADA_VOWELS,
  QUIZ_BANK,
  EDUCATIONAL_DIALOGUES,
} from '../../data/curriculum';
import { Lesson, QuizQuestion } from '../../types';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Check,
  RotateCcw,
  Bookmark,
  MessageSquare,
  Award,
} from 'lucide-react';
import { KannadaText } from '../common/KannadaText';
import { CurriculumTutorModal } from '../common/CurriculumTutorModal';

export const LessonsSection: React.FC = () => {
  const {
    preferences,
    progress,
    selectedLessonId,
    setSelectedLessonId,
    markLessonComplete,
    recordItemPractice,
    setActiveSection,
    setSelectedDialogueId,
  } = useLearning();

  const [activeStep, setActiveStep] = useState<'objectives' | 'vocab' | 'grammar' | 'dialogue' | 'quiz' | 'complete'>('objectives');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | 'beginner' | 'novice' | 'elementary'>('all');
  const [tutorTopic, setTutorTopic] = useState<string>('');
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // Quiz state inside lesson
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const isHindi = preferences.explanationLanguage === 'hi';

  const currentLesson: Lesson =
    STRUCTURED_LESSONS.find((l) => l.id === selectedLessonId) || STRUCTURED_LESSONS[0];

  const filteredLessons = STRUCTURED_LESSONS.filter(
    (l) => selectedLevelFilter === 'all' || l.level === selectedLevelFilter
  );

  const isCurrentLessonComplete = progress.completedLessonIds.includes(currentLesson.id);

  // Vocabulary items linked to this lesson
  const lessonVocab = VOCABULARY_ITEMS.filter((v) =>
    currentLesson.vocabularyIds.includes(v.id)
  );

  // Associated dialogue if any
  const workedDialogue = currentLesson.workedDialogueId
    ? EDUCATIONAL_DIALOGUES.find((d) => d.id === currentLesson.workedDialogueId)
    : null;

  // Mini quiz questions for this lesson
  const lessonQuestions: QuizQuestion[] = QUIZ_BANK.filter(
    (q) => currentLesson.miniQuizIds.includes(q.id) || q.lessonId === currentLesson.id
  );

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted[questionId]) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleVerifyQuestion = (question: QuizQuestion) => {
    const chosenIndex = quizAnswers[question.id];
    if (chosenIndex === undefined) return;

    setQuizSubmitted((prev) => ({ ...prev, [question.id]: true }));
    const isCorrect = chosenIndex === question.correctIndex;

    // Record into learning context (tracks attempts, mistakes, spaced review)
    recordItemPractice(question.relatedVocabId || question.id, isCorrect);
  };

  const handleFinishLesson = () => {
    markLessonComplete(currentLesson.id);
    setActiveStep('complete');
  };

  const goToNextLesson = () => {
    const currentIndex = STRUCTURED_LESSONS.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < STRUCTURED_LESSONS.length - 1) {
      setSelectedLessonId(STRUCTURED_LESSONS[currentIndex + 1].id);
      setActiveStep('objectives');
      setQuizAnswers({});
      setQuizSubmitted({});
    } else {
      setSelectedLessonId(null);
    }
  };

  // If viewing all lessons list
  if (!selectedLessonId) {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isHindi ? 'ಕನ್ನಡ ಪಾಠಗಳು — शुरुआती पाठ' : 'Structured Beginner Lessons'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isHindi
                ? 'कन्नड़ लिपि, आवश्यक शब्दावली, व्याकरण के सूत्र और दैनिक जीवन के संवाद।'
                : 'Kannada vowels, essential vocabulary, sentence patterns, and situational dialogues.'}
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold self-start sm:self-auto">
            {(['all', 'beginner', 'novice', 'elementary'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  selectedLevelFilter === lvl
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonId(lesson.id);
                  setActiveStep('objectives');
                  setQuizAnswers({});
                  setQuizSubmitted({});
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg relative ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300">
                      Module {lesson.order}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                      {lesson.level}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle size={14} />
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Start Lesson <ArrowRight size={13} />
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  {lesson.title}
                </h3>
                <div className="font-kannada text-sm font-semibold text-amber-900 my-1">
                  {lesson.titleKannada}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mt-2">
                  {isHindi ? lesson.descriptionHi : lesson.descriptionEn}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{lesson.vocabularyIds.length} Core Items</span>
                  <span>{lesson.grammarNotes.length} Grammar Rules</span>
                  <span>{lesson.miniQuizIds.length} Practice Questions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Lesson Multi-Step Interactive View
  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Lesson Header Navigation */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setSelectedLessonId(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? 'सभी पाठ' : 'All Lessons'}</span>
        </button>

        <div className="text-center truncate px-2">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Lesson {currentLesson.order} · {currentLesson.category}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {currentLesson.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setTutorTopic(`Explain ${currentLesson.title}`);
            setIsTutorOpen(true);
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold"
        >
          <Sparkles size={14} className="text-amber-600" />
          <span className="hidden sm:inline">Ask Tutor</span>
        </button>
      </div>

      {/* Step Progress Stepper */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-2.5 shadow-xs overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {[
            { id: 'objectives', num: '1', label: isHindi ? 'उद्देश्य' : 'Objectives' },
            { id: 'vocab', num: '2', label: isHindi ? 'शब्दावली' : 'Vocabulary' },
            { id: 'grammar', num: '3', label: isHindi ? 'व्याकरण सूत्र' : 'Grammar Rules' },
            ...(workedDialogue
              ? [{ id: 'dialogue', num: '4', label: isHindi ? 'व्यावहारिक संवाद' : 'Real Dialogue' }]
              : []),
            { id: 'quiz', num: '5', label: isHindi ? 'अभ्यास क्विज़' : 'Practice Quiz' },
          ].map((tab) => {
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id as typeof activeStep)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/60'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.num}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Objectives & Overview */}
      {activeStep === 'objectives' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {currentLesson.category} · {currentLesson.level}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentLesson.title}
            </h2>
            <div className="font-kannada text-xl font-bold text-amber-900">
              {currentLesson.titleKannada}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {isHindi ? currentLesson.descriptionHi : currentLesson.descriptionEn}
            </p>
          </div>

          {/* Objectives Box */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb size={16} className="text-amber-600" />
              <span>{isHindi ? 'इस पाठ के मुख्य उद्देश्य:' : 'Lesson Learning Objectives:'}</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              {(isHindi ? currentLesson.objectivesHi : currentLesson.objectivesEn).map(
                (obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Step Footer Navigation */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setActiveStep('vocab')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <span>{isHindi ? 'शब्दावली देखें' : 'View Vocabulary'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Key Vocabulary & Script */}
      {activeStep === 'vocab' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'पाठ की मुख्य शब्दावली' : 'Key Vocabulary & Script'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'कन्नड़ लिपि, उच्चारण, अंग्रेज़ी व हिंदी अर्थ और प्रयोग'
                  : 'Kannada script, phonetic transliteration, and practical usage'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('grammar')}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>{isHindi ? 'अगला: व्याकरण' : 'Next: Grammar'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Special Vowel Table if Lesson 1 */}
          {currentLesson.id === 'lesson_1_vowels' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KANNADA_VOWELS.map((vowel) => (
                <div
                  key={vowel.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-kannada text-4xl font-extrabold text-slate-900">
                      {vowel.char}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-800">
                    Transliteration: /{vowel.transliteration}/
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold">{isHindi ? 'ध्वनि:' : 'Sound:'} </span>
                    {isHindi ? vowel.hindiSound : vowel.englishSound}
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold">{isHindi ? 'उदाहरण शब्द:' : 'Example:'} </span>
                    <span className="font-kannada font-bold text-slate-900">{vowel.exampleWord}</span>{' '}
                    ({vowel.exampleMeaning})
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Standard Vocabulary Items */}
          {lessonVocab.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessonVocab.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs space-y-3"
                >
                  <KannadaText
                    kannada={item.kannada}
                    transliteration={item.transliteration}
                    english={item.english}
                    hindi={item.hindi}
                    size="lg"
                    showBookmark={true}
                    itemId={item.id}
                    secondaryLanguage={true}
                  />

                  {/* Usage explanation */}
                  <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50 leading-relaxed">
                    <span className="font-bold text-amber-900">
                      {isHindi ? 'प्रयोग निर्देश: ' : 'Usage Note: '}
                    </span>
                    {isHindi ? item.explanation.hi : item.explanation.en}
                  </div>

                  {/* Example sentence */}
                  {item.examples.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[11px] font-bold text-slate-600 uppercase">
                        {isHindi ? 'उदाहरण वाक्य:' : 'Example Sentence:'}
                      </div>
                      <div className="font-kannada text-sm font-semibold text-slate-900">
                        {item.examples[0].kannada}
                      </div>
                      <div className="text-xs font-mono text-amber-800">
                        {item.examples[0].transliteration}
                      </div>
                      <div className="text-xs text-slate-600">
                        {isHindi ? item.examples[0].hindi : item.examples[0].english}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveStep('objectives')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              ← Back to Objectives
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('grammar')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <span>{isHindi ? 'व्याकरण सूत्र समझें' : 'Grammar & Patterns'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Grammar & Patterns */}
      {activeStep === 'grammar' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'व्याकरण और वाक्य संरचना' : 'Grammar Rules & Sentence Formulas'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'नियमबद्ध और सत्यापित भाषा संरचना'
                : 'Verified linguistic patterns and easy-to-remember grammatical rules'}
            </p>
          </div>

          <div className="space-y-4">
            {currentLesson.grammarNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
                  <Lightbulb size={18} className="text-amber-600 shrink-0" />
                  <span>{isHindi ? note.headingHi : note.headingEn}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {isHindi ? note.contentHi : note.contentEn}
                </p>

                {note.formula && (
                  <div className="p-3.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs sm:text-sm font-semibold flex items-center justify-between">
                    <span>📐 Formula: {note.formula}</span>
                  </div>
                )}

                {note.sampleRule && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                    💡 <span className="font-bold">Key Pattern:</span> {note.sampleRule}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveStep('vocab')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              ← Back to Vocabulary
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(workedDialogue ? 'dialogue' : 'quiz')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <span>{workedDialogue ? (isHindi ? 'संवाद देखें' : 'View Dialogue') : (isHindi ? 'अभ्यास क्विज़' : 'Practice Quiz')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Worked Real Dialogue (if present) */}
      {activeStep === 'dialogue' && workedDialogue && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Real Situation
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {workedDialogue.title}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? workedDialogue.situationHindi : workedDialogue.situation}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedDialogueId(workedDialogue.id);
                setActiveSection('dialogues');
              }}
              className="text-xs font-bold text-amber-700 hover:underline shrink-0"
            >
              {isHindi ? 'पूर्ण संवाद खोलें →' : 'Full Dialogue Mode →'}
            </button>
          </div>

          {/* Dialogue Lines Preview */}
          <div className="space-y-3">
            {workedDialogue.lines.slice(0, 4).map((line) => (
              <div
                key={line.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {line.speakerRole}
                  </span>
                </div>
                <div className="font-kannada text-base sm:text-lg font-bold text-slate-900">
                  {line.kannada}
                </div>
                <div className="text-xs font-mono text-amber-800">{line.transliteration}</div>
                <div className="text-xs text-slate-700 font-medium">
                  {isHindi ? line.hindi : line.english}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveStep('grammar')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              ← Back to Grammar
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('quiz')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <span>{isHindi ? 'अभ्यास क्विज़ पर जाएँ' : 'Go to Practice Quiz'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Interactive Practice Quiz */}
      {activeStep === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'पाठ आधारित अभ्यास प्रश्न' : 'Lesson Practice & Comprehension'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'विकल्प चुनें और तुरंत सत्यापित प्रतिक्रिया पाएँ। गलत उत्तर स्वतः रिवीजन में जुड़ेंगे।'
                : 'Select the best option. Instant linguistic feedback is provided; missed questions are automatically queued for spaced revision.'}
            </p>
          </div>

          {lessonQuestions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <p className="text-sm text-slate-600">
                {isHindi ? 'सभी सिद्धांत सीख लिए गए हैं!' : 'You have covered all principles of this lesson!'}
              </p>
              <button
                type="button"
                onClick={handleFinishLesson}
                className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl"
              >
                Complete Lesson
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {lessonQuestions.map((q, idx) => {
                const selected = quizAnswers[q.id];
                const isSubmitted = quizSubmitted[q.id];
                const isCorrect = selected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Question {idx + 1} of {lessonQuestions.length}</span>
                      {isSubmitted && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isCorrect ? '✓ Correct' : '✗ Needs Revision'}
                        </span>
                      )}
                    </div>

                    {q.kannadaPrompt && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 inline-flex items-center gap-2">
                        <span className="font-kannada text-2xl font-bold text-slate-900">
                          {q.kannadaPrompt}
                        </span>
                        {q.transliterationPrompt && (
                          <span className="font-mono text-xs text-amber-800 font-semibold">
                            /{q.transliterationPrompt}/
                          </span>
                        )}
                      </div>
                    )}

                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {isHindi ? q.questionHi : q.questionEn}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-amber-50/70 hover:border-amber-300 text-slate-800';
                        if (isSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-500 text-white font-bold border-emerald-600 shadow-xs';
                          } else if (selected === optIdx) {
                            btnStyle = 'bg-red-500 text-white font-bold border-red-600';
                          } else {
                            btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                          }
                        } else if (selected === optIdx) {
                          btnStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && optIdx === q.correctIndex && <Check size={16} />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit / Feedback */}
                    {!isSubmitted ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyQuestion(q)}
                        disabled={selected === undefined}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-300 font-bold text-xs rounded-xl transition-all"
                      >
                        {isHindi ? 'जाँचिए' : 'Check Answer'}
                      </button>
                    ) : (
                      <div
                        className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'bg-amber-50 text-amber-950 border border-amber-200'
                        }`}
                      >
                        <span className="font-bold">
                          {isCorrect ? 'Great job! ' : 'Explanation: '}
                        </span>
                        {isHindi ? q.explanationHi : q.explanationEn}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-600">
                  {Object.keys(quizSubmitted).length} of {lessonQuestions.length} answered
                </span>
                <button
                  type="button"
                  onClick={handleFinishLesson}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Award size={16} />
                  <span>{isHindi ? 'पाठ पूरा करें' : 'Finish & Mark Lesson Complete'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 6: Lesson Complete Celebration View */}
      {activeStep === 'complete' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {isHindi ? 'बधाई हो!' : 'Lesson Completed!'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentLesson.title}
            </h2>
            <div className="font-kannada text-xl font-bold text-amber-800">
              {currentLesson.titleKannada}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {isHindi
                ? 'आपने इस पाठ के सभी मुख्य बिंदु और प्रश्न सफलतापूर्वक पूरे कर लिए हैं। आपकी प्रगति सहेज ली गई है।'
                : 'You have successfully completed all core objectives, grammar notes, and practice quizzes for this lesson.'}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToNextLesson}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <span>{isHindi ? 'अगला पाठ शुरू करें' : 'Continue to Next Lesson'}</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => setSelectedLessonId(null)}
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              {isHindi ? 'सभी पाठ देखें' : 'Back to Lesson Catalog'}
            </button>
          </div>
        </div>
      )}

      {/* Curriculum Tutor Modal */}
      <CurriculumTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        initialTopic={tutorTopic}
      />
    </div>
  );
};
