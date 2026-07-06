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