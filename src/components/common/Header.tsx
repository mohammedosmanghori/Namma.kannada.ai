import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { Flame, Target, Sparkles, Languages, Settings } from 'lucide-react';
import { CurriculumTutorModal } from './CurriculumTutorModal';

interface HeaderProps {
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { preferences, updatePreferences, progress, setActiveSection } = useLearning();
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // Today's completed count
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = progress.dailyHistory.find((h) => h.date === todayStr);
  const itemsCompletedToday = todayEntry ? todayEntry.itemsCompleted : 0;
  const target = preferences.dailyTarget || 10;
  const isTargetAchieved = itemsCompletedToday >= target;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <div
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            {/* Karnataka Emblem inspired badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-300 font-kannada font-bold text-xl">
                ಕ
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-950 tracking-tight text-base sm:text-lg lg:text-xl font-sans">
                NAMMA <span className="text-amber-600">KANNADA</span> AI
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bilingual Personalisation Quick Switch */}
            <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => updatePreferences({ explanationLanguage: 'en' })}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  preferences.explanationLanguage === 'en'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch explanation language to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => updatePreferences({ explanationLanguage: 'hi' })}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  preferences.explanationLanguage === 'hi'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch explanation language to Hindi"
              >
                हिन्दी
              </button>
            </div>

            {/* Daily Streak Badge */}
            <div
              onClick={() => setActiveSection('progress')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-900 cursor-pointer hover:bg-amber-100 transition-colors"
              title={`${progress.streak} Day Learning Streak`}
            >
              <Flame size={15} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span>{progress.streak}d</span>
            </div>

            {/* Daily Target Progress */}
            <div
              onClick={() => setActiveSection('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                isTargetAchieved
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={`Daily Target: ${itemsCompletedToday} / ${target} completed`}
            >
              <Target size={15} className={isTargetAchieved ? 'text-emerald-600' : 'text-slate-500'} />
              <span>
                {itemsCompletedToday}/{target}
              </span>
            </div>

            {/* Curriculum Tutor Button */}
            <button
              type="button"
              onClick={() => setIsTutorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-amber-300 hover:text-white border border-slate-700 hover:border-amber-400 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Open Curriculum Educational Tutor"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span className="hidden md:inline">Curriculum Tutor</span>
              <span className="md:hidden">Tutor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Educational Curriculum Tutor Modal */}
      <CurriculumTutorModal isOpen={isTutorOpen} onClose={() => setIsTutorOpen(false)} />
    </>
  );
};
