import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { VOCABULARY_ITEMS, STRUCTURED_LESSONS } from '../../data/curriculum';
import {
  TrendingUp,
  Settings,
  Languages,
  Target,
  Flame,
  Award,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Type,
  Trash2,
  Database,
  Calendar,
  Layers,
} from 'lucide-react';

export const ProgressSettingsSection: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    progress,
    resetAllProgress,
    seedSampleProgress,
    getReviewDeckItemIds,
  } = useLearning();

  const [activeTab, setActiveTab] = useState<'progress' | 'settings'>('progress');
  const [notification, setNotification] = useState<string | null>(null);

  const isHindi = preferences.explanationLanguage === 'hi';
  const dueIds = getReviewDeckItemIds();

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Today's activity
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = progress.dailyHistory.find((h) => h.date === todayStr);
  const itemsCompletedToday = todayEntry ? todayEntry.itemsCompleted : 0;
  const target = preferences.dailyTarget || 10;
  const targetPercent = Math.min(100, Math.round((itemsCompletedToday / target) * 100));

  // Category breakdown
  const categoryStats = React.useMemo(() => {
    const cats: Record<string, { total: number; mastered: number }> = {};
    VOCABULARY_ITEMS.forEach((item) => {
      if (!cats[item.category]) cats[item.category] = { total: 0, mastered: 0 };
      cats[item.category].total += 1;
      if (progress.masteredVocabIds.includes(item.id)) {
        cats[item.category].mastered += 1;
      }
    });
    return cats;
  }, [progress.masteredVocabIds]);

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isHindi ? 'ಕಲಿಕೆಯ ಪ್ರಗತಿ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್' : 'Learning Progress & Settings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'वास्तविक सीखने की गतिविधि, स्मरण आँकड़े और व्यक्तिगत प्राथमिकताएँ।'
              : 'Real recorded learning activity, retention metrics, and bilingual preferences.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'progress'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp size={15} />
            <span>{isHindi ? 'प्रगति रिपोर्ट' : 'Progress Report'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings size={15} />
            <span>{isHindi ? 'प्राथमिकताएँ' : 'Preferences'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TAB 1: Real Recorded Progress Report */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500">{isHindi ? 'दैनिक स्ट्रीक' : 'Current Streak'}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-1.5">
                <Flame size={20} className="text-orange-500 fill-orange-500" />
                <span>{progress.streak}d</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isHindi ? 'लगातार अध्ययन दिवस' : 'Consecutive days'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500">{isHindi ? 'दैनिक लक्ष्य' : 'Daily Goal'}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {itemsCompletedToday} <span className="text-xs font-normal text-slate-400">/ {target}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold">
                {targetPercent}% {isHindi ? 'पूर्ण' : 'achieved today'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500">{isHindi ? 'कंठस्थ शब्द' : 'Mastered Words'}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {progress.masteredVocabIds.length}
              </div>
              <p className="text-[11px] text-slate-400">
                of {VOCABULARY_ITEMS.length} curriculum items
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500">{isHindi ? 'पूर्ण किए गए पाठ' : 'Lessons Finished'}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">
                {progress.completedLessonIds.length} <span className="text-xs font-normal text-slate-400">/ {STRUCTURED_LESSONS.length}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {STRUCTURED_LESSONS.length - progress.completedLessonIds.length} remaining
              </p>
            </div>
          </div>

          {/* Spaced Review Queue Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw size={18} className="text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'स्पैस्ड रिपीटिशन स्थिति (Spaced Review Queue)' : 'Spaced Repetition Review Queue'}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                {dueIds.length} items due
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'जिस शब्द या प्रश्न में गलती होती है, वह स्वतः अगले दिन की पुनरावृत्ति सूची में दर्ज हो जाता है। सही उत्तर देने पर अंतराल 2 से 7 दिन बढ़ता जाता है।'
                : 'Whenever you miss an exercise or rate a flashcard as "Needs Practice", it is immediately queued for next-day review. Mastery intervals double with consistent recall.'}
            </p>

            {dueIds.length > 0 ? (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-amber-950">
                  {isHindi ? 'वर्तमान में पुनरावृत्ति योग्य:' : 'Currently due for review:'}
                </span>
                {dueIds.slice(0, 6).map((id) => {
                  const v = VOCABULARY_ITEMS.find((item) => item.id === id);
                  return v ? (
                    <span
                      key={id}
                      className="px-2 py-0.5 bg-white border border-amber-300 rounded-lg text-slate-800 font-kannada font-bold"
                    >
                      {v.kannada}
                    </span>
                  ) : null;
                })}
                {dueIds.length > 6 && <span className="text-slate-500">+{dueIds.length - 6} more</span>}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium">
                ✓ All scheduled reviews completed! You are fully on track.
              </div>
            )}
          </div>

          {/* Curriculum Category Mastery Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'विषयवार महारत प्रतिशत' : 'Curriculum Mastery by Category'}
            </h3>

            <div className="space-y-3">
              {Object.entries(categoryStats).map(([cat, stat]) => {
                const percent = Math.round((stat.mastered / stat.total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="capitalize">{cat}</span>
                      <span className="text-slate-500">
                        {stat.mastered} / {stat.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Activity History Log */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-amber-600" />
              <span>{isHindi ? 'हालिया अध्ययन लॉग' : 'Recent Activity Log'}</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {progress.dailyHistory.slice(-5).reverse().map((entry, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-slate-600">{entry.date}</span>
                  <span className="font-bold text-amber-800">
                    {entry.itemsCompleted} {isHindi ? 'आइटम पूरे किए' : 'items completed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Editable Preferences & Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Explanation Language Preference */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Languages size={18} className="text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'व्याख्या की भाषा (Explanation Language)' : 'Preferred Explanation Language'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isHindi
                ? 'पाठ्यक्रम में सभी अर्थ, व्याकरण स्पष्टीकरण और क्विज़ निर्देश इस भाषा में प्रदर्शित होंगे।'
                : 'Every lesson note, grammar breakdown, quiz explanation, and translation will prioritize this language.'}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  updatePreferences({ explanationLanguage: 'en' });
                  showNotification('Explanation language set to English');
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  preferences.explanationLanguage === 'en'
                    ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-sm font-bold">English</div>
                <div className="text-xs opacity-80">Full English explanations & phonetic cues</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  updatePreferences({ explanationLanguage: 'hi' });
                  showNotification('स्पष्टीकरण भाषा हिन्दी पर सेट की गई');
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  preferences.explanationLanguage === 'hi'
                    ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-sm font-bold">हिन्दी (Hindi)</div>
                <div className="text-xs opacity-80">सम्पूर्ण हिन्दी अर्थ, व्याकरण सूत्र व संवाद</div>
              </button>
            </div>
          </div>

          {/* Beginner Level Setting */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'आरंभिक स्तर (Beginner Level)' : 'Beginner Learning Track'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              {[
                {
                  id: 'beginner',
                  title: 'Absolute Beginner',
                  desc: 'Vowels, script & core courtesies',
                },
                {
                  id: 'novice',
                  title: 'Novice Learner',
                  desc: 'Questions, daily verbs & want/need',
                },
                {
                  id: 'elementary',
                  title: 'Elementary',
                  desc: 'Auto rides, restaurants & dialogues',
                },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    updatePreferences({ beginnerLevel: lvl.id as typeof preferences.beginnerLevel });
                    showNotification(`Level track updated to ${lvl.title}`);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    preferences.beginnerLevel === lvl.id
                      ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{lvl.title}</div>
                  <div className="text-[11px] text-slate-500">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Goal Target */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'दैनिक अध्ययन लक्ष्य (Daily Target)' : 'Daily Learning Target'}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'प्रतिदिन कितने शब्द/अभ्यास पूरा करना चाहते हैं।'
                : 'Select how many curriculum items or exercises you plan to complete daily.'}
            </p>

            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    updatePreferences({ dailyTarget: num });
                    showNotification(`Daily target set to ${num} items`);
                  }}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                    preferences.dailyTarget === num
                      ? 'bg-slate-900 text-amber-300 border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num} items
                </button>
              ))}
            </div>
          </div>

          {/* Typography Display Settings */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Type size={18} className="text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'कन्नड़ लिपि प्रदर्शन सेटिंग्स' : 'Script & Typography Preferences'}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {/* Font Size */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">
                    {isHindi ? 'कन्नड़ लिपि का आकार' : 'Kannada Script Font Size'}
                  </div>
                  <div className="text-slate-500">
                    {isHindi ? 'मात्राओं की स्पष्टता हेतु बड़ा फ़ॉन्ट' : 'Enlarge characters for better diacritic visibility'}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => updatePreferences({ fontSize: 'normal' })}
                    className={`px-3 py-1 rounded-lg font-bold ${
                      preferences.fontSize === 'normal'
                        ? 'bg-amber-500 text-white'
                        : 'bg-white border text-slate-600'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePreferences({ fontSize: 'large' })}
                    className={`px-3 py-1 rounded-lg font-bold ${
                      preferences.fontSize === 'large'
                        ? 'bg-amber-500 text-white'
                        : 'bg-white border text-slate-600'
                    }`}
                  >
                    Large (ದೊಡ್ಡದು)
                  </button>
                </div>
              </div>

              {/* Show/Hide Transliteration */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">
                    {isHindi ? 'रोमन लिप्यंतरण दिखाएँ' : 'Show Roman Transliteration'}
                  </div>
                  <div className="text-slate-500">
                    Display phonetic spelling /Namaskāra/
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updatePreferences({
                      showTransliteration: !preferences.showTransliteration,
                    })
                  }
                  className={`px-3 py-1 rounded-lg font-bold ${
                    preferences.showTransliteration
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {preferences.showTransliteration ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Data Controls (Reset / Seed) */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isHindi ? 'प्रगति डेटा नियंत्रण' : 'Progress Data Management'}
            </h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  seedSampleProgress();
                  showNotification('Sample learning progress loaded');
                }}
                className="px-4 py-2 bg-white border border-slate-300 hover:border-amber-400 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs"
              >
                {isHindi ? 'डेमो प्रगति डेटा भरें' : 'Load Demo Progress'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all your learning progress?')) {
                    resetAllProgress();
                    showNotification('Progress reset successfully');
                  }
                }}
                className="px-4 py-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>{isHindi ? 'प्रगति रीसेट करें' : 'Reset All Progress'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
