import { Play, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Scene, StudyProfile } from '../types';

interface TimelineProps {
  scenes: Scene[];
  activeProfile: StudyProfile;
  youtubeVideoId: string;
}

export default function Timeline({ scenes, activeProfile, youtubeVideoId }: TimelineProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDeepLink = (seconds: number) => {
    return `https://www.youtube.com/watch?v=${youtubeVideoId}&t=${seconds}`;
  };

  return (
    <div id="timeline-container" className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
        <h3 className="font-serif text-lg md:text-xl text-indigo-200">Interactive Video Timeline</h3>
        <span className="text-xs font-mono text-neutral-400">Click to jump to timestamp</span>
      </div>

      <div className="relative pl-6 border-l-2 border-indigo-900/40 space-y-6">
        {scenes.map((scene, idx) => {
          const title = scene.title[activeProfile] || scene.title['academic_en'];
          const description = scene.description[activeProfile] || scene.description['academic_en'];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative group"
            >
              {/* Dot Indicator */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-neutral-900 border-2 border-indigo-500 group-hover:border-indigo-400 group-hover:bg-indigo-950 transition-colors duration-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 group-hover:scale-125 transition-transform duration-200" />
              </div>

              {/* Card Container */}
              <a
                href={getDeepLink(scene.timestamp_seconds)}
                target="_blank"
                rel="noreferrer"
                id={`timeline-scene-${idx}`}
                className="block glass-card p-4 rounded-lg hover:border-indigo-500/30 transition-all duration-300 hover:translate-x-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-900/50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Play size={10} className="fill-indigo-400" />
                      {formatTime(scene.timestamp_seconds)}
                    </span>
                    <h4 className="font-sans font-medium text-sm md:text-base text-neutral-100 group-hover:text-indigo-200 transition-colors">
                      {title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-400 flex items-center gap-1 self-start sm:self-auto">
                    Open YouTube <ExternalLink size={10} />
                  </span>
                </div>
                <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed">
                  {description}
                </p>
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
