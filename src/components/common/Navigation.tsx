import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { ActiveSection } from '../../types';
import {
  Home,
  BookOpen,
  BookA,
  MessageSquareQuote,
  HelpCircle,
  Layers,
  Bookmark,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  id: ActiveSection;
  labelEn: string;
  labelHi: string;
  kannadaLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export const Navigation: React.FC = () => {
  const { activeSection, setActiveSection, preferences, progress, getReviewDeckItemIds } = useLearning();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reviewCount = getReviewDeckItemIds().length;
  const savedCount = progress.bookmarkedItemIds.length + progress.bookmarkedDialogueIds.length;

  const navItems: NavItem[] = [
    {
      id: 'home',
      labelEn: 'Dashboard',
      labelHi: 'डैशबोर्ड',
      kannadaLabel: 'ಮುಖಪುಟ',
      icon: Home,
    },
    {
      id: 'lessons',
      labelEn: 'Lessons',
      labelHi: 'पाठ',
      kannadaLabel: 'ಪಾಠಗಳು',
      icon: BookOpen,
      badge: 10 - progress.completedLessonIds.length,
    },
    {
      id: 'vocabulary',
      labelEn: 'Vocabulary',
      labelHi: 'शब्दावली',
      kannadaLabel: 'ಶಬ್ದಕೋಶ',
      icon: BookA,
    },
    {
      id: 'dialogues',
      labelEn: 'Dialogues',
      labelHi: 'बातचीत',
      kannadaLabel: 'ಸಂಭಾಷಣೆ',
      icon: MessageSquareQuote,
    },
    {
      id: 'quizzes',
      labelEn: 'Quizzes',
      labelHi: 'क्विज़',
      kannadaLabel: 'ರಸಪ್ರಶ್ನೆ',
      icon: HelpCircle,
    },
    {
      id: 'flashcards',
      labelEn: 'Flashcards',
      labelHi: 'फ्लैशकार्ड',
      kannadaLabel: 'ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್',
      icon: Layers,
      badge: reviewCount > 0 ? reviewCount : undefined,
    },
    {
      id: 'saved',
      labelEn: 'Saved',
      labelHi: 'सहेजे गए',
      kannadaLabel: 'ಉಳಿಸಿದವು',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'progress',
      labelEn: 'Progress',
      labelHi: 'प्रगति व सेटिंग्स',
      kannadaLabel: 'ಪ್ರಗತಿ',
      icon: TrendingUp,
    },
  ];

  const handleSelect = (id: ActiveSection) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Main Navigation Bar */}
      <nav className="hidden lg:block bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const label = preferences.explanationLanguage === 'hi' ? item.labelHi : item.labelEn;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/60'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                  <span>{label}</span>
                  <span
                    className={`text-[10px] font-kannada font-normal opacity-85 hidden xl:inline ${
                      isActive ? 'text-amber-100' : 'text-slate-500'
                    }`}
                  >
                    ({item.kannadaLabel})
                  </span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Top Sub-bar with Drawer toggle & Active section title */}
      <div className="lg:hidden bg-white border-b border-amber-200/70 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 transition-colors"
            aria-label="Toggle curriculum navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {preferences.explanationLanguage === 'hi' ? 'अनुभाग:' : 'Section:'}
          </span>
          <span className="text-sm font-extrabold text-amber-900">
            {navItems.find((n) => n.id === activeSection)?.[
              preferences.explanationLanguage === 'hi' ? 'labelHi' : 'labelEn'
            ]}
          </span>
        </div>

        {reviewCount > 0 && (
          <button
            type="button"
            onClick={() => handleSelect('flashcards')}
            className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300 flex items-center gap-1"
          >
            <span>Due:</span>
            <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
              {reviewCount}
            </span>
          </button>
        )}
      </div>

      {/* Mobile Expandable Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-slate-200 p-4 shadow-xl space-y-1 animate-fade-in z-30">
          <div className="text-xs font-bold text-slate-600 uppercase px-3 py-1">
            Curriculum Sections
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const label = preferences.explanationLanguage === 'hi' ? item.labelHi : item.labelEn;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  type="button"
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-amber-50 border border-slate-200/60'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-amber-700'} />
                  <div className="truncate">
                    <div>{label}</div>
                    <div className="text-[10px] font-kannada font-normal opacity-85">
                      {item.kannadaLabel}
                    </div>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Bar (Fast thumb access to top 5 actions) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex justify-around items-center">
        {[
          navItems[0], // Home
          navItems[1], // Lessons
          navItems[2], // Vocab
          navItems[3], // Dialogues
          navItems[5], // Flashcards
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const label = preferences.explanationLanguage === 'hi' ? item.labelHi : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              type="button"
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-amber-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-amber-600' : 'text-slate-400'} />
              <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-600 ring-2 ring-white" />
              )}
            </button>
          );
        })}
        {/* Quick Menu button to access Quizzes, Saved, Progress */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800"
        >
          <Menu size={20} className="text-slate-400" />
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </div>
    </>
  );
};
