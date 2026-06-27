import React, { ReactNode } from 'react';
import { BookOpen, FileText, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { SpecializedReportData, StudyProfile } from '../types';

interface ReportPanelProps {
  reports: {
    academic_en: SpecializedReportData;
    esl_en: SpecializedReportData;
    translated_es: SpecializedReportData;
    translated_id: SpecializedReportData;
  };
  activeProfile: StudyProfile;
}

export default function ReportPanel({ reports, activeProfile }: ReportPanelProps) {
  const report = reports[activeProfile] || reports['academic_en'];

  // Custom simple parser to transform markdown-like syntax into beautiful scholarly HTML5 blocks
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }

      // Check for headings
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="font-serif text-base md:text-lg font-bold text-indigo-300 mt-6 mb-3 border-l-2 border-indigo-500 pl-3">
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={idx} className="font-serif text-lg md:text-xl font-bold text-neutral-100 mt-8 mb-4 border-b border-neutral-800 pb-2">
            {trimmed.replace(/^##\s*/, '')}
          </h3>
        );
      }
      if (trimmed.startsWith('#')) {
        return (
          <h2 key={idx} className="font-serif text-xl md:text-2xl font-bold text-white mt-8 mb-4">
            {trimmed.replace(/^#\s*/, '')}
          </h2>
        );
      }

      // Check for bold elements and replace with robust JSX
      let renderedText: React.ReactNode = trimmed;
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        renderedText = parts.map((part, pIdx) => {
          // Odd indices are between "**" sets
          return pIdx % 2 === 1 ? <strong key={pIdx} className="text-indigo-200 font-bold">{part}</strong> : part;
        });
      }

      return (
        <p key={idx} className="font-sans text-xs md:text-sm text-neutral-300 leading-relaxed mb-4 text-justify">
          {renderedText}
        </p>
      );
    });
  };

  return (
    <div id="report-panel-container" className="glass-card p-6 rounded-xl space-y-6 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-400" />
          <div>
            <h3 className="font-serif text-lg text-indigo-200">Specialized Academic Reports</h3>
            <span className="text-xs text-neutral-400 font-sans mt-0.5 block">{report.title}</span>
          </div>
        </div>

        <button
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([`${report.title}\n\n${report.body}`], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `${report.title.replace(/\s+/g, '_')}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-indigo-500/20 text-xs text-neutral-400 hover:text-indigo-300 transition-all rounded-lg"
          title="Download report as text file"
        >
          <Download size={12} />
          <span>Export TXT</span>
        </button>
      </div>

      {/* Elegant reader container */}
      <div className="bg-neutral-900/10 p-5 md:p-8 rounded-xl border border-neutral-800/40 max-h-[460px] overflow-y-auto custom-scrollbar select-text selection:bg-indigo-500/20 selection:text-indigo-200">
        <article className="prose prose-invert max-w-none">
          {parseMarkdown(report.body)}
        </article>
      </div>
    </div>
  );
}
