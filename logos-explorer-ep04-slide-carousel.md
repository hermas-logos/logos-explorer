# Interactive Slide Carousel Component (SlideCarousel.tsx)
**Project: Logos-Explorer PWA | Episode 04: How Vast is the Universe**
**Format: React 18 + TypeScript + Tailwind CSS**

This file contains the complete, production-ready React component for your interactive slide-by-slide presentation. It is fully responsive, optimized for both mobile swiping and desktop keyboard navigation, and maps your **77 slide JPEG images** (`slide_01.jpg` through `slide_77.jpg`) alongside rich educational metadata.

---

## 🛠️ Installation Instructions
1. In your PWA repository, open or create the file:
   `src/components/SlideCarousel.tsx`
2. Copy the entire code block from the section below and paste it into the file.
3. Ensure you have `lucide-react` installed (`npm install lucide-react` or it is already in your `package.json` package list).
4. Save the file. Your development server will automatically reload and show the working slide carousel!

---

## 🧑‍💻 Component Code (SlideCarousel.tsx)

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Grid, 
  X, 
  Info, 
  Compass,
  AlertCircle
} from 'lucide-react';

// Define the structure of our Slide Milestone Metadata
interface SlideMilestone {
  range: [number, number];
  scene: string;
  topic: string;
  description: string;
  pwaPortal?: string;
}

// 77 Slides mapped to 10 narrative scenes with high-value educational landmarks
const MILESTONES: SlideMilestone[] = [
  {
    range: [1, 5],
    scene: "Scene 01: Cold Open",
    topic: "The Invisible Wall",
    description: "Visualizing the cosmic boundary: structures in the distant universe being slowly switched off forever."
  },
  {
    range: [6, 17],
    scene: "Scene 02: The Scale Problem",
    topic: "Human Scale vs. Cosmic Void",
    description: "From driving to the Moon (160 days) to our TV/radio 'soap bubble' compared to the vast Pacific Ocean.",
    pwaPortal: "/ep04/scale-calculator"
  },
  {
    range: [18, 29],
    scene: "Scene 03: The Cosmic Distance Ladder",
    topic: "Measuring the Unreachable",
    description: "Climbing from Parallax to Henrietta Leavitt's Cepheid variables, Type Ia Supernovae, and Redshift.",
    pwaPortal: "/ep04/distance-ladder"
  },
  {
    range: [30, 38],
    scene: "Scene 04: The Time Machine Problem",
    topic: "Looking Into the Past",
    description: "How light speed limits make every telescope a time capsule. Staring 2.5M years back at Andromeda."
  },
  {
    range: [39, 47],
    scene: "Scene 05: A Number That Shouldn't Work",
    topic: "The 93-Billion-Light-Year Paradox",
    description: "Understanding the widening river: how space stretches carrying galaxies further than light could travel through it."
  },
  {
    range: [48, 57],
    scene: "Scene 06: Cosmic Event Horizon",
    topic: "The Reachable Bubble",
    description: "Swimming against a current flowing faster than light. Dark energy creates an absolute wall at 16B light-years.",
    pwaPortal: "/ep04/horizon-model"
  },
  {
    range: [58, 66],
    scene: "Scene 07: Our Local Neighborhood",
    topic: "Voids and Swiss Cheese",
    description: "The Laniakea Supercluster, the Local Void, and the eerie, pitch-black loneliness of the Boötes Supervoid.",
    pwaPortal: "/ep04/cosmic-web"
  },
  {
    range: [67, 72],
    scene: "Scene 08: Is the Universe Flat?",
    topic: "The Infinite Parking Lot",
    description: "Analyzing the Planck satellite CMB map. A perfectly flat universe suggests an endless, infinite canvas."
  },
  {
    range: [73, 75],
    scene: "Scene 09: The Grand Synthesis",
    topic: "The Closing Window of Time",
    description: "Our highly privileged window of cosmic observation. Distant galaxies are crossing our event horizon and erasing history."
  },
  {
    range: [76, 77],
    scene: "Scene 10: Reflection",
    topic: "Psalm 19 & Silent Preaching",
    description: "C.S. Lewis on the paradox of silent preaching: how nature declares majesty, while Scripture reveals personal grace.",
    pwaPortal: "/ep04/theology-report"
  }
];

