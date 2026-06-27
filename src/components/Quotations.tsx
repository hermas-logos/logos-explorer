import { Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { Quotation, StudyProfile } from '../types';

interface QuotationsProps {
  quotations: Quotation[];
  activeProfile: StudyProfile;
}

export default function Quotations({ quotations, activeProfile }: QuotationsProps) {
  return (
    <div id="quotations-container" className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <h3 className="font-serif text-lg md:text-xl text-indigo-200">Inspiring Philosophical Quotations</h3>
        <span className="text-xs font-mono text-neutral-400">Wisdom from history</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotations.map((quote, idx) => {
          const text = quote.quote_text[activeProfile] || quote.quote_text['academic_en'];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              id={`quote-card-${idx}`}
              className="glass-card p-6 rounded-xl relative overflow-hidden flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 group"
            >
              {/* Background soft glow */}
              <div className="absolute -right-6 -top-6 text-neutral-900/40 pointer-events-none group-hover:text-indigo-950/20 transition-colors duration-300">
                <Quote size={120} strokeWidth={1} />
              </div>

              {/* Quote Mark */}
              <Quote size={20} className="text-indigo-500/70 mb-4" />

              <div className="relative z-10 flex-grow mb-6">
                <blockquote className="font-serif text-sm md:text-base text-neutral-200 leading-relaxed italic">
                  "{text}"
                </blockquote>
              </div>

              <div className="relative z-10 border-t border-neutral-800/60 pt-4 flex items-center justify-between">
                <div>
                  <cite className="not-italic font-sans font-medium text-xs md:text-sm text-indigo-300">
                    {quote.author}
                  </cite>
                  <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                    {quote.historical_role}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded text-[9px] font-mono font-medium tracking-wide uppercase bg-neutral-900 text-indigo-400 border border-indigo-950">
                  {quote.historical_role.includes('Nobel') || quote.historical_role.includes('Physicist') ? 'Science' : 'Philosophy'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
