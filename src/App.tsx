/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LearningProvider, useLearning } from './context/LearningContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { DashboardSection } from './components/sections/DashboardSection';
import { LessonsSection } from './components/sections/LessonsSection';
import { VocabularySection } from './components/sections/VocabularySection';
import { DialoguesSection } from './components/sections/DialoguesSection';
import { QuizSection } from './components/sections/QuizSection';
import { FlashcardsSection } from './components/sections/FlashcardsSection';
import { SavedMaterialSection } from './components/sections/SavedMaterialSection';
import { ProgressSettingsSection } from './components/sections/ProgressSettingsSection';

const MainContent: React.FC = () => {
  const { activeSection } = useLearning();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeSection === 'home' && <DashboardSection />}
      {activeSection === 'lessons' && <LessonsSection />}
      {activeSection === 'vocabulary' && <VocabularySection />}
      {activeSection === 'dialogues' && <DialoguesSection />}
      {activeSection === 'quizzes' && <QuizSection />}
      {activeSection === 'flashcards' && <FlashcardsSection />}
      {activeSection === 'saved' && <SavedMaterialSection />}
      {activeSection === 'progress' && <ProgressSettingsSection />}
    </main>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <div className="min-h-screen bg-[#FAF7F2] text-slate-800 flex flex-col font-sans">
        {/* Main Header */}
        <Header />

        {/* Navigation Bar */}
        <Navigation />

        {/* Dynamic Section Content */}
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-amber-200/60 bg-white/60 py-6 text-center text-xs text-slate-500 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <div className="font-extrabold text-slate-800 tracking-wide text-sm">
              NAMMA <span className="text-amber-600">KANNADA</span> AI
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Dedicated interactive Kannada language learning platform for English & Hindi speakers.
            </div>
          </div>
        </footer>
      </div>
    </LearningProvider>
  );
}