export const SlideCarousel: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3000); // 3 seconds per slide by default
  
  const totalSlides = 77;
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);

  // Clear image errors when slide changes
  useEffect(() => {
    setImageError(false);
  }, [activeSlide]);

  // Handle Autoplay Loop
  useEffect(() => {
    if (isPlaying) {
      autoplayTimerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
      }, playbackSpeed);
    } else {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev <= 1 ? totalSlides : prev - 1));
  };

  // Get active slide metadata (Scene, Topic, and Description)
  const getActiveMetadata = (): SlideMilestone => {
    const match = MILESTONES.find(
      (m) => activeSlide >= m.range[0] && activeSlide <= m.range[1]
    );
    return match || {
      range: [1, 77],
      scene: "Episode 04",
      topic: "How Vast is the Universe?",
      description: "Mapping the True scale and horizons of our cosmos."
    };
  };

  const metadata = getActiveMetadata();

  // Mobile Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    // Minimum swipe threshold of 50px
    if (diff > 50) {
      handleNext(); // Swipe Left -> Next Slide
    } else if (diff < -50) {
      handlePrev(); // Swipe Right -> Prev Slide
    }
    touchStartRef.current = null;
  };

  return (
    <div className={`slide-carousel-root flex flex-col bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full aspect-video'}`}>
      
      {/* 1. Header Bar */}
      <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-2 py-1 rounded border border-amber-500/30">
            Slide {String(activeSlide).padStart(2, '0')} / {totalSlides}
          </span>
          <span className="text-slate-400 text-xs md:text-sm font-medium truncate max-w-[200px] md:max-w-none">
            {metadata.scene} • <span className="text-amber-500">{metadata.topic}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowGrid(!showGrid)} 
            className={`p-1.5 rounded transition-colors duration-200 ${showGrid ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title="Show All Slides Grid"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Lightbox"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. Main Presentation Window */}
      <div 
        className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 z-10 p-2 rounded-full bg-slate-900/60 backdrop-blur border border-slate-800 text-white hover:bg-amber-500 hover:text-slate-950 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The Slide Image Layer */}
        {!imageError ? (
          <img 
            src={`/images/ep04/slides/slide_${String(activeSlide).padStart(2, '0')}.jpg`} 
            alt={`Episode 4 Slide ${activeSlide}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain transition-opacity duration-300"
          />
        ) : (
          /* Error Fallback: A gorgeous space nebula layout to keep the design premium and unbroken! */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 relative p-8 text-center border-2 border-dashed border-slate-800">
            {/* Stars background overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            <AlertCircle className="w-16 h-16 text-amber-500/80 mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-100 tracking-wide">Slide {activeSlide} Image Placeholder</h3>
            <p className="text-slate-400 text-sm max-w-md mt-2">
              The Google Flow watercolor illustration file <code className="text-amber-400 bg-slate-900/80 px-1.5 py-0.5 rounded text-xs">slide_{String(activeSlide).padStart(2, '0')}.jpg</code> was not found. Render your video slides on your laptop and drop them into your local path to load them here!
            </p>
          </div>
        )}

        <button 
          onClick={handleNext}
          className="absolute right-4 z-10 p-2 rounded-full bg-slate-900/60 backdrop-blur border border-slate-800 text-white hover:bg-amber-500 hover:text-slate-950 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Floating Description Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-slate-900/50">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Compass className="w-4 h-4" /> {metadata.topic}
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              {metadata.description}
            </p>
          </div>
          
          {/* Active PWA Portals Trigger */}
          {metadata.pwaPortal && (
            <div className="flex items-center">
              <a 
                href={metadata.pwaPortal}
                className="bg-amber-500 text-slate-950 hover:bg-amber-400 text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all duration-200 shadow-lg shadow-amber-500/20"
              >
                <Info className="w-3.5 h-3.5" /> GO DEEPER PORTAL
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 3. Controls & Autoplay Panel */}
      <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrev} 
            className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg shadow-amber-500/15"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button 
            onClick={handleNext} 
            className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Adjustment (Only active if playing) */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Interval Speed:</span>
          <select 
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-transparent text-xs text-amber-400 font-bold outline-none cursor-pointer focus:ring-0 border-none p-0"
          >
            <option value={2000} className="bg-slate-900">2s (Fast)</option>
            <option value={3000} className="bg-slate-900">3s (Medium)</option>
            <option value={5000} className="bg-slate-900">5s (Slow)</option>
          </select>
        </div>

        {/* Slide Progress Slider */}
        <div className="flex-1 max-w-xs w-full flex items-center gap-3">
          <input 
            type="range" 
            min={1} 
            max={totalSlides} 
            value={activeSlide}
            onChange={(e) => setActiveSlide(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Slide Coordinates Grid Modal (Drawer) */}
      {showGrid && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-30 flex flex-col p-5 transition-all duration-300 animate-in fade-in">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-md font-bold text-amber-500 flex items-center gap-2">
              <Grid className="w-5 h-5" /> Slide Directory Map (77 Coordinates)
            </h3>
            <button 
              onClick={() => setShowGrid(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {Array.from({ length: totalSlides }, (_, i) => i + 1).map((slideNum) => {
                const isActive = activeSlide === slideNum;
                // Highlight major landmark slides
                const isLandmark = [1, 6, 18, 30, 39, 48, 58, 67, 73, 76].includes(slideNum);
                
                return (
                  <button
                    key={slideNum}
                    onClick={() => {
                      setActiveSlide(slideNum);
                      setShowGrid(false);
                    }}
                    className={`aspect-video rounded flex flex-col items-center justify-center font-bold text-xs border relative transition-all duration-200 ${isActive ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-lg shadow-amber-500/20' : isLandmark ? 'bg-slate-900 text-amber-400 border-amber-500/40 hover:bg-slate-800' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {isLandmark && !isActive && (
                      <span className="absolute top-0.5 right-1 text-[8px] text-amber-500 animate-pulse">●</span>
                    )}
                    <span>{slideNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```
