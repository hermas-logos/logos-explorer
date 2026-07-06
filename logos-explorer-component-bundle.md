# Logos-Explorer Core Component Recovery Bundle
**Modular PWA UI Components: Audio Player, Study Profiles Hub, & Concept Mind Map**

This bundle contains the complete, production-ready React + TypeScript source code for the three missing/folder-corrupted components in your project.

By creating these as **actual files** (instead of folders), you will immediately resolve Vite's compilation crashes and unlock the full on-the-go experience on your browser!

---

## 🛠️ Step 0: Clear Out the Corrupted Folders
Before saving these files, open your blue **PowerShell** window, navigate to your project root, and run this command to safely delete the empty folders that are causing the compilation error:

**cd "D:\logos-explorer"**

**Remove-Item "src\components\AudioGuidesPlayer.tsx" -Recurse -Force; Remove-Item "src\components\MindMapGraph.tsx" -Recurse -Force; Remove-Item "src\components\StudyProfilesHub.tsx" -Recurse -Force**

*(Once the empty folders are removed, you can create these three actual files in VS Code and paste the code from below!)*

---

## 🎧 1. The Multi-Profile Audio Player: `src/components/AudioGuidesPlayer.tsx`
Create a new file in VS Code named `src/components/AudioGuidesPlayer.tsx` and paste the following code:

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Users, User, Languages } from 'lucide-react';
import { episodes } from '../data/episode'; // Matches your local database singular import

