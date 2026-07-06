import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  Database, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  Github, 
  FileText, 
  Youtube, 
  Calendar, 
  Music, 
  Table, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  ExternalLink,
  Check,
  AlertCircle,
  Eye,
  Settings,
  X,
  Palette
} from 'lucide-react';
import { Episode, StudyProfile, EpisodeSource, Quotation, CustomSection, BookReview, BookChapterRecommendation } from '../types';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  episodes: Episode[];
  onUpdateEpisodes: (newEpisodes: Episode[]) => void;
  onResetEpisodes: () => void;
  currentTheme: string;
  onChangeTheme: (themeId: string) => void;
  onClose: () => void;
}

const THEMES = [
  { id: 'cosmic', name: 'Cosmic Space', desc: 'Deep obsidian and indigo stardust palette (Default)' },
  { id: 'emerald', name: 'Emerald Sanctuary', desc: 'Deep forest greens and mint, celebrating creation' },
  { id: 'amber', name: 'Solar Amber', desc: 'Rich charcoal and sand with sunrise amber highlights' },
  { id: 'vatican', name: 'Vatican Gold', desc: 'Royal dark navy and gold, evoking ancient archives' },
  { id: 'crimson', name: 'Royal Crimson', desc: 'Sacred burgundy and warm rose accents' }
];

const ACTIVE_THEME_HIGHLIGHTS: Record<string, string> = {
  cosmic: 'bg-indigo-950/20 border-indigo-500/30 text-indigo-400 font-semibold shadow-indigo-950/20',
  emerald: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 font-semibold shadow-emerald-950/20',
  amber: 'bg-amber-950/20 border-amber-500/30 text-amber-400 font-semibold shadow-amber-950/20',
  vatican: 'bg-yellow-950/10 border-yellow-500/30 text-yellow-400 font-semibold shadow-yellow-950/20',
  crimson: 'bg-rose-950/20 border-rose-500/30 text-rose-400 font-semibold shadow-rose-950/20'
};

