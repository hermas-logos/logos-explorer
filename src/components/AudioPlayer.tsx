import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Play, Pause, Volume2, RotateCcw, SkipForward, Users, User, RefreshCw, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import { StudyProfile } from '../types';

interface AudioPlayerProps {
  podcastUrl: string;
  briefUrl: string;
  activeProfile?: StudyProfile;
}

type AudioSource = 'podcast' | 'brief';

const THEME_STYLES: Record<string, {
  text200: string;
  text400: string;
  bg600: string;
  bg600Hover: string;
  accent500: string;
  bg950: string;
  border900: string;
}> = {
  cosmic: {
    text200: "text-indigo-200",
    text400: "text-indigo-400",
    bg600: "bg-indigo-600",
    bg600Hover: "hover:bg-indigo-500",
    accent500: "accent-indigo-500",
    bg950: "bg-indigo-950/40",
    border900: "border-indigo-900/50"
  },
  emerald: {
    text200: "text-emerald-200",
    text400: "text-emerald-400",
    bg600: "bg-emerald-600",
    bg600Hover: "hover:bg-emerald-500",
    accent500: "accent-emerald-500",
    bg950: "bg-emerald-950/40",
    border900: "border-emerald-900/50"
  },
  amber: {
    text200: "text-amber-200",
    text400: "text-amber-400",
    bg600: "bg-amber-600",
    bg600Hover: "hover:bg-amber-500",
    accent500: "accent-amber-500",
    bg950: "bg-amber-950/40",
    border900: "border-amber-900/50"
  },
  vatican: {
    text200: "text-yellow-200",
    text400: "text-yellow-400",
    bg600: "bg-yellow-600",
    bg600Hover: "hover:bg-yellow-500",
    accent500: "accent-yellow-500",
    bg950: "bg-yellow-950/40",
    border900: "border-yellow-900/50"
  },
  crimson: {
    text200: "text-rose-200",
    text400: "text-rose-400",
    bg600: "bg-rose-600",
    bg600Hover: "hover:bg-rose-500",
    accent500: "accent-rose-500",
    bg950: "bg-rose-950/40",
    border900: "border-rose-900/50"
  }
};

const BRIGHT_THEME_STYLES: Record<string, {
  text200: string;
  text400: string;
  bg600: string;
  bg600Hover: string;
  accent500: string;
  bg950: string;
  border900: string;
}> = {
  cosmic: {
    text200: "text-indigo-600",
    text400: "text-indigo-500",
    bg600: "bg-indigo-600",
    bg600Hover: "hover:bg-indigo-700",
    accent500: "accent-indigo-500",
    bg950: "bg-indigo-100/60 text-indigo-700",
    border900: "border-indigo-200"
  },
  emerald: {
    text200: "text-emerald-600",
    text400: "text-emerald-500",
    bg600: "bg-emerald-600",
    bg600Hover: "hover:bg-emerald-700",
    accent500: "accent-emerald-500",
    bg950: "bg-emerald-100/60 text-emerald-700",
    border900: "border-emerald-200"
  },
  amber: {
    text200: "text-[#b45309]",
    text400: "text-[#ca8a04]",
    bg600: "bg-[#d97706]",
    bg600Hover: "hover:bg-[#b45309]",
    accent500: "accent-[#d97706]",
    bg950: "bg-[#fef3c7] text-[#92400e]",
    border900: "border-[#f59e0b]/30"
  },
  vatican: {
    text200: "text-yellow-600",
    text400: "text-yellow-500",
    bg600: "bg-yellow-600",
    bg600Hover: "hover:bg-yellow-700",
    accent500: "accent-yellow-500",
    bg950: "bg-yellow-100/60 text-yellow-700",
    border900: "border-yellow-200"
  },
  crimson: {
    text200: "text-rose-600",
    text400: "text-rose-500",
    bg600: "bg-rose-600",
    bg600Hover: "hover:bg-rose-700",
    accent500: "accent-rose-500",
    bg950: "bg-rose-100/60 text-rose-700",
    border900: "border-rose-200"
  }
};