export function AudioGuidesPlayer({ episodeId }: { episodeId: string }) {
  const episode = episodes.find(e => e.id === episodeId);
  const [activeTrack, setActiveTrack] = useState<'dual' | 'dualId' | 'single'>('dual');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get active audio URL based on track choice and language availability
  const getAudioUrl = () => {
    if (!episode) return '';
    if (activeTrack === 'dualId' && episode.audioGuides.dualHostIdUrl) {
      return episode.audioGuides.dualHostIdUrl;
    }
    if (activeTrack === 'single') {
      return episode.audioGuides.singleHostUrl;
    }
    return episode.audioGuides.dualHostUrl;
  };

  const audioUrl = getAudioUrl();

  // Handle source changes safely
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(current);
    setDuration(dur);
    if (dur > 0) {
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || duration === 0) return;
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const skipTime = (amount: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + amount));
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!episode) return <div className="text-red-500">Episode not found</div>;

  return (
    <div className="flex flex-col gap-5 w-full">
      <audio 
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Track Selector Panel */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 animate-pulse text-amber-400" /> Choose Audio Presentation Profile
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Dual Host EN */}
          <button
            onClick={() => setActiveTrack('dual')}
            className={`p-3 rounded-lg border text-xs font-bold transition-all flex flex-col gap-1 items-start ${
              activeTrack === 'dual'
                ? 'border-amber-500 bg-amber-950/10 text-amber-400'
                : 'border-stone-800 bg-stone-950/10 text-stone-400 hover:border-amber-500/20 hover:text-stone-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500" />
              <span>Two People Talking (EN)</span>
            </div>
            <span className="text-[10px] text-stone-500 text-left font-normal">Conversational academic discussion</span>
          </button>

          {/* Dual Host ID */}
          {episode.audioGuides.dualHostIdUrl && (
            <button
              onClick={() => setActiveTrack('dualId')}
              className={`p-3 rounded-lg border text-xs font-bold transition-all flex flex-col gap-1 items-start ${
                activeTrack === 'dualId'
                  ? 'border-amber-500 bg-amber-950/10 text-amber-400'
                  : 'border-stone-800 bg-stone-950/10 text-stone-400 hover:border-amber-500/20 hover:text-stone-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Two People Talking (ID)</span>
              </div>
              <span className="text-[10px] text-stone-500 text-left font-normal">Indonesian translation discussion track</span>
            </button>
          )}

          {/* Single Host EN */}
          <button
            onClick={() => setActiveTrack('single')}
            className={`p-3 rounded-lg border text-xs font-bold transition-all flex flex-col gap-1 items-start ${
              activeTrack === 'single'
                ? 'border-amber-500 bg-amber-950/10 text-amber-400'
                : 'border-stone-800 bg-stone-950/10 text-stone-400 hover:border-amber-500/20 hover:text-stone-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-500" />
              <span>One Person Talking (EN)</span>
            </div>
            <span className="text-[10px] text-stone-500 text-left font-normal">Structured, academic solo overview</span>
          </button>
        </div>
      </div>

      {/* Media Controller Module */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-stone-950/40 border border-stone-900/60 shadow-inner">
        {/* Progress Timeline */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs font-mono text-stone-500 min-w-[35px] text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="flex-1 accent-amber-500 h-1 bg-stone-800 rounded-lg cursor-pointer transition-all"
          />
          <span className="text-xs font-mono text-stone-500 min-w-[35px] text-left">
            {duration > 0 ? formatTime(duration) : '0:00'}
          </span>
        </div>

        {/* Buttons and Volume Control */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Skip back 10 seconds */}
            <button
              onClick={() => skipTime(-10)}
              className="p-2 text-stone-500 hover:text-amber-500 transition-colors"
              title="Skip back 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-stone-950 transition-all shadow-lg hover:scale-105 active:scale-95 shadow-amber-500/20"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-stone-950" /> : <Play className="w-5 h-5 fill-stone-950 ml-1" />}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-stone-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-amber-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📖 2. The Study Profiles Selector: `src/components/StudyProfilesHub.tsx`
Create a new file in VS Code named `src/components/StudyProfilesHub.tsx` and paste the following code:

```tsx
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
```

---

## 🗺️ 3. The Interactive SVG Mind Map: `src/components/MindMapGraph.tsx`
Create a new file in VS Code named `src/components/MindMapGraph.tsx` and paste the following code:

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Compass, Map } from 'lucide-react';
import ep04MindMap from '../data/mindmaps/ep04-mindmap.json'; // Loads coordinates automatically

interface Node {
  id: string;
  type?: string;
  data: {
    label: string;
    description: string;
    reference?: string;
  };
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

export function MindMapGraph() {
  const [nodes] = useState<Node[]>(ep04MindMap.nodes);
  const [edges] = useState<Edge[]>(ep04MindMap.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Canvas Pan & Zoom States
  const [pan, setPan] = useState({ x: 180, y: 220 });
  const [zoom, setZoom] = useState(0.75);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-select root node at start
  useEffect(() => {
    const root = ep04MindMap.nodes.find(n => n.id === 'root');
    if (root) setSelectedNode(root);
  }, []);

  // Pan Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('.node-element')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile viewport pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('.node-element')) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  const recenterMap = () => {
    setPan({ x: 180, y: 220 });
    setZoom(0.75);
    const root = ep04MindMap.nodes.find(n => n.id === 'root');
    if (root) setSelectedNode(root);
  };

  return (
    <div className="relative w-full h-full bg-[#040301] text-stone-100 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Interactive Drag Canvas */}
      <div 
        ref={containerRef}
        className={`flex-1 w-full relative cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        
        {/* Dynamic SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {edges.map((edge) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);

              if (!sourceNode || !targetNode) return null;

              const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.position.x}
                    y1={sourceNode.position.y}
                    x2={targetNode.position.x}
                    y2={targetNode.position.y}
                    stroke={isHighlighted ? '#f59e0b' : '#331b07'}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={edge.animated ? '5,5' : undefined}
                  />
                  {edge.label && (
                    <text
                      x={(sourceNode.position.x + targetNode.position.x) / 2}
                      y={(sourceNode.position.y + targetNode.position.y) / 2 - 8}
                      fill="#d97706"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Dynamic HTML Coordinate Nodes */}
        <div 
          className="absolute inset-0 pointer-events-none origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {nodes.map((node) => {
            const isRoot = node.id === 'root';
            const isSelected = selectedNode?.id === node.id;
            
            let nodeStyle = "bg-[#0f0904] border-amber-950/80 text-amber-100 hover:border-amber-500/40";
            if (isRoot) {
              nodeStyle = "bg-amber-500 text-stone-950 border-amber-400 font-serif font-bold shadow-lg shadow-amber-500/10";
            } else if (isSelected) {
              nodeStyle = "bg-amber-950/20 border-amber-400 text-amber-200 ring-2 ring-amber-500/30";
            }

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`node-element absolute pointer-events-auto px-4 py-2.5 rounded-xl border text-xs leading-none tracking-wide text-center transition-all duration-300 flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 ${nodeStyle}`}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`,
                }}
              >
                <span>{node.data.label}</span>
                {node.data.reference && !isRoot && (
                  <span className={`text-[8px] uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                    {node.data.reference}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation and Zoom HUD */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 pointer-events-auto z-10">
        <button
          onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
          className="p-2 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 transition-colors shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
          className="p-2 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 transition-colors shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={recenterMap}
          className="p-2 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 transition-colors shadow-lg"
          title="Recenter Map"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Node Details Drawer (Mobile Aligned) */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-900/95 border border-amber-950/20 shadow-2xl backdrop-blur-md animate-slideUp pointer-events-auto z-10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase text-amber-500 font-extrabold flex items-center gap-1">
              <Map className="w-3.5 h-3.5 text-amber-400" /> Concept Node {selectedNode.data.reference ? `• ${selectedNode.data.reference}` : ''}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-stone-500 hover:text-stone-300 text-xs font-bold font-mono px-1"
            >
              &times;
            </button>
          </div>
          <h4 className="text-sm font-bold font-serif text-stone-100">{selectedNode.data.label}</h4>
          <p className="text-xs text-stone-300 leading-relaxed">{selectedNode.data.description}</p>
        </div>
      )}
    </div>
  );
}
```
