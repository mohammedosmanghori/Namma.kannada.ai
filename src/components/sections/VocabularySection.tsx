import React, { useState, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { VOCABULARY_ITEMS } from '../../data/curriculum';
import { VocabularyItem } from '../../types';
import {
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Check,
} from 'lucide-react';
import { KannadaText } from '../common/KannadaText';

export const VocabularySection: React.FC = () => {
  const { preferences, progress, toggleBookmarkItem, recordItemPractice } = useLearning();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [expandedPracticeId, setExpandedPracticeId] = useState<string | null>(null);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceVerified, setPracticeVerified] = useState<Record<string, boolean>>({});

  const isHindi = preferences.explanationLanguage === 'hi';

  const categories = [
    { id: 'all', labelEn: 'All Words', labelHi: 'सभी शब्द' },
    { id: 'greeting', labelEn: 'Greetings', labelHi: 'अभिवादन' },
    { id: 'pronoun', labelEn: 'Pronouns', labelHi: 'सर्वनाम' },
    { id: 'question', labelEn: 'Questions', labelHi: 'प्रश्न' },
    { id: 'verb', labelEn: 'Verbs', labelHi: 'क्रियाएँ' },
    { id: 'commute', labelEn: 'Commute & Auto', labelHi: 'ऑटो व यात्रा' },
    { id: 'food', labelEn: 'Food & Dining', labelHi: 'भोजन व नाश्ता' },
    { id: 'number', labelEn: 'Numbers & Time', labelHi: 'संख्याएँ व समय' },
    { id: 'polite', labelEn: 'Polite Words', labelHi: 'विनम्र शब्द' },
  ];

  // Filtered vocabulary
  const filteredItems = useMemo(() => {
    return VOCABULARY_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Mastery match
      if (masteryFilter === 'mastered') {
        if (!progress.masteredVocabIds.includes(item.id)) return false;
      } else if (masteryFilter === 'review') {
        const stat = progress.itemStats[item.id];
        if (!stat || !stat.isMissed) return false;
      }

      // Search match (Kannada, transliteration, English, Hindi)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchKannada = item.kannada.includes(query);
        const matchTranslit = item.transliteration.toLowerCase().includes(query);
        const matchEnglish = item.english.toLowerCase().includes(query);
        const matchHindi = item.hindi.toLowerCase().includes(query);

        return matchKannada || matchTranslit || matchEnglish || matchHindi;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, masteryFilter, progress]);

  const handlePracticeSelect = (itemId: string, optionIndex: number) => {
    if (practiceVerified[itemId]) return;
    setPracticeAnswers((prev) => ({ ...prev, [itemId]: optionIndex }));
  };

  const handleVerifyPractice = (item: VocabularyItem) => {
    const chosenIndex = practiceAnswers[item.id];
    if (chosenIndex === undefined) return;

    const isCorrect = chosenIndex === item.practiceQuestion.correctIndex;
    setPracticeVerified((prev) => ({ ...prev, [item.id]: true }));
    recordItemPractice(item.id, isCorrect);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isHindi ? 'ಕನ್ನಡ ಶಬ್ದಕೋಶ — व्यावहारिक शब्दावली' : 'Kannada Vocabulary & Examples'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'सत्यापित अर्थ, स्पष्टीकरण, वास्तविक वाक्य और त्वरित अभ्यास प्रश्न।'
              : 'Curated practical words, contextual example sentences, usage notes, and related exercises.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHindi
                ? 'कन्नड़, हिंदी, अंग्रेज़ी में खोजें...'
                : 'Search Kannada, English, Hindi, Transliteration...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {isHindi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Status Filter Sub-chips */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">{isHindi ? 'स्थिति:' : 'Status:'}</span>
          <button
            type="button"
            onClick={() => setMasteryFilter('all')}
            className={`px-2.5 py-0.5 rounded-lg font-medium transition-colors ${
              masteryFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isHindi ? 'सभी' : 'All'} ({VOCABULARY_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => setMasteryFilter('mastered')}
            className={`px-2.5 py-0.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              masteryFilter === 'mastered' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle size={12} />
            <span>{isHindi ? 'कंठस्थ' : 'Mastered'} ({progress.masteredVocabIds.length})</span>
          </button>
        </div>
      </div>

      {/* Vocabulary Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <HelpCircle size={36} className="text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {isHindi ? 'कोई शब्दावली नहीं मिली' : 'No Vocabulary Items Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isHindi
              ? `"${searchQuery}" के लिए कोई परिणाम नहीं मिला। कृपया खोज शब्द बदलें या फ़िल्टर रीसेट करें।`
              : `No matches found for "${searchQuery}". Try clearing search or selecting a different category.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setMasteryFilter('all');
            }}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isBookmarked = progress.bookmarkedItemIds.includes(item.id);
            const isMastered = progress.masteredVocabIds.includes(item.id);
            const isExpanded = expandedPracticeId === item.id;
            const q = item.practiceQuestion;
            const chosenAnswer = practiceAnswers[item.id];
            const isVerified = practiceVerified[item.id];

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl bg-white border transition-all shadow-xs space-y-3.5 hover:shadow-md ${
                  isMastered
                    ? 'border-emerald-200/80 bg-emerald-50/15'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                      {item.category}
                    </span>
                    {isMastered && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle size={12} />
                        Mastered
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleBookmarkItem(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark item'}
                    >
                      {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>
                </div>

                {/* Main Script & Meanings */}
                <KannadaText
                  kannada={item.kannada}
                  transliteration={item.transliteration}
                  english={item.english}
                  hindi={item.hindi}
                  size="xl"
                  secondaryLanguage={true}
                />

                {/* Usage Note */}
                <div className="text-xs text-slate-700 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 leading-relaxed shadow-2xs">
                  <span className="font-extrabold text-amber-950">
                    {isHindi ? '💡 प्रयोग निर्देश: ' : '💡 Usage & Context: '}
                  </span>
                  {isHindi ? item.explanation.hi : item.explanation.en}
                </div>

                {/* Example sentence */}
                {item.examples.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-amber-50/30 to-orange-50/20 border border-slate-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100/70 px-2 py-0.5 rounded-md">
                        {isHindi ? 'उदाहरण वाक्य' : 'Example Sentence'}
                      </span>
                    </div>
                    <div className="font-kannada text-lg font-bold text-slate-950">
                      {item.examples[0].kannada}
                    </div>
                    <div className="text-xs font-mono font-semibold text-amber-900 bg-amber-100/50 px-2 py-0.5 rounded inline-block">
                      /{item.examples[0].transliteration}/
                    </div>
                    <div className="text-xs text-slate-700 font-medium pt-0.5">
                      {isHindi ? item.examples[0].hindi : item.examples[0].english}
                    </div>
                  </div>
                )}

                {/* Interactive Related Practice Question Collapsible */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setExpandedPracticeId(isExpanded ? null : item.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-amber-900 hover:text-amber-950 py-1.5 px-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      {isHindi ? 'संबंधित अभ्यास प्रश्न (Mini-Exercise)' : 'Related Practice Question (Mini-Exercise)'}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in text-xs shadow-inner">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {isHindi ? q.questionHi : q.questionEn}
                      </p>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = 'bg-white border-slate-200 text-slate-800 hover:border-amber-300';
                          if (isVerified) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs';
                            } else if (chosenAnswer === optIdx) {
                              optStyle = 'bg-red-500 text-white font-bold border-red-600';
                            } else {
                              optStyle = 'bg-white text-slate-400 opacity-60';
                            }
                          } else if (chosenAnswer === optIdx) {
                            optStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handlePracticeSelect(item.id, optIdx)}
                              disabled={isVerified}
                              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {isVerified && optIdx === q.correctIndex && <Check size={14} />}
                            </button>
                          );
                        })}
                      </div>

                      {!isVerified ? (
                        <button
                          type="button"
                          onClick={() => handleVerifyPractice(item)}
                          disabled={chosenAnswer === undefined}
                          className="px-5 py-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all"
                        >
                          {isHindi ? 'उत्तर जाँचिए' : 'Verify Answer'}
                        </button>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 leading-relaxed font-medium">
                          <span className="font-bold">
                            {chosenAnswer === q.correctIndex ? '✓ Correct! ' : '✗ Note: '}
                          </span>
                          {isHindi ? q.explanationHi : q.explanationEn}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
