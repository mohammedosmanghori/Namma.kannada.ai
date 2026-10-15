import React, { useState, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { VOCABULARY_ITEMS, EDUCATIONAL_DIALOGUES } from '../../data/curriculum';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  BookOpen,
  MessageSquareQuote,
  Trash2,
  Download,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { KannadaText } from '../common/KannadaText';

export const SavedMaterialSection: React.FC = () => {
  const {
    preferences,
    progress,
    toggleBookmarkItem,
    toggleBookmarkDialogue,
    setActiveSection,
    setSelectedDialogueId,
  } = useLearning();

  const [filterType, setFilterType] = useState<'all' | 'vocab' | 'dialogue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isHindi = preferences.explanationLanguage === 'hi';

  const savedVocab = useMemo(() => {
    return VOCABULARY_ITEMS.filter((item) => progress.bookmarkedItemIds.includes(item.id));
  }, [progress.bookmarkedItemIds]);

  const savedDialogues = useMemo(() => {
    return EDUCATIONAL_DIALOGUES.filter((dlg) =>
      progress.bookmarkedDialogueIds.includes(dlg.id)
    );
  }, [progress.bookmarkedDialogueIds]);

  const totalSavedCount = savedVocab.length + savedDialogues.length;

  // Filtered based on search
  const filteredVocab = useMemo(() => {
    if (!searchQuery.trim()) return savedVocab;
    const q = searchQuery.toLowerCase().trim();
    return savedVocab.filter(
      (v) =>
        v.kannada.includes(q) ||
        v.transliteration.toLowerCase().includes(q) ||
        v.english.toLowerCase().includes(q) ||
        v.hindi.toLowerCase().includes(q)
    );
  }, [savedVocab, searchQuery]);

  const filteredDialogues = useMemo(() => {
    if (!searchQuery.trim()) return savedDialogues;
    const q = searchQuery.toLowerCase().trim();
    return savedDialogues.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.titleKannada.includes(q) ||
        d.situation.toLowerCase().includes(q)
    );
  }, [savedDialogues, searchQuery]);

  // Export saved study sheet as JSON
  const handleExportJSON = () => {
    const data = {
      title: 'NAMMA KANNADA AI - Saved Study Material',
      exportedAt: new Date().toISOString(),
      savedVocabulary: savedVocab,
      savedDialogues: savedDialogues,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `namma-kannada-saved-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isHindi ? 'ಉಳಿಸಿದವು — सहेजी गई सामग्री' : 'Saved Material & Bookmarks'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'त्वरित पुनरावृत्ति के लिए बुकमार्क किए गए शब्द, मुहावरे और व्यावहारिक संवाद।'
              : 'Your personal collection of bookmarked vocabulary, key phrases, and dialogues.'}
          </p>
        </div>

        {totalSavedCount > 0 && (
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs self-start sm:self-auto transition-colors"
          >
            <Download size={15} />
            <span>{isHindi ? 'अध्ययन पत्र डाउनलोड करें' : 'Export Study Sheet'}</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold self-start">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'सभी' : 'All'} ({totalSavedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('vocab')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'vocab'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'शब्दावली' : 'Vocabulary'} ({savedVocab.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('dialogue')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'dialogue'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'संवाद' : 'Dialogues'} ({savedDialogues.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'सहेजे गए शब्दों में खोजें...' : 'Search within bookmarks...'}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-2xs"
          />
        </div>
      </div>

      {/* Empty State */}
      {totalSavedCount === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Bookmark size={30} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'कोई सहेजी गई सामग्री नहीं है' : 'No Saved Material Yet'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'शब्दावली या पाठ पढ़ते समय बुकमार्क आइकन (🔖) पर क्लिक करके महत्वपूर्ण शब्दों को यहाँ सहेजें।'
                : 'Click the bookmark icon on any vocabulary card or dialogue to save it for quick revision.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('vocabulary')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            {isHindi ? 'शब्दावली ब्राउज़ करें' : 'Browse Vocabulary Catalog'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Saved Vocabulary Section */}
          {(filterType === 'all' || filterType === 'vocab') && filteredVocab.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={16} className="text-amber-600" />
                <span>{isHindi ? 'सहेजी गई शब्दावली' : 'Bookmarked Vocabulary'} ({filteredVocab.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredVocab.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleBookmarkItem(item.id)}
                        className="text-amber-600 hover:text-red-600 p-1 rounded-lg transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <KannadaText
                      kannada={item.kannada}
                      transliteration={item.transliteration}
                      english={item.english}
                      hindi={item.hindi}
                      size="lg"
                      secondaryLanguage={true}
                    />

                    <div className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
                      {isHindi ? item.explanation.hi : item.explanation.en}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Dialogues Section */}
          {(filterType === 'all' || filterType === 'dialogue') && filteredDialogues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareQuote size={16} className="text-amber-600" />
                <span>{isHindi ? 'सहेजे गए संवाद' : 'Bookmarked Dialogues'} ({filteredDialogues.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDialogues.map((dlg) => (
                  <div
                    key={dlg.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 capitalize">
                        {dlg.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleBookmarkDialogue(dlg.id)}
                        className="text-amber-600 hover:text-red-600 p-1 rounded-lg transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{dlg.title}</h4>
                    <div className="font-kannada text-xs font-semibold text-amber-900">
                      {dlg.titleKannada}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {isHindi ? dlg.situationHindi : dlg.situation}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{dlg.lines.length} lines</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDialogueId(dlg.id);
                          setActiveSection('dialogues');
                        }}
                        className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                      >
                        <span>{isHindi ? 'संवाद खोलें' : 'Open Dialogue'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
