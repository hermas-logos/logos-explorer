import { AlertCircle, BarChart3, HelpCircle, Flame, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { InfographicData, StudyProfile } from '../types';

interface InfographicProps {
  infographicData: {
    academic_en: InfographicData;
    esl_en: InfographicData;
    translated_es: InfographicData;
    translated_id: InfographicData;
  };
  activeProfile: StudyProfile;
}

export default function Infographic({ infographicData, activeProfile }: InfographicProps) {
  const data = infographicData[activeProfile] || infographicData['academic_en'];

  // Icons array to assign variety to metric cards
  const icons = [
    <Flame size={20} className="text-amber-500" />,
    <BarChart3 size={20} className="text-indigo-400" />,
    <Star size={20} className="text-yellow-400" />,
    <ShieldCheck size={20} className="text-emerald-400" />
  ];

  return (
    <div id="infographic-container" className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div>
          <h3 className="font-serif text-lg text-indigo-200">Graphic Synthesis & Key Takeaways</h3>
          <p className="text-xs text-neutral-400 mt-1">{data.title}</p>
        </div>
        <span className="text-xs font-mono text-neutral-400">By the numbers</span>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-card p-5 rounded-xl border border-neutral-800 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-xs font-sans font-medium text-neutral-400 uppercase tracking-wider line-clamp-2">
                {metric.label}
              </span>
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800/60 flex-shrink-0">
                {icons[idx % icons.length]}
              </div>
            </div>

            <div>
              <div className="font-mono text-xl md:text-2xl font-bold text-indigo-300 leading-none tracking-tight">
                {metric.value}
              </div>
              <p className="text-xs text-neutral-500 mt-2 font-sans italic leading-relaxed">
                {metric.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Structured Key Takeaways list */}
      <div className="glass-card p-6 rounded-xl space-y-4 border border-neutral-800/80 bg-gradient-to-br from-indigo-950/10 via-neutral-950/40 to-neutral-950/80">
        <h4 className="font-serif text-sm md:text-base text-indigo-200 flex items-center gap-2">
          <AlertCircle size={16} className="text-indigo-400" />
          Primary Analytical Takeaways
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {data.takeaways.map((takeaway, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="relative pl-6 flex flex-col"
            >
              <div className="absolute left-0 top-1 text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-900/60 w-5 h-5 rounded-full flex items-center justify-center">
                {idx + 1}
              </div>
              <p className="font-sans text-xs md:text-sm text-neutral-300 leading-relaxed">
                {takeaway}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