export default function AdminDashboard({
  episodes,
  onUpdateEpisodes,
  onResetEpisodes,
  currentTheme,
  onChangeTheme,
  onClose
}: AdminDashboardProps) {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('logos_admin_logged_in') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // Editing states
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>(episodes[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'meta' | 'notebook' | 'sources' | 'quotes' | 'book_story' | 'new_section'>('meta');
  
  // State for Github Integration
  const [githubRepo, setGithubRepo] = useState(() => localStorage.getItem('logos_gh_repo') || '');
  const [githubBranch, setGithubBranch] = useState(() => localStorage.getItem('logos_gh_branch') || 'main');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('logos_gh_token') || '');
  const [githubPath, setGithubPath] = useState(() => localStorage.getItem('logos_gh_path') || 'content/episodes/01.json');
  const [githubStatus, setGithubStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Get active editing episode
  const activeEpisodeIndex = episodes.findIndex(ep => ep.id === selectedEpisodeId);
  const activeEpisode = activeEpisodeIndex !== -1 ? episodes[activeEpisodeIndex] : null;

  // Notification Banner State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'logos123') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('logos_admin_logged_in', 'true');
      triggerNotification('Successfully authenticated as administrator');
    } else {
      setLoginError('Invalid Administrator Credential. Hint: "logos123"');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('logos_admin_logged_in');
  };

  const saveToState = (updatedEpisode: Episode) => {
    const updated = [...episodes];
    const index = updated.findIndex(ep => ep.id === updatedEpisode.id);
    if (index !== -1) {
      updated[index] = updatedEpisode;
    } else {
      updated.push(updatedEpisode);
    }
    onUpdateEpisodes(updated);
    triggerNotification('Episode changes saved successfully');
  };

  // 1. Meta Updates
  const handleMetaChange = (field: keyof Episode | 'title_profile' | 'desc_profile', profile?: StudyProfile, val?: string) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    if (field === 'title_profile' && profile && val !== undefined) {
      updated.title = { ...updated.title, [profile]: val };
    } else if (field === 'desc_profile' && profile && val !== undefined) {
      updated.description = { ...updated.description, [profile]: val };
    } else if (field === 'publish_date' && val !== undefined) {
      updated.publish_date = val;
    } else if (field === 'youtube_video_id' && val !== undefined) {
      updated.youtube_video_id = val;
    } else if (field === 'id' && val !== undefined) {
      updated.id = val;
      setSelectedEpisodeId(val);
    }
    saveToState(updated);
  };

  // Create empty new episode
  const createNewEpisode = () => {
    const nextId = String(episodes.length + 1).padStart(2, '0');
    const newEp: Episode = {
      id: nextId,
      title: {
        academic_en: `Episode ${nextId}: Custom Scholarly Dialogue`,
        esl_en: `Episode ${nextId}: Simple Overview`,
        translated_es: `Episodio ${nextId}: Diálogo Académico Personalizado`,
        translated_id: `Episode ${nextId}: Dialog Akademis Kustom`
      },
      description: {
        academic_en: "An advanced, teleological study module examining the relationship between scientific parameters and physical law.",
        esl_en: "A simple talk about why physics and chemistry have perfect rules for our world.",
        translated_es: "Un módulo de estudio teleológico avanzado que examina la relación entre los parámetros científicos y la ley física.",
        translated_id: "Modul studi teologis tingkat lanjut yang menyelidiki hubungan antara parameter ilmiah dan hukum fisika."
      },
      publish_date: new Date().toISOString().split('T')[0],
      youtube_video_id: "U2q0L6K77-w",
      audio_overview: {
        podcast_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        brief_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        podcast_url_by_profile: {
          academic_en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          esl_en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
          translated_es: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          translated_id: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
        },
        brief_url_by_profile: {
          academic_en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          esl_en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
          translated_es: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
          translated_id: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
        }
      },
      scenes: [],
      inspiring_quotations: [],
      study_modules: {
        mind_map: {
          academic_en: { label: "The Logos Divine Concept" },
          esl_en: { label: "God's Intelligence" },
          translated_es: { label: "El Logos Divino" },
          translated_id: { label: "Logos Ilahi" }
        },
        infographic: {
          academic_en: { title: "Cosmic Pillars", metrics: [], takeaways: [] },
          esl_en: { title: "Simple Takeaways", metrics: [], takeaways: [] },
          translated_es: { title: "Pilares Cósmicos", metrics: [], takeaways: [] },
          translated_id: { title: "Pilar Kosmis", metrics: [], takeaways: [] }
        },
        slide_decks: [],
        specialized_reports: {
          academic_en: { title: "Scholarly Report", body: "Scientific details go here." },
          esl_en: { title: "Simple Report", body: "Simple explanations go here." },
          translated_es: { title: "Informe Académico", body: "Detalles científicos van aquí." },
          translated_id: { title: "Laporan Akademis", body: "Detail ilmiah ditulis di sini." }
        },
        data_table: {
          headers: {
            academic_en: ["Constant", "Symbol", "Value", "Tolerance", "Implication"],
            esl_en: ["Constant", "Symbol", "Value", "Tolerance", "Implication"],
            translated_es: ["Constant", "Symbol", "Value", "Tolerance", "Implication"],
            translated_id: ["Constant", "Symbol", "Value", "Tolerance", "Implication"]
          },
          rows: []
        },
        creator_reflection: {
          academic_en: "Personal reflections from the creator regarding deep teleological frameworks.",
          esl_en: "A simple note from the host.",
          translated_es: "Reflexiones personales del creador sobre marcos teleológicos profundos.",
          translated_id: "Refleksi pribadi dari pembuat konten mengenai kerangka teologis yang mendalam."
        }
      }
    };

    const updated = [...episodes, newEp];
    onUpdateEpisodes(updated);
    setSelectedEpisodeId(newEp.id);
    triggerNotification(`Created Episode ${nextId}!`);
  };

  const deleteEpisode = (id: string) => {
    if (confirm(`Are you absolutely sure you want to delete Episode ${id}?`)) {
      const updated = episodes.filter(ep => ep.id !== id);
      onUpdateEpisodes(updated);
      if (selectedEpisodeId === id && updated.length > 0) {
        setSelectedEpisodeId(updated[0].id);
      }
      triggerNotification('Episode deleted successfully');
    }
  };

  // 2. Audio Overview Updates
  const handleAudioChange = (type: 'podcast' | 'brief', val: string, profile?: StudyProfile) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    
    if (profile) {
      if (type === 'podcast') {
        updated.audio_overview.podcast_url_by_profile = {
          ...updated.audio_overview.podcast_url_by_profile,
          [profile]: val
        };
      } else {
        updated.audio_overview.brief_url_by_profile = {
          ...updated.audio_overview.brief_url_by_profile,
          [profile]: val
        };
      }
    } else {
      if (type === 'podcast') {
        updated.audio_overview.podcast_url = val;
      } else {
        updated.audio_overview.brief_url = val;
      }
    }
    saveToState(updated);
  };

  // 3. Single Source Updates
  const handleAddSource = () => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    const currentSources = updated.sources || [];
    const newSource: EpisodeSource = {
      title: "New Research Source / Scholarly Paper",
      description: "Brief overview of how this publication establishes scientific variables.",
      url: "https://arxiv.org"
    };
    updated.sources = [...currentSources, newSource];
    saveToState(updated);
  };

  const handleSourceChange = (index: number, field: keyof EpisodeSource, val: string) => {
    if (!activeEpisode || !activeEpisode.sources) return;
    const updated = { ...activeEpisode };
    const list = [...activeEpisode.sources];
    list[index] = { ...list[index], [field]: val };
    updated.sources = list;
    saveToState(updated);
  };

  const handleDeleteSource = (index: number) => {
    if (!activeEpisode || !activeEpisode.sources) return;
    const updated = { ...activeEpisode };
    updated.sources = activeEpisode.sources.filter((_, idx) => idx !== index);
    saveToState(updated);
  };

  // 4. Quotations Updates
  const handleAddQuotation = () => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    const newQuote: Quotation = {
      author: "New Scholar/Philosopher",
      historical_role: "Theologian or Scientist",
      quote_text: {
        academic_en: "Classic quote regarding the Logos order of the physical cosmos.",
        esl_en: "A simple quote about the order of nature.",
        translated_es: "Cita clásica sobre el orden del Logos del cosmos físico.",
        translated_id: "Kutipan klasik tentang keteraturan Logos di alam semesta fisik."
      }
    };
    updated.inspiring_quotations = [...updated.inspiring_quotations, newQuote];
    saveToState(updated);
  };

  const handleQuotationChange = (index: number, field: 'author' | 'historical_role' | 'quote_text', val: string, profile?: StudyProfile) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    const list = [...updated.inspiring_quotations];
    if (field === 'quote_text' && profile) {
      list[index] = {
        ...list[index],
        quote_text: {
          ...list[index].quote_text,
          [profile]: val
        }
      };
    } else if (field !== 'quote_text') {
      list[index] = { ...list[index], [field]: val };
    }
    updated.inspiring_quotations = list;
    saveToState(updated);
  };

  const handleDeleteQuotation = (index: number) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    updated.inspiring_quotations = updated.inspiring_quotations.filter((_, idx) => idx !== index);
    saveToState(updated);
  };

  // 5. Book Review & Inspiring Story Updates
  const handleBookReviewChange = (field: keyof BookReview, val: any, profile: StudyProfile, extraIndex?: number, extraField?: string) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    
    // Ensure book_review container exists
    if (!updated.study_modules.book_review) {
      updated.study_modules.book_review = {
        academic_en: { title: "", author: "", publish_year: "", rating: 5, overview: "", key_takeaways: [], scientific_theological_alignment: "", recommended_chapters: [] },
        esl_en: { title: "", author: "", publish_year: "", rating: 5, overview: "", key_takeaways: [], scientific_theological_alignment: "", recommended_chapters: [] },
        translated_es: { title: "", author: "", publish_year: "", rating: 5, overview: "", key_takeaways: [], scientific_theological_alignment: "", recommended_chapters: [] },
        translated_id: { title: "", author: "", publish_year: "", rating: 5, overview: "", key_takeaways: [], scientific_theological_alignment: "", recommended_chapters: [] }
      };
    }

    const currentReview = { ...updated.study_modules.book_review[profile] };

    if (field === 'key_takeaways') {
      currentReview.key_takeaways = val;
    } else if (field === 'recommended_chapters' && extraIndex !== undefined && extraField) {
      const chapters = [...currentReview.recommended_chapters];
      chapters[extraIndex] = { ...chapters[extraIndex], [extraField]: val };
      currentReview.recommended_chapters = chapters;
    } else if (field === 'recommended_chapters' && val === 'add') {
      currentReview.recommended_chapters = [...currentReview.recommended_chapters, { chapter: "Chapter name", description: "Review point" }];
    } else if (field === 'recommended_chapters' && typeof val === 'number') {
      // delete
      currentReview.recommended_chapters = currentReview.recommended_chapters.filter((_, idx) => idx !== val);
    } else {
      // @ts-ignore
      currentReview[field] = val;
    }

    updated.study_modules.book_review = {
      ...updated.study_modules.book_review,
      [profile]: currentReview
    };

    saveToState(updated);
  };

  const handleStoryChange = (profile: StudyProfile, val: string) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    updated.study_modules.inspiring_story = {
      ...updated.study_modules.inspiring_story,
      academic_en: updated.study_modules.inspiring_story?.academic_en || "",
      esl_en: updated.study_modules.inspiring_story?.esl_en || "",
      translated_es: updated.study_modules.inspiring_story?.translated_es || "",
      translated_id: updated.study_modules.inspiring_story?.translated_id || "",
      [profile]: val
    };
    saveToState(updated);
  };

  const handleReflectionChange = (profile: StudyProfile, val: string) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    updated.study_modules.creator_reflection = {
      ...updated.study_modules.creator_reflection,
      [profile]: val
    };
    saveToState(updated);
  };

  // 6. Custom Tab / New Section Addition
  const handleAddCustomSection = (label: string) => {
    if (!activeEpisode) return;
    const updated = { ...activeEpisode };
    const currentSections = updated.study_modules.custom_sections || [];
    const newSection: CustomSection = {
      id: `custom_${Date.now()}`,
      label,
      content: {
        academic_en: "Scholarly material for the custom tab goes here.",
        esl_en: "Simple explanations for the custom tab go here.",
        translated_es: "El material de estudio de la pestaña personalizada va aquí.",
        translated_id: "Konten studi kustom ditulis di sini."
      }
    };
    updated.study_modules.custom_sections = [...currentSections, newSection];
    saveToState(updated);
  };

  const handleCustomSectionContentChange = (id: string, profile: StudyProfile, val: string) => {
    if (!activeEpisode || !activeEpisode.study_modules.custom_sections) return;
    const updated = { ...activeEpisode };
    const list = activeEpisode.study_modules.custom_sections.map(sec => {
      if (sec.id === id) {
        return {
          ...sec,
          content: { ...sec.content, [profile]: val }
        };
      }
      return sec;
    });
    updated.study_modules.custom_sections = list;
    saveToState(updated);
  };

  const handleDeleteCustomSection = (id: string) => {
    if (!activeEpisode || !activeEpisode.study_modules.custom_sections) return;
    const updated = { ...activeEpisode };
    updated.study_modules.custom_sections = activeEpisode.study_modules.custom_sections.filter(sec => sec.id !== id);
    saveToState(updated);
  };

  // 7. GitHub Integration trigger
  const handleGitHubSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubRepo || !githubToken) {
      setGithubStatus({ type: 'error', message: 'GitHub Repo and PAT Token are required.' });
      return;
    }

    setGithubStatus({ type: 'loading', message: 'Contacting GitHub API...' });

    // Store settings
    localStorage.setItem('logos_gh_repo', githubRepo);
    localStorage.setItem('logos_gh_branch', githubBranch);
    localStorage.setItem('logos_gh_token', githubToken);
    localStorage.setItem('logos_gh_path', githubPath);

    try {
      // 1. Get SHA of current file
      const getFileUrl = `https://api.github.com/repos/${githubRepo}/contents/${githubPath}`;
      const response = await fetch(getFileUrl, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      let sha = '';
      if (response.ok) {
        const fileData = await response.json();
        sha = fileData.sha;
      } else if (response.status !== 404) {
        throw new Error(`Failed to check file: ${response.statusText}`);
      }

      // 2. Format content of the consolidated json (for the active selected episode or full set)
      // Standard output of episodes:
      const updatedEpisodesJson = JSON.stringify(episodes, null, 2);

      // 3. Put File
      const putResponse = await fetch(getFileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update episodes data from Logos-Explorer Admin Dashboard`,
          content: btoa(unescape(encodeURIComponent(updatedEpisodesJson))),
          sha: sha || undefined,
          branch: githubBranch
        })
      });

      if (!putResponse.ok) {
        const errDetails = await putResponse.json();
        throw new Error(errDetails.message || 'Error updating repository');
      }

      setGithubStatus({ 
        type: 'success', 
        message: `Successfully pushed updated episodes data to branch: "${githubBranch}"` 
      });
      triggerNotification('GitHub Repository updated successfully!');
    } catch (err: any) {
      console.error(err);
      setGithubStatus({ type: 'error', message: err.message || 'Connection or credential error' });
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(episodes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "episodes.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification('Consolidated episodes.json generated for download');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(episodes, null, 2));
    triggerNotification('Full episodes JSON copied to clipboard!');
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-[#040406]/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#0b0b11] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6 relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-900/60 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-950/50">
              <Lock size={22} />
            </div>
            <h2 className="font-serif text-xl font-bold text-neutral-100">Logos Admin Console</h2>
            <p className="text-xs text-neutral-400">Please authenticate to configure the Logos-Explorer</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Security Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input
                  type="password"
                  placeholder="Enter administrator password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-neutral-200 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-neutral-600"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-red-300 text-xs font-mono">
                <AlertCircle size={14} className="text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-950/50 transition-all flex items-center justify-center gap-2"
            >
              <Database size={15} />
              Unlock Console
            </button>
          </form>

          <div className="text-center">
            <p className="text-[10px] font-mono text-neutral-600">
              Default password: <span className="text-indigo-400">logos123</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#030305]/98 backdrop-blur-xl z-50 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-900 bg-[#09090f] text-indigo-200 text-xs font-mono shadow-2xl animate-fade-in">
          <Check size={14} className="text-indigo-400" />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="w-full max-w-6xl space-y-8 flex flex-col flex-grow">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-5 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2.5 py-1 rounded">
                Admin Console
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                PWA LocalStorage Engine
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-neutral-100 flex items-center gap-2.5">
              <Database className="text-indigo-400" size={24} />
              Logos-Explorer Studio Creator
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-mono transition-all"
            >
              Lock Console
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-950/50 transition-all"
            >
              Close Panel
            </button>
          </div>
        </div>

        {/* Outer Layout Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start flex-grow">
          
          {/* Sidebar Left: Selection of Episodes & General App Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Visual Theme Selector Card */}
            <div className="bg-[#08080c] border border-neutral-800 rounded-xl p-4 space-y-4">
              <h3 className="font-serif text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <Palette size={14} className={
                  currentTheme === 'cosmic' ? 'text-indigo-400' :
                  currentTheme === 'emerald' ? 'text-emerald-400' :
                  currentTheme === 'amber' ? 'text-amber-400' :
                  currentTheme === 'vatican' ? 'text-yellow-400' : 'text-rose-400'
                } />
                Visual Interface Theme
              </h3>
              <div className="space-y-1.5">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onChangeTheme(theme.id);
                      triggerNotification(`Changed visual theme to "${theme.name}"`);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all border ${
                      currentTheme === theme.id
                        ? (ACTIVE_THEME_HIGHLIGHTS[theme.id] || ACTIVE_THEME_HIGHLIGHTS.cosmic)
                        : 'bg-neutral-950 border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-900'
                    }`}
                  >
                    <div className="font-bold">{theme.name}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{theme.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Episode List Box */}
            <div className="bg-[#08080c] border border-neutral-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-semibold text-neutral-200 flex items-center gap-2">
                  <Layers size={14} className="text-indigo-400" />
                  Episode Registry
                </h3>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 border border-neutral-900 px-1.5 py-0.5 rounded">
                  {episodes.length} Total
                </span>
              </div>

              <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
                {episodes.map((ep) => (
                  <div 
                    key={ep.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all border ${
                      selectedEpisodeId === ep.id
                        ? 'bg-indigo-950/20 border-indigo-900/60 text-indigo-300'
                        : 'bg-neutral-950 border-transparent hover:bg-neutral-900/40 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedEpisodeId(ep.id)}
                      className="text-left flex-grow text-xs truncate font-mono mr-2"
                    >
                      EP {ep.id}: {ep.title.academic_en.split(':')[1]?.trim() || ep.title.academic_en}
                    </button>
                    <button
                      onClick={() => deleteEpisode(ep.id)}
                      disabled={episodes.length <= 1}
                      className="text-neutral-600 hover:text-red-400 disabled:opacity-30 p-1"
                      title="Delete Episode"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={createNewEpisode}
                className="w-full py-2 rounded-lg bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-indigo-950 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={13} />
                Create New Episode
              </button>
            </div>

            {/* Quick backup / export tools */}
            <div className="bg-[#08080c] border border-neutral-800 rounded-xl p-4 space-y-3">
              <h3 className="font-serif text-sm font-semibold text-neutral-200">
                Data Utilities
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={handleExportJSON}
                  className="w-full py-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 text-[11px] font-mono text-neutral-300 rounded-lg hover:text-white transition-colors"
                >
                  Generate & Download JSON
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="w-full py-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 text-[11px] font-mono text-neutral-300 rounded-lg hover:text-white transition-colors"
                >
                  Copy JSON to Clipboard
                </button>
                <button
                  onClick={onResetEpisodes}
                  className="w-full py-2 bg-red-950/10 border border-red-900/30 hover:bg-red-950/20 text-[11px] font-mono text-red-300 rounded-lg transition-colors"
                >
                  Reset Cache to Default
                </button>
              </div>
            </div>

          </div>

          {/* Main Content Area Right: The editor and sub tabs */}
          <div className="lg:col-span-3 space-y-6">
            
            {activeEpisode ? (
              <div className="bg-[#08080c] border border-neutral-800 rounded-2xl p-6 space-y-6">
                
                {/* Active Episode Indicator banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Currently Modifying:</span>
                    <h2 className="font-serif text-lg font-bold text-neutral-100 flex items-center gap-2">
                      <BookOpen className="text-indigo-400" size={16} />
                      Episode {activeEpisode.id} Study Module
                    </h2>
                  </div>
                  
                  {/* Local state save indicator */}
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono bg-emerald-950/20 border border-emerald-900/40 px-3 py-1 rounded-lg">
                    <Check size={14} />
                    <span>Auto-Saved to Live Workspace</span>
                  </div>
                </div>

                {/* Main Tab bar for the selected Episode's configuration */}
                <div className="flex items-center overflow-x-auto border-b border-neutral-800 pb-px gap-1 custom-scrollbar">
                  <button
                    onClick={() => setActiveSubTab('meta')}
                    className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      activeSubTab === 'meta'
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10 font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950'
                    }`}
                  >
                    <Settings size={12} />
                    Metadata
                  </button>
                  <button
                    onClick={() => setActiveSubTab('notebook')}
                    className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      activeSubTab === 'notebook'
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10 font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950'
                    }`}
                  >
                    <Music size={12} />
                    NotebookLM Materials
                  </button>
                  <button
                    onClick={() => setActiveSubTab('sources')}
                    className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      activeSubTab === 'sources'
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10 font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950'
                    }`}
                  >
                    <Database size={12} />
                    Sources Used
                  </button>
                  <button
                    onClick={() => setActiveSubTab('quotes')}
                    className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      activeSubTab === 'quotes'
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10 font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950'
                    }`}
                  >
                    <Sparkles size={12} />
                    Quotations
                  </button>
                  <button
                    onClick={() => setActiveSubTab('book_story')}
                    className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      activeSubTab === 'book_story'
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10 font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950'
                    }`}
                  >
                    <FileText size={12} />
                    Reviews, Stories & Reflections
                  </button>
                  <button
                    onClick={() => setActiveSubTab('new_section')}
                    className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                      activeSubTab === 'new_section'
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10 font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950'
                    }`}
                  >
                    <Plus size={12} />
                    Add Custom Section
                  </button>
                </div>

                {/* Sub Tab Panel Router */}
                <div className="space-y-6 pt-3 min-h-[400px]">
                  
                  {/* TAB 1: METADATA & PROFILE-SPECIFIC NAMES/DESCRIPTIONS */}
                  {activeSubTab === 'meta' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-neutral-400">Episode ID</label>
                          <input
                            type="text"
                            value={activeEpisode.id}
                            onChange={(e) => handleMetaChange('id', undefined, e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-neutral-400">Publish Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                            <input
                              type="date"
                              value={activeEpisode.publish_date}
                              onChange={(e) => handleMetaChange('publish_date', undefined, e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-neutral-400">YouTube Video ID</label>
                          <div className="relative">
                            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                            <input
                              type="text"
                              value={activeEpisode.youtube_video_id}
                              onChange={(e) => handleMetaChange('youtube_video_id', undefined, e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Multi-Profile Titles & Descriptions */}
                      <div className="space-y-4 pt-4 border-t border-neutral-900">
                        <h4 className="font-serif text-sm font-semibold text-neutral-200">Localized Title & Description Definitions</h4>
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-mono">
                          Logos-Explorer requires distinct, high-fidelity titles and summaries for each target user demographic.
                        </p>
                        
                        {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((prof) => (
                          <div key={prof} className="p-4 rounded-xl border border-neutral-900 bg-[#060609] space-y-3">
                            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                              {prof === 'academic_en' && 'College Academic Profile (English)'}
                              {prof === 'esl_en' && 'Accessible / ESL Profile (English)'}
                              {prof === 'translated_es' && 'Español (Spanish Translation)'}
                              {prof === 'translated_id' && 'Bahasa Indonesia (Indonesian Translation)'}
                            </span>
                            
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase">Interactive Title</label>
                              <input
                                type="text"
                                value={activeEpisode.title[prof] || ''}
                                onChange={(e) => handleMetaChange('title_profile', prof, e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase">Brief Abstract</label>
                              <textarea
                                value={activeEpisode.description[prof] || ''}
                                onChange={(e) => handleMetaChange('desc_profile', prof, e.target.value)}
                                rows={2}
                                className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* TAB 2: NOTEBOOKLM MATERIALS (Audio, Data Table, etc.) */}
                  {activeSubTab === 'notebook' && (
                    <div className="space-y-6">
                      <div className="bg-[#060609] border border-neutral-900 p-4 rounded-xl space-y-4">
                        <div className="flex items-center gap-2">
                          <Music size={16} className="text-indigo-400" />
                          <h4 className="font-serif text-sm font-semibold text-neutral-200">Audio Overviews (NotebookLM Podcasts & Briefings)</h4>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-mono">
                          Specify URL coordinates for host discussions and summarized briefings. Standard URL or dynamic profile-specific overrides are supported.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase">Default Audio Podcast URL</label>
                            <input
                              type="text"
                              value={activeEpisode.audio_overview?.podcast_url || ''}
                              onChange={(e) => handleAudioChange('podcast', e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase">Default Summary Briefing URL</label>
                            <input
                              type="text"
                              value={activeEpisode.audio_overview?.brief_url || ''}
                              onChange={(e) => handleAudioChange('brief', e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Profiles Override Links */}
                        <div className="space-y-3 pt-3 border-t border-neutral-900">
                          <h5 className="text-[10px] font-mono text-neutral-400 uppercase">Demographic Audio Overrides</h5>
                          {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((p) => (
                            <div key={p} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <input
                                type="text"
                                placeholder={`Podcast override URL for ${p}...`}
                                value={activeEpisode.audio_overview?.podcast_url_by_profile?.[p] || ''}
                                onChange={(e) => handleAudioChange('podcast', e.target.value, p)}
                                className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1 text-[11px] text-neutral-300 font-mono focus:outline-none focus:border-indigo-500"
                              />
                              <input
                                type="text"
                                placeholder={`Brief override URL for ${p}...`}
                                value={activeEpisode.audio_overview?.brief_url_by_profile?.[p] || ''}
                                onChange={(e) => handleAudioChange('brief', e.target.value, p)}
                                className="bg-neutral-950 border border-neutral-900 rounded-lg px-2.5 py-1 text-[11px] text-neutral-300 font-mono focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mind Map, Slides, Infographics, etc. */}
                      <div className="p-4 rounded-xl border border-neutral-900 bg-[#060609] space-y-4">
                        <div className="flex items-center gap-2">
                          <Table size={16} className="text-indigo-400" />
                          <h4 className="font-serif text-sm font-semibold text-neutral-200">Physical Constants Data Table</h4>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                          Verify data points representing fine-tuning properties. Click "Add Custom Section" to build bespoke modules if you want to configure slide structure or custom visuals.
                        </p>
                        
                        <div className="border border-neutral-850 rounded-lg overflow-hidden bg-neutral-950">
                          <table className="w-full text-left text-[11px]">
                            <thead className="bg-[#0c0c12] border-b border-neutral-850 text-neutral-400 uppercase font-mono tracking-wider">
                              <tr>
                                <th className="p-2">Constant</th>
                                <th className="p-2">Symbol</th>
                                <th className="p-2">Precision Value</th>
                                <th className="p-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeEpisode.study_modules.data_table?.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-neutral-900 text-neutral-300 font-mono">
                                  <td className="p-2 truncate max-w-[120px]">{row.constant.academic_en}</td>
                                  <td className="p-2">{row.symbol}</td>
                                  <td className="p-2">{row.value}</td>
                                  <td className="p-2">
                                    <button 
                                      onClick={() => {
                                        const updated = { ...activeEpisode };
                                        updated.study_modules.data_table.rows = updated.study_modules.data_table.rows.filter((_, i) => i !== idx);
                                        saveToState(updated);
                                      }}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {(!activeEpisode.study_modules.data_table?.rows || activeEpisode.study_modules.data_table.rows.length === 0) && (
                                <tr>
                                  <td colSpan={4} className="p-3 text-center text-neutral-600">No rows configured. Use "Reset Cache" to inspect pre-seeded values.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <button
                          onClick={() => {
                            const updated = { ...activeEpisode };
                            const newRow = {
                              constant: { academic_en: "Cosmological Constant", esl_en: "Space Speed", translated_es: "Constante", translated_id: "Konstanta" },
                              symbol: "Λ",
                              value: "10^-120",
                              tolerance: { academic_en: "1 in 10^120", esl_en: "Very narrow", translated_es: "1 en 10^120", translated_id: "1 di 10^120" },
                              implication: { academic_en: "Expansion speeds", esl_en: "Perfect stars", translated_es: "Estrellas perfectas", translated_id: "Bintang sempurna" }
                            };
                            updated.study_modules.data_table.rows = [...(updated.study_modules.data_table.rows || []), newRow];
                            saveToState(updated);
                          }}
                          className="px-3 py-1.5 rounded bg-indigo-950/40 border border-indigo-900/40 hover:bg-indigo-900/40 text-[10px] font-mono font-bold text-indigo-300"
                        >
                          + Seed Mock Tuning Row
                        </button>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: SOURCES USED */}
                  {activeSubTab === 'sources' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm font-semibold text-neutral-200">Literature & Scholarly Sources Utilized</h4>
                        <button
                          onClick={handleAddSource}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus size={12} /> Add Source
                        </button>
                      </div>
                      
                      <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                        Expose the real publications, books, or database URLs backing the theological or astrophysical claims in this episode.
                      </p>

                      <div className="space-y-4">
                        {(activeEpisode.sources || []).map((source, index) => (
                          <div key={index} className="p-4 rounded-xl border border-neutral-900 bg-[#060609] space-y-3 relative group">
                            <button
                              onClick={() => handleDeleteSource(index)}
                              className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 transition-colors"
                              title="Delete Source"
                            >
                              <Trash2 size={14} />
                            </button>
                            <span className="text-[10px] font-mono text-indigo-400 font-bold">SOURCE 0{index + 1}</span>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-neutral-500 uppercase">Source Title</label>
                                <input
                                  type="text"
                                  value={source.title}
                                  onChange={(e) => handleSourceChange(index, 'title', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-850 rounded px-2 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-neutral-500 uppercase">Target URI Link</label>
                                <input
                                  type="text"
                                  value={source.url}
                                  onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-850 rounded px-2 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase">Scientific Context Description</label>
                              <textarea
                                value={source.description}
                                onChange={(e) => handleSourceChange(index, 'description', e.target.value)}
                                rows={2}
                                className="w-full bg-neutral-950 border border-neutral-850 rounded px-2 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans resize-none"
                              />
                            </div>
                          </div>
                        ))}

                        {(!activeEpisode.sources || activeEpisode.sources.length === 0) && (
                          <div className="text-center py-12 bg-neutral-950/20 border border-dashed border-neutral-900 rounded-xl">
                            <Database size={24} className="mx-auto text-neutral-700 mb-2 stroke-1" />
                            <p className="text-xs text-neutral-500">No external scholarly references documented for this module.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: QUOTATIONS */}
                  {activeSubTab === 'quotes' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm font-semibold text-neutral-200">Inspiring Historical Quotations</h4>
                        <button
                          onClick={handleAddQuotation}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus size={12} /> Add Quote
                        </button>
                      </div>

                      <div className="space-y-6">
                        {activeEpisode.inspiring_quotations.map((quote, index) => (
                          <div key={index} className="p-4 rounded-xl border border-neutral-900 bg-[#060609] space-y-4 relative">
                            <button
                              onClick={() => handleDeleteQuotation(index)}
                              className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 transition-colors"
                              title="Delete Quotation"
                            >
                              <Trash2 size={14} />
                            </button>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-indigo-400 font-bold">HISTORICAL QUOTE 0{index + 1}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-neutral-500 uppercase">Author Name</label>
                                <input
                                  type="text"
                                  value={quote.author}
                                  onChange={(e) => handleQuotationChange(index, 'author', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-850 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-neutral-500 uppercase">Historical Role / Academic Status</label>
                                <input
                                  type="text"
                                  value={quote.historical_role}
                                  onChange={(e) => handleQuotationChange(index, 'historical_role', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-850 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-neutral-900">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block">Localized Translation Blocks</label>
                              {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((p) => (
                                <div key={p} className="flex gap-2 items-center text-xs">
                                  <span className="w-24 text-[9px] font-mono text-neutral-500 shrink-0 uppercase">{p}:</span>
                                  <input
                                    type="text"
                                    value={quote.quote_text[p] || ''}
                                    onChange={(e) => handleQuotationChange(index, 'quote_text', e.target.value, p)}
                                    placeholder={`Quote text in ${p}...`}
                                    className="w-full bg-neutral-950 border border-neutral-900 rounded px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {activeEpisode.inspiring_quotations.length === 0 && (
                          <div className="text-center py-12 bg-neutral-950/20 border border-dashed border-neutral-900 rounded-xl">
                            <Sparkles size={24} className="mx-auto text-neutral-700 mb-2 stroke-1" />
                            <p className="text-xs text-neutral-500">No quotes added yet. Create inspiring citations for this module.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: REVIEWS, STORIES & REFLECTIONS */}
                  {activeSubTab === 'book_story' && (
                    <div className="space-y-8">
                      
                      {/* Inspiring Story Section */}
                      <div className="p-5 rounded-xl border border-neutral-900 bg-[#060609] space-y-4">
                        <h4 className="font-serif text-sm font-semibold text-indigo-300 flex items-center gap-2">
                          <Sparkles size={14} />
                          Featured Inspiring Story (Philosophical Narrative)
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                          Add a beautiful, narrative-driven story emphasizing the connection of physical laws to faith and divine logic.
                        </p>

                        <div className="space-y-4">
                          {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((p) => (
                            <div key={p} className="space-y-1.5">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase">
                                Narrative Block [{p.toUpperCase()}]
                              </label>
                              <textarea
                                value={activeEpisode.study_modules.inspiring_story?.[p] || ''}
                                onChange={(e) => handleStoryChange(p, e.target.value)}
                                rows={3}
                                placeholder="Once upon a time, a cosmologist looked at the fine-tuned constant..."
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Creator Reflection Area */}
                      <div className="p-5 rounded-xl border border-neutral-900 bg-[#060609] space-y-4">
                        <h4 className="font-serif text-sm font-semibold text-indigo-300 flex items-center gap-2">
                          <FileText size={14} />
                          Host / Creator Theological Reflection Notes
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                          The creator reflection panel is always visible at the base of the episode, offering core takeaways.
                        </p>

                        <div className="space-y-4">
                          {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((p) => (
                            <div key={p} className="space-y-1.5">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase">
                                Reflection Outline [{p.toUpperCase()}]
                              </label>
                              <textarea
                                value={activeEpisode.study_modules.creator_reflection[p] || ''}
                                onChange={(e) => handleReflectionChange(p, e.target.value)}
                                rows={3}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-sans resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Book Review Form */}
                      <div className="p-5 rounded-xl border border-neutral-900 bg-[#060609] space-y-4">
                        <h4 className="font-serif text-sm font-semibold text-indigo-300 flex items-center gap-2">
                          <BookOpen size={14} />
                          Selected Literature Review (Bridging Science and Creation)
                        </h4>
                        
                        {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((p) => {
                          const review = activeEpisode.study_modules.book_review?.[p] || { title: "", author: "", publish_year: "", rating: 5, overview: "", key_takeaways: [], scientific_theological_alignment: "", recommended_chapters: [] };
                          return (
                            <div key={p} className="p-4 rounded-lg bg-neutral-950 border border-neutral-900 space-y-3">
                              <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">Book Review [{p}]</span>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <input
                                  type="text"
                                  placeholder="Book Title"
                                  value={review.title || ''}
                                  onChange={(e) => handleBookReviewChange('title', e.target.value, p)}
                                  className="bg-[#0c0c12] border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                                />
                                <input
                                  type="text"
                                  placeholder="Author"
                                  value={review.author || ''}
                                  onChange={(e) => handleBookReviewChange('author', e.target.value, p)}
                                  className="bg-[#0c0c12] border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                                />
                                <input
                                  type="text"
                                  placeholder="Year"
                                  value={review.publish_year || ''}
                                  onChange={(e) => handleBookReviewChange('publish_year', e.target.value, p)}
                                  className="bg-[#0c0c12] border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200"
                                />
                                <select
                                  value={review.rating || 5}
                                  onChange={(e) => handleBookReviewChange('rating', Number(e.target.value), p)}
                                  className="bg-[#0c0c12] border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300"
                                >
                                  <option value={5}>5 Stars</option>
                                  <option value={4}>4 Stars</option>
                                  <option value={3}>3 Stars</option>
                                </select>
                              </div>
                              <textarea
                                placeholder="Summary overview of the text's thesis..."
                                value={review.overview || ''}
                                onChange={(e) => handleBookReviewChange('overview', e.target.value, p)}
                                rows={2}
                                className="w-full bg-[#0c0c12] border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-200 resize-none"
                              />
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {/* TAB 6: NEW SECTION (ADD CUSTOM ASSET TAB) */}
                  {activeSubTab === 'new_section' && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-xl border border-indigo-900/20 bg-gradient-to-r from-indigo-950/20 to-neutral-950 space-y-4">
                        <div className="flex items-center gap-2">
                          <Plus size={16} className="text-indigo-400" />
                          <h4 className="font-serif text-sm font-semibold text-neutral-200">Generate a New Custom Resource Section</h4>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Do you want to add an extra, completely customized study asset tab to this specific episode? 
                          Enter the name below, and it will render dynamically in the student view as a tab featuring localization mappings.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Enter section tab label (e.g. 'Historical Physics Debate')..."
                            id="new-tab-label-input"
                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 flex-grow"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById('new-tab-label-input') as HTMLInputElement;
                              if (input && input.value.trim()) {
                                handleAddCustomSection(input.value.trim());
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-950/50 transition-all whitespace-nowrap"
                          >
                            + Deploy Custom Section
                          </button>
                        </div>
                      </div>

                      {/* Display / edit configured custom tabs */}
                      <div className="space-y-4">
                        <h4 className="font-serif text-sm font-semibold text-neutral-300">Existing Custom Tabs</h4>
                        {(activeEpisode.study_modules.custom_sections || []).map((section) => (
                          <div key={section.id} className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-3 relative">
                            <button
                              onClick={() => handleDeleteCustomSection(section.id)}
                              className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 transition-colors"
                              title="Delete Tab"
                            >
                              <Trash2 size={13} />
                            </button>
                            <div className="text-xs font-mono font-bold text-indigo-400 uppercase">
                              TAB LABEL: <span className="text-neutral-100 font-sans font-medium">{section.label}</span>
                            </div>

                            <div className="space-y-3 pt-2">
                              {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((p) => (
                                <div key={p} className="space-y-1">
                                  <span className="text-[9px] font-mono text-neutral-500 uppercase">{p} content override:</span>
                                  <textarea
                                    value={section.content[p] || ''}
                                    onChange={(e) => handleCustomSectionContentChange(section.id, p, e.target.value)}
                                    rows={2}
                                    className="w-full bg-neutral-950 border border-neutral-850 rounded px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {(!activeEpisode.study_modules.custom_sections || activeEpisode.study_modules.custom_sections.length === 0) && (
                          <p className="text-xs text-neutral-600 font-mono italic">No custom sections appended to this study module.</p>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="text-center py-24 bg-neutral-950/20 border border-neutral-900 rounded-2xl">
                <Database size={48} className="mx-auto text-neutral-700 mb-4 stroke-1" />
                <h3 className="font-serif text-lg text-neutral-400">No episodes found</h3>
                <p className="text-xs text-neutral-500 mt-1">Please create a new episode using the left panel.</p>
              </div>
            )}

            {/* GitHub Integration panel */}
            <div className="bg-[#08080c] border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Github size={20} className="text-indigo-400" />
                <h3 className="font-serif text-base font-bold text-neutral-100">
                  GitHub Repository Sync Integration
                </h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Publish your updated consolidated database direct to your GitHub codebase with an automated commit.
                Requires a Personal Access Token (PAT) with repository write permissions.
              </p>

              <form onSubmit={handleGitHubSync} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase">GitHub Repository (owner/repo)</label>
                  <input
                    type="text"
                    placeholder="e.g. yourusername/logos-explorer"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase">Target Branch</label>
                  <input
                    type="text"
                    placeholder="e.g. main"
                    value={githubBranch}
                    onChange={(e) => setGithubBranch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase">Target JSON Path</label>
                  <input
                    type="text"
                    placeholder="e.g. content/episodes/01.json"
                    value={githubPath}
                    onChange={(e) => setGithubPath(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase">GitHub Personal Access Token (PAT)</label>
                  <input
                    type="password"
                    placeholder="Enter gh_pat_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {githubStatus.type !== 'idle' && (
                  <div className={`md:col-span-2 flex items-center gap-2.5 p-3 rounded-lg text-xs font-mono border ${
                    githubStatus.type === 'loading' ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-300' :
                    githubStatus.type === 'success' ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' :
                    'bg-red-950/20 border-red-900/40 text-red-300'
                  }`}>
                    {githubStatus.type === 'loading' && <RefreshCw size={14} className="animate-spin text-indigo-400" />}
                    {githubStatus.type === 'success' && <Check size={14} className="text-emerald-400" />}
                    {githubStatus.type === 'error' && <AlertCircle size={14} className="text-red-400" />}
                    <span>{githubStatus.message}</span>
                  </div>
                )}

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={githubStatus.type === 'loading'}
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Github size={14} />
                    Commit and Push to GitHub Repository
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
