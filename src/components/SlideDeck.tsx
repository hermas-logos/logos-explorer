import { useState } from 'react';
import { ArrowLeft, ArrowRight, Presentation, HelpCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideDeck, StudyProfile } from '../types';

interface SlideDeckProps {
  slideDecks: SlideDeck[];
  activeProfile: StudyProfile;
}

export default function SlideDeckComponent({ slideDecks, activeProfile }: SlideDeckProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const activeSlide = slideDecks[currentSlideIndex];

  if (!activeSlide) return null;

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slideDecks.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slideDecks.length) % slideDecks.length);
  };

  const currentTitle = activeSlide.title[activeProfile] || activeSlide.title['academic_en'];
  const bullets = activeSlide.bullets[activeProfile] || activeSlide.bullets['academic_en'];

  return (
    <div id="slidedeck-container" className="glass-card p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <h3 className="font-serif text-lg text-indigo-200 flex items-center gap-2">
          <Presentation size={18} className="text-indigo-400" />
          Interactive Slides Carousel
        </h3>
        <span className="text-xs font-mono text-neutral-400">
          Slide {currentSlideIndex + 1} of {slideDecks.length}
        </span>
      </div>

      {/* Main Slide Panel */}
      <div className="relative min-h-[220px] bg-neutral-950/80 border border-neutral-800/80 p-6 md:p-8 rounded-xl overflow-hidden flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 flex-grow"
          >
            <div className="flex items-center gap-2 border-b border-neutral-800/50 pb-2 mb-3">
              <span className="font-mono text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">
                Slide 0{activeSlide.slide_number}
              </span>
              <h4 className="font-sans font-semibold text-base md:text-lg text-neutral-100">
                {currentTitle}
              </h4>
            </div>

            <ul className="space-y-3.5 pl-1">
              {bullets.map((bullet, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={14} className="text-indigo-400 mt-1 flex-shrink-0" />
                  <span className="font-sans text-xs md:text-sm text-neutral-300 leading-relaxed">
                    {bullet}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar tracking slide index */}
        <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden mt-6">
          <div
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((currentSlideIndex + 1) / slideDecks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Controller Buttons and Dots */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={prevSlide}
          id="prev-slide-btn"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-indigo-500/30 text-xs text-neutral-400 hover:text-neutral-100 transition-all bg-neutral-900"
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        {/* Bullet indicators */}
        <div className="flex items-center gap-2">
          {slideDecks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentSlideIndex === idx
                  ? 'bg-indigo-500 w-5'
                  : 'bg-neutral-800 hover:bg-neutral-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          id="next-slide-btn"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-indigo-500/30 text-xs text-neutral-400 hover:text-neutral-100 transition-all bg-neutral-900"
        >
          Next
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
