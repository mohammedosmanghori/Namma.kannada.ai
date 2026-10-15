import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface KannadaTextProps {
  kannada: string;
  transliteration?: string;
  english?: string;
  hindi?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showBookmark?: boolean;
  itemId?: string;
  secondaryLanguage?: boolean; // display both languages
  className?: string;
}

export const KannadaText: React.FC<KannadaTextProps> = ({
  kannada,
  transliteration,
  english,
  hindi,
  size = 'md',
  showBookmark = false,
  itemId,
  secondaryLanguage = false,
  className = '',
}) => {
  const { preferences, progress, toggleBookmarkItem } = useLearning();

  const isBookmarked = itemId ? progress.bookmarkedItemIds.includes(itemId) : false;
  const preferredLang = preferences.explanationLanguage;
  const isLarge = preferences.fontSize === 'large';

  const sizeMappings = {
    sm: {
      kannada: 'text-lg font-medium leading-snug',
      translit: 'text-xs',
      meaning: 'text-xs',
    },
    md: {
      kannada: isLarge ? 'text-2xl font-semibold leading-relaxed' : 'text-xl font-semibold leading-normal',
      translit: 'text-sm',
      meaning: 'text-sm',
    },
    lg: {
      kannada: isLarge ? 'text-3xl font-bold leading-normal' : 'text-2xl font-bold leading-normal',
      translit: 'text-base',
      meaning: 'text-base',
    },
    xl: {
      kannada: isLarge ? 'text-4xl font-extrabold leading-tight' : 'text-3xl font-extrabold leading-tight',
      translit: 'text-lg',
      meaning: 'text-base',
    },
    hero: {
      kannada: isLarge ? 'text-5xl md:text-6xl font-extrabold leading-none' : 'text-4xl md:text-5xl font-extrabold leading-none',
      translit: 'text-xl font-medium',
      meaning: 'text-lg',
    },
  };

  const currentSize = sizeMappings[size];

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Kannada Script Row */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className={`font-kannada text-slate-900 tracking-wide ${currentSize.kannada}`}>
          {kannada}
        </span>


        {showBookmark && itemId && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmarkItem(itemId);
            }}
            title={isBookmarked ? 'Remove from Saved' : 'Save for quick revision'}
            className={`p-1.5 rounded-full transition-colors ${
              isBookmarked
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      {/* Roman Transliteration Badge */}
      {preferences.showTransliteration && transliteration && (
        <div className="pt-0.5">
          <span className={`inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-100/70 border border-amber-300/60 px-2 py-0.5 rounded-lg ${currentSize.translit}`}>
            <span className="text-amber-700 font-normal">/</span>
            {transliteration}
            <span className="text-amber-700 font-normal">/</span>
          </span>
        </div>
      )}

      {/* Meaning in Preferred Explanation Language (English / Hindi) */}
      {(english || hindi) && (
        <div className={`text-slate-800 font-medium pt-1 ${currentSize.meaning}`}>
          {preferredLang === 'hi' && hindi ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 font-bold tracking-tight">{hindi}</span>
              {(secondaryLanguage || !hindi) && english && (
                <span className="text-xs text-slate-500 font-normal">
                  <span className="font-semibold text-slate-600">EN:</span> {english}
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-900 font-bold tracking-tight">{english || hindi}</span>
              {(secondaryLanguage || preferredLang === 'hi') && hindi && (
                <span className="text-xs text-slate-500 font-normal">
                  <span className="font-semibold text-slate-600">हिन्दी:</span> {hindi}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
