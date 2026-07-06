import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface StudyProfilesHubProps {
  activeProfile: 'academic' | 'esl';
  onChange: (profile: 'academic' | 'esl') => void;
}

export function StudyProfilesHub({ activeProfile, onChange }: StudyProfilesHubProps) {
  return (
    <div className="flex bg-stone-950/40 p-1 rounded-xl border border-stone-800/80 shadow-inner w-fit">
      {/* College Academic Profile */}
      <button
        onClick={() => onChange('academic')}
        className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
          activeProfile === 'academic'
            ? 'bg-amber-500 text-stone-950 shadow-lg font-bold'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <GraduationCap className="w-4.5 h-4.5" /> College Academic (EN)
      </button>

      {/* Accessible / ESL Profile */}
      <button
        onClick={() => onChange('esl')}
        className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
          activeProfile === 'esl'
            ? 'bg-amber-500 text-stone-950 shadow-lg font-bold'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <Sparkles className="w-4.5 h-4.5" /> Accessible / ESL (EN)
      </button>
    </div>
  );
}