export default function AudioPlayer({ podcastUrl, briefUrl, activeProfile }: AudioPlayerProps) {
  const [source, setSource] = useState<AudioSource>('podcast');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1);
  const [themeName, setThemeName] = useState('cosmic');
  const [brightness, setBrightness] = useState<'dark' | 'bright'>('dark');

  useEffect(() => {
    const checkThemeAndBrightness = () => {
      const storedTheme = localStorage.getItem('logos_visual_theme') || 'cosmic';
      if (storedTheme !== themeName) {
        setThemeName(storedTheme);
      }
      const storedBrightness = (localStorage.getItem('logos_brightness') as 'dark' | 'bright') || 'dark';
      if (storedBrightness !== brightness) {
        setBrightness(storedBrightness);
      }
    };
    checkThemeAndBrightness();
    
    window.addEventListener('logos_brightness_changed', checkThemeAndBrightness);
    const interval = setInterval(checkThemeAndBrightness, 1000);
    return () => {
      window.removeEventListener('logos_brightness_changed', checkThemeAndBrightness);
      clearInterval(interval);
    };
  }, [themeName, brightness]);

  const isBright = brightness === 'bright';
  const theme = isBright 
    ? (BRIGHT_THEME_STYLES[themeName] || BRIGHT_THEME_STYLES.cosmic)
    : (THEME_STYLES[themeName] || THEME_STYLES.cosmic);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const translations = {
    academic_en: {
      title: "NotebookLM Audio Overviews",
      subtitle: "Listen to simulated discussions matching the study notes",
      podcastBtn: "Two-Host Podcast",
      briefBtn: "Single Host Brief",
      podcastBadge: "Deep Conversation",
      briefBadge: "Concise Overview",
      podcastTitle: "Co-host Dialogue: Exploring Physics and Transcendence",
      briefTitle: "Executive Briefing: Constant fine-tuning and entropic bounds",
      speed: "Speed:",
      skipBack: "Skip back 15 seconds",
      skipForward: "Skip forward 15 seconds"
    },
    esl_en: {
      title: "NotebookLM Audio Guides",
      subtitle: "Listen to clear audio talks about these science topics",
      podcastBtn: "Two People Talking",
      briefBtn: "One Person Talking",
      podcastBadge: "Friendly Talk",
      briefBadge: "Short Summary",
      podcastTitle: "Conversation: Science and the Creator",
      briefTitle: "Short Talk: Why our space is perfect for life",
      speed: "Speed:",
      skipBack: "Skip back 15 seconds",
      skipForward: "Skip forward 15 seconds"
    },
    translated_es: {
      title: "Resúmenes de Audio de NotebookLM",
      subtitle: "Escuche discusiones simuladas que coinciden con las notas de estudio",
      podcastBtn: "Podcast de Dos Anfitriones",
      briefBtn: "Resumen de un Solo Anfitrión",
      podcastBadge: "Conversación Profunda",
      briefBadge: "Resumen Conciso",
      podcastTitle: "Diálogo de Coanfitriones: Explorando Física y Trascendencia",
      briefTitle: "Sesión Informativa Ejecutiva: Ajuste fino de constantes y límites entrópicos",
      speed: "Velocidad:",
      skipBack: "Retroceder 15 segundos",
      skipForward: "Adelantar 15 segundos"
    },
    translated_id: {
      title: "Ikhtisar Audio NotebookLM",
      subtitle: "Dengarkan simulasi diskusi yang sesuai dengan catatan studi",
      podcastBtn: "Podcast Dua Pembawa Acara",
      briefBtn: "Ringkasan Satu Pembawa Acara",
      podcastBadge: "Percakapan Mendalam",
      briefBadge: "Ikhtisar Ringkas",
      podcastTitle: "Dialog Pembawa Acara: Menjelajahi Fisika dan Transendensi",
      briefTitle: "Pengarahan Eksekutif: Penyelarasan konstanta dan batasan entropi",
      speed: "Kecepatan:",
      skipBack: "Putar balik 15 detik",
      skipForward: "Lompat maju 15 detik"
    }
  };

  const currentProfile = activeProfile || 'academic_en';
  const t = translations[currentProfile] || translations['academic_en'];

  const activeUrl = source === 'podcast' ? podcastUrl : briefUrl;

  // React to source change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = activeUrl;
      audioRef.current.playbackRate = speed;
      audioRef.current.volume = volume;
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [source, activeUrl]);

  // Sync speed and volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error("Audio playback interrupted:", e);
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skip = (amount: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + amount;
      if (newTime < 0) newTime = 0;
      if (newTime > duration) newTime = duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div id="audio-player-container" className="glass-card p-6 rounded-xl space-y-6">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={activeUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h3 className={`font-serif text-lg ${theme.text200} flex items-center gap-2`}>
            <Radio size={18} className={`${theme.text400} animate-pulse`} />
            {t.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">{t.subtitle}</p>
        </div>

        {/* Source Toggle Buttons */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setSource('podcast')}
            id="podcast-source-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              source === 'podcast'
                ? `${theme.bg600} text-white shadow-lg`
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users size={14} />
            {t.podcastBtn}
          </button>
          <button
            onClick={() => setSource('brief')}
            id="brief-source-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              source === 'brief'
                ? `${theme.bg600} text-white shadow-lg`
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User size={14} />
            {t.briefBtn}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Playback Controls & Waveform animation */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-900/40 rounded-xl border border-neutral-800/40">
          {/* Animated visualizer wave */}
          <div className="flex items-end justify-center gap-1 h-12 mb-4 w-40">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? {
                  height: [12, Math.random() * 36 + 12, 12]
                } : {
                  height: 6
                }}
                transition={{
                  duration: isPlaying ? 0.6 + i * 0.05 : 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-1 rounded-full ${isPlaying ? theme.bg600 : 'bg-neutral-700'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => skip(-15)}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
              title={t.skipBack}
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={togglePlay}
              className={`p-4 rounded-full ${theme.bg600} ${theme.bg600Hover} text-white shadow-lg transition-all transform hover:scale-105 active:scale-95`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>

            <button
              onClick={() => skip(15)}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
              title={t.skipForward}
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>

        {/* Scrubbing bar, volume, speed */}
        <div className="md:col-span-7 space-y-4">
          {/* Audio Title */}
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-widest ${theme.text400} font-bold ${theme.bg950} border ${theme.border900} px-2 py-0.5 rounded`}>
              {source === 'podcast' ? t.podcastBadge : t.briefBadge}
            </span>
            <h4 className="font-sans font-medium text-sm md:text-base text-neutral-100 mt-2">
              {source === 'podcast' ? t.podcastTitle : t.briefTitle}
            </h4>
          </div>

          {/* Scrubbing slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className={`w-full h-1.5 rounded-lg bg-neutral-800 appearance-none cursor-pointer ${theme.accent500} focus:outline-none`}
            />
          </div>

          {/* Sub-controls: Volume and Speed */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            {/* Speed selection */}
            <div className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
              <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
                <RefreshCw size={12} />
                {t.speed}
              </span>
              {[1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSpeed(rate)}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                    speed === rate
                      ? `${theme.bg950} ${theme.text400} border ${theme.border900}`
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Volume bar */}
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-neutral-500" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={`w-24 h-1 rounded-lg bg-neutral-800 appearance-none cursor-pointer ${theme.accent500} focus:outline-none`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
