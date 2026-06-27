import { useState, useEffect } from 'react';
import { 
  Compass, 
  BookOpen, 
  Info, 
  Search, 
  Sparkles, 
  Globe, 
  Calendar, 
  ArrowLeft, 
  Youtube, 
  Cpu, 
  BookOpenCheck, 
  Rss, 
  WifiOff, 
  ChevronRight, 
  Play, 
  Quote, 
  Bookmark,
  ExternalLink,
  MessageSquare,
  Languages,
  FileText,
  Settings,
  Flame,
  Award,
  Link2,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import Types
import { Episode, StudyProfile, MindMapNode, SlideDeck, InfographicData, SpecializedReportData, DataTableData } from './types';

// Import Custom Modular Components
import Timeline from './components/Timeline';
import Quotations from './components/Quotations';
import AudioPlayer from './components/AudioPlayer';
import MindMap from './components/MindMap';
import Infographic from './components/Infographic';
import SlideDeckComponent from './components/SlideDeck';
import ReportPanel from './components/ReportPanel';
import DataTable from './components/DataTable';
import BookReviewComponent from './components/BookReview';
import ExecutiveSummary from './components/ExecutiveSummary';
import AdminDashboard from './components/AdminDashboard';

const THEME_MAP: Record<string, {
  bg: string;
  sidebarBg: string;
  accentText: string;
  accentBg: string;
  accentBgHover: string;
  accentBorder: string;
  accentGlow: string;
  gradientFrom: string;
  gradientTo: string;
  badgeBg: string;
  badgeBorder: string;
  iconColor: string;
  selectTabBg: string;
  selectActiveBorder: string;
  groupHoverAccent: string;
  cardHoverBorder: string;
  activePillBg: string;
}> = {
  cosmic: {
    bg: "bg-[#060608]",
    sidebarBg: "bg-[#0a0a0e]",
    accentText: "text-indigo-400",
    accentBg: "bg-indigo-600",
    accentBgHover: "hover:bg-indigo-700",
    accentBorder: "border-indigo-500/20",
    accentGlow: "shadow-indigo-950/50",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-indigo-900",
    badgeBg: "bg-indigo-950/40",
    badgeBorder: "border-indigo-900/50",
    iconColor: "text-indigo-500",
    selectTabBg: "bg-indigo-950/10",
    selectActiveBorder: "border-indigo-500",
    groupHoverAccent: "group-hover:text-indigo-400",
    cardHoverBorder: "hover:border-indigo-500/40",
    activePillBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/25"
  },
  emerald: {
    bg: "bg-[#030604]",
    sidebarBg: "bg-[#060b07]",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-600",
    accentBgHover: "hover:bg-emerald-700",
    accentBorder: "border-emerald-500/20",
    accentGlow: "shadow-emerald-950/50",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-900",
    badgeBg: "bg-emerald-950/40",
    badgeBorder: "border-emerald-900/50",
    iconColor: "text-emerald-500",
    selectTabBg: "bg-emerald-950/10",
    selectActiveBorder: "border-emerald-500",
    groupHoverAccent: "group-hover:text-emerald-400",
    cardHoverBorder: "hover:border-emerald-500/40",
    activePillBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
  },
  amber: {
    bg: "bg-[#060503]",
    sidebarBg: "bg-[#0b0906]",
    accentText: "text-amber-400",
    accentBg: "bg-amber-600",
    accentBgHover: "hover:bg-amber-700",
    accentBorder: "border-amber-500/20",
    accentGlow: "shadow-amber-950/50",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-900",
    badgeBg: "bg-amber-950/40",
    badgeBorder: "border-amber-900/50",
    iconColor: "text-amber-500",
    selectTabBg: "bg-amber-950/10",
    selectActiveBorder: "border-amber-500",
    groupHoverAccent: "group-hover:text-amber-400",
    cardHoverBorder: "hover:border-amber-500/40",
    activePillBg: "bg-amber-500/10 text-amber-400 border border-amber-500/25"
  },
  vatican: {
    bg: "bg-[#050406]",
    sidebarBg: "bg-[#0a080d]",
    accentText: "text-yellow-400",
    accentBg: "bg-yellow-600",
    accentBgHover: "hover:bg-yellow-700",
    accentBorder: "border-yellow-500/20",
    accentGlow: "shadow-yellow-950/50",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-900",
    badgeBg: "bg-yellow-950/40",
    badgeBorder: "border-yellow-900/50",
    iconColor: "text-yellow-500",
    selectTabBg: "bg-yellow-950/10",
    selectActiveBorder: "border-yellow-500",
    groupHoverAccent: "group-hover:text-yellow-400",
    cardHoverBorder: "hover:border-yellow-500/40",
    activePillBg: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25"
  },
  crimson: {
    bg: "bg-[#060304]",
    sidebarBg: "bg-[#0c0608]",
    accentText: "text-rose-400",
    accentBg: "bg-rose-600",
    accentBgHover: "hover:bg-rose-700",
    accentBorder: "border-rose-500/20",
    accentGlow: "shadow-rose-950/50",
    gradientFrom: "from-rose-500",
    gradientTo: "to-rose-900",
    badgeBg: "bg-rose-950/40",
    badgeBorder: "border-rose-900/50",
    iconColor: "text-rose-500",
    selectTabBg: "bg-rose-950/10",
    selectActiveBorder: "border-rose-500",
    groupHoverAccent: "group-hover:text-rose-400",
    cardHoverBorder: "hover:border-rose-500/40",
    activePillBg: "bg-rose-500/10 text-rose-400 border border-rose-500/25"
  }
};

export default function App() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [activeTab, setActiveTab] = useState<'hub' | 'about' | 'admin'>('hub');
  const [activeProfile, setActiveProfile] = useState<StudyProfile>('academic_en');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [selectedAssetTab, setSelectedAssetTab] = useState<string>('');

  // Handle Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [visualTheme, setVisualTheme] = useState(() => {
    return localStorage.getItem('logos_visual_theme') || 'cosmic';
  });

  const [brightness, setBrightness] = useState<'dark' | 'bright'>(() => {
    return (localStorage.getItem('logos_brightness') as 'dark' | 'bright') || 'dark';
  });

  const handleToggleBrightness = () => {
    const next = brightness === 'dark' ? 'bright' : 'dark';
    setBrightness(next);
    localStorage.setItem('logos_brightness', next);
    window.dispatchEvent(new Event('logos_brightness_changed'));
  };

  const handleChangeTheme = (themeId: string) => {
    setVisualTheme(themeId);
    localStorage.setItem('logos_visual_theme', themeId);
  };

  const handleUpdateEpisodes = (newEpisodes: Episode[]) => {
    setEpisodes(newEpisodes);
    localStorage.setItem('logos_custom_episodes', JSON.stringify(newEpisodes));
    if (selectedEpisode) {
      const updatedSelected = newEpisodes.find(ep => ep.id === selectedEpisode.id);
      if (updatedSelected) {
        setSelectedEpisode(updatedSelected);
      }
    }
  };

  const handleResetEpisodes = () => {
    localStorage.removeItem('logos_custom_episodes');
    fetch('/episodes.json')
      .then((res) => {
        if (!res.ok) throw new Error('Data file not found');
        return res.json();
      })
      .then((data: Episode[]) => {
        setEpisodes(data);
        if (selectedEpisode) {
          const resetSelected = data.find(ep => ep.id === selectedEpisode.id);
          if (resetSelected) setSelectedEpisode(resetSelected);
        }
      })
      .catch((err) => {
        console.warn('Fallback reset', err);
        window.location.reload();
      });
  };

  // Fetch episodes from compiled database or load from cache
  useEffect(() => {
    const cached = localStorage.getItem('logos_custom_episodes');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEpisodes(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse cached episodes", e);
      }
    }

    fetch('/episodes.json')
      .then((res) => {
        if (!res.ok) throw new Error('Data file not found');
        return res.json();
      })
      .then((data: Episode[]) => {
        setEpisodes(data);
      })
      .catch((err) => {
        console.warn('Could not fetch episodes.json, using local sample fallback. Running "compile-data.js" is recommended.', err);
        // High fidelity fallback matching index 01.json in case compilation didn't complete
        setEpisodes([
          {
            id: "01",
            title: {
              academic_en: "Episode 01: The Cosmic Fine-Tuning — Entropy, Cosmic Order, and the Anthropic Principle",
              esl_en: "Episode 01: Why the Universe is Perfect for Life — Science and Philosophy Explained",
              translated_es: "Episodio 01: El Ajuste Fino Cósmico — Entropía, Orden Cósmico y el Principio Antrópico",
              translated_id: "Episode 01: Penyelarasan Kosmik — Entropi, Keteraturan Kosmik, dan Prinsip Antropik"
            },
            description: {
              academic_en: "An exhaustive investigation into the mathematical constants of physics and the low-entropy state of the early universe. This episode bridges thermodynamic formulations with teleological metaphysics, exploring whether the cosmos is a byproduct of random chance or intentional orchestration.",
              esl_en: "In this video, we look at why our universe has the perfect laws for humans and stars to exist. We explain entropy (how things get messy) and the big questions about who or what made the universe.",
              translated_es: "Una investigación exhaustiva sobre las constantes matemáticas de la física y el estado de baja entropía del universo primitivo. Este episodio conecta las formulaciones termodinámicas con la metafísica teleológica, explorando si el cosmos es producto del azar o de un diseño intencionado.",
              translated_id: "Penyelidikan mendalam terhadap konstanta matematika fisika dan keadaan entropi rendah di alam semesta awal. Episode ini menjembatani formulasi termodinamika dengan metafisika teleologis, menjelajahi apakah kosmos merupakan produk sampingan dari kebetulan acak atau rancangan yang disengaja."
            },
            publish_date: "2026-06-25",
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
            scenes: [
              {
                timestamp_seconds: 0,
                title: {
                  academic_en: "Introduction: The Convergence of Physics and Metaphysics",
                  esl_en: "Introduction: Connecting Science and Faith",
                  translated_es: "Introducción: La Convergencia de la Física y la Metafísica",
                  translated_id: "Pendahuluan: Pertemuan Fisika dan Metafisika"
                },
                description: {
                  academic_en: "Setting the stage for the dialogue between scientific materialism, philosophy of mind, and theistic teleology.",
                  esl_en: "We start the video. We talk about how science and religion can talk to each other without fighting.",
                  translated_es: "Sentando las bases para el diálogo entre el materialismo científico, la filosofía de la mente y la teleología teísta.",
                  translated_id: "Mempersiapkan panggung untuk dialog antara materialisme ilmiah, filsafat pikiran, dan teleologi teistik."
                }
              },
              {
                timestamp_seconds: 320,
                title: {
                  academic_en: "The Second Law of Thermodynamics and Cosmic Entropy",
                  esl_en: "The Law of Mess (Entropy) in Space",
                  translated_es: "La Segunda Ley de la Termodinámica y la Entropía Cósmica",
                  translated_id: "Hukum Kedua Termodinamika dan Entropi Kosmik"
                },
                description: {
                  academic_en: "Analyzing Roger Penrose's calculation of the initial low-entropy state of the universe (1 in 10^10^123) and its deep theological implications.",
                  esl_en: "We discuss how things in the universe naturally get dirty and messy, and why the beginning of the universe was so clean and orderly.",
                  translated_es: "Analizando el cálculo de Roger Penrose sobre el estado inicial de baja entropía del universo (1 en 10^10^123) y sus profundas implicaciones teológicas.",
                  translated_id: "Menganalisis kalkulasi Roger Penrose tentang keadaan awal entropi rendah dari alam semesta (1 berbanding 10^10^123) serta implikasi teologisnya yang mendalam."
                }
              }
            ],
            inspiring_quotations: [
              {
                author: "Dr. Roger Penrose",
                historical_role: "Nobel Laureate in Physics",
                quote_text: {
                  academic_en: "This now tells us how extraordinarily precise the Creator's aim has to be, namely, an accuracy of one part in 10^10^123.",
                  esl_en: "The universe started with amazing precision. The chance of this happening by accident is 1 out of a number so big we cannot write it down.",
                  translated_es: "Esto nos dice cuán extraordinariamente precisa tenía que ser la puntería del Creador, a saber, una precisión de una parte en 10^10^123.",
                  translated_id: "Ini menunjukkan kepada kita betapa luar biasa presisinya sasaran Sang Pencipta, yaitu dengan akurasi satu bagian dalam 10^10^123."
                }
              }
            ],
            study_modules: {
              mind_map: {
                academic_en: { label: "The Fine-Tuning Paradox", children: [{ label: "Thermodynamics" }] },
                esl_en: { label: "Perfect Setup", children: [{ label: "Mess and Cleanliness" }] },
                translated_es: { label: "Paradoja del Ajuste Fino", children: [{ label: "Termodinámica" }] },
                translated_id: { label: "Paradoks Penyelarasan Kosmik", children: [{ label: "Termodinamika" }] }
              },
              infographic: {
                academic_en: { title: "Cosmological Scale", metrics: [{ label: "Entropy Precision", value: "1 in 10^10^123", sub: "Penrose bound" }], takeaways: ["Extremely low entropy."] },
                esl_en: { title: "Amazing Numbers", metrics: [{ label: "Space Cleanliness", value: "1 in 10^10^123", sub: "Almost impossible order" }], takeaways: ["Space started organized."] },
                translated_es: { title: "Escala Cosmológica", metrics: [{ label: "Precisión de la Entropía", value: "1 en 10^10^123", sub: "Límite de Penrose" }], takeaways: ["Baja entropía inicial."] },
                translated_id: { title: "Skala Kosmologis", metrics: [{ label: "Presisi Entropi", value: "1 berbanding 10^10^123", sub: "Kalkulasi Penrose" }], takeaways: ["Entropi awal sangat rendah."] }
              },
              slide_decks: [
                {
                  slide_number: 1,
                  title: { academic_en: "Slide 1: Entropy", esl_en: "Slide 1: Mess", translated_es: "Diapositiva 1", translated_id: "Slide 1: Entropi" },
                  bullets: { academic_en: ["Entropy increases."], esl_en: ["Things get messy."], translated_es: ["La entropía aumenta."], translated_id: ["Entropi meningkat."] }
                }
              ],
              specialized_reports: {
                academic_en: { title: "On Teleology", body: "Roger Penrose discusses initial phase volume... and physics landscape." },
                esl_en: { title: "Simple Physics", body: "Things in your room get messy. The universe started neat." },
                translated_es: { title: "Sobre Teleología", body: "Roger Penrose analiza el espacio de fases inicial." },
                translated_id: { title: "Mengenai Arsitektur Teleologis", body: "Roger Penrose membahas volume ruang fase awal." }
              },
              data_table: {
                headers: {
                  academic_en: ["Physical Constant", "Symbol", "Precise Value", "Tolerance Limit", "Philosophical Weight"],
                  esl_en: ["Law / Number", "Symbol", "Number Value", "Allowed Change", "What it Means"],
                  translated_es: ["Constante Física", "Símbolo", "Valor Preciso", "Límite de Tolerancia", "Peso Filosófico"],
                  translated_id: ["Konstanta Fisika", "Simbol", "Nilai Presisi", "Batas Toleransi", "Bobot Filosofis"]
                },
                rows: [
                  {
                    constant: { academic_en: "Gravitational Constant", esl_en: "Gravity Power", translated_es: "Constante Gravitacional", translated_id: "Konstanta Gravitasi" },
                    symbol: "G",
                    value: "6.674 × 10^-11 m^3 kg^-1 s^-2",
                    tolerance: { academic_en: "1 part in 10^40", esl_en: "40 zeros", translated_es: "1 parte en 10^40", translated_id: "1 bagian dalam 10^40" },
                    implication: { academic_en: "Balance of collapse.", esl_en: "Keeps stars burning.", translated_es: "Equilibrio del colapso.", translated_id: "Keseimbangan keruntuhan." }
                  }
                ]
              },
              creator_reflection: {
                academic_en: "We are thinking God's thoughts after Him.",
                esl_en: "The math of science shows how God thinks.",
                translated_es: "Pensamos los pensamientos de Dios después de Él.",
                translated_id: "Kita memikirkan pikiran-pikiran Tuhan setelah Dia."
              },
              book_review: {
                academic_en: {
                  title: "A Fine-Tuned Universe: The Quest for God in Science and Theology",
                  author: "Alister E. McGrath",
                  publish_year: "2009",
                  rating: 5,
                  overview: "A masterwork bridging the precision of modern evolutionary biology and physical cosmology with classic Christian teleology. Alister McGrath utilizes the prestigious Gifford Lectures to construct a robust theology of nature, arguing that the anthropic resonance of physical constants and the specific pathways of organic chemistry suggest a rational, purpose-driven cosmos rather than random alignment.",
                  key_takeaways: [
                    "The concepts of fine-tuning extend far beyond cosmological constants to include the precise chemical properties of carbon, water, and atomic bonding structures.",
                    "The anthropic principle should not be dismissed as a mere observer bias, but rather viewed as an empirical feature pointing to intelligent design.",
                    "Classic Christian teleology can be updated to incorporate evolutionary processes, showing a creation that has been programmed with potentiality."
                  ],
                  scientific_theological_alignment: "McGrath masterfully demonstrates that the mathematical parameters calculated by physicists like Roger Penrose are not in conflict with classical theology. Instead, they provide empirical substance to the concept of the 'Logos'—showing that the universe is underpinned by an elegant, rational order designed to be known and populated.",
                  recommended_chapters: [
                    {"chapter": "Chapter 4: The Mystery of Fine-Tuning", "description": "An excellent overview of the specific physical numbers and cosmological constants that must be incredibly precise for galaxies to exist."},
                    {"chapter": "Chapter 6: Organic Chemistry and Life", "description": "Focuses on why the unique bonding capabilities of carbon are essential, showing that fine-tuning is also present at the chemical level."}
                  ]
                },
                esl_en: {
                  title: "A Fine-Tuned Universe: The Quest for God in Science and Theology",
                  author: "Alister E. McGrath",
                  publish_year: "2009",
                  rating: 5,
                  overview: "A great book that helps us see how science and faith in God work together. Alister McGrath explains that the perfect laws of physics and chemical structures are not accidents. Instead, they show that a smart Creator designed the universe for a special reason.",
                  key_takeaways: [
                    "The perfect numbers in nature are not just in space; they are also in the way chemistry, water, and carbon work to make our bodies.",
                    "We should not say the universe is perfect by luck. The great order we see is a strong clue for a smart Designer.",
                    "God is like a great artist who made the laws of nature to grow and develop according to a beautiful plan."
                  ],
                  scientific_theological_alignment: "McGrath shows that the hard math and science from physics are not enemies of God. In fact, they prove what the Bible says about the 'Logos' (Logic/God's Word). It shows that the universe is made with deep intelligence.",
                  recommended_chapters: [
                    {"chapter": "Chapter 4: The Mystery of Fine-Tuning", "description": "This chapter is a simple and clear guide to the numbers in space that must be exactly right for us to live."},
                    {"chapter": "Chapter 6: Organic Chemistry and Life", "description": "Explains why the building blocks of life like carbon are perfect, showing God's touch in small atoms too."}
                  ]
                },
                translated_es: {
                  title: "Un Universo Ajustado Fino: La Búsqueda de Dios en la Ciencia y la Teología",
                  author: "Alister E. McGrath",
                  publish_year: "2009",
                  rating: 5,
                  overview: "Una obra maestra que tiende un puente entre la precisión de la biología evolutiva moderna y la cosmología física con la teleología cristiana clásica. Alister McGrath utiliza las prestigiosas Conferencias Gifford para construir una teología de la naturaleza robusta, argumentando que la resonancia antrópica de las constantes físicas y las vías específicas de la química orgánica sugieren un cosmos racional guiado por un propósito en lugar de una alineación aleatoria.",
                  key_takeaways: [
                    "Los conceptos de ajuste fino se extienden mucho más allá de las constantes cosmológicas para incluir las propiedades químicas precisas del carbono, el agua y las estructuras de enlace atómico.",
                    "El principio antrópico no debe descartarse como un mero sesgo del observador, sino que debe verse como una característica empírica que apunta a un diseño inteligente.",
                    "La teleología cristiana clásica puede actualizarse para incorporar procesos evolutivos, mostrando una creación que ha sido programada con potencialidad."
                  ],
                  scientific_theological_alignment: "McGrath demuestra magistralmente que los parámetros matemáticos calculados por físicos como Roger Penrose no están en conflicto con la teología clásica. En cambio, proporcionan sustancia empírica al concepto del 'Logos', mostrando que el universo está respaldado por un orden elegante y racional diseñado para ser conocido y poblado.",
                  recommended_chapters: [
                    {"chapter": "Capítulo 4: El misterio del ajuste fino", "description": "Una excelente descripción general de los números físicos específicos y las constantes cosmológicas que deben ser increíblemente precisas para que existan las galaxias."},
                    {"chapter": "Capítulo 6: Química orgánica y vida", "description": "Se centra en por qué las capacidades de enlace únicas del carbono son esenciales, mostrando que el ajuste fino también está presente a nivel químico."}
                  ]
                },
                translated_id: {
                  title: "A Fine-Tuned Universe: Pencarian akan Tuhan dalam Sains dan Teologi",
                  author: "Alister E. McGrath",
                  publish_year: "2009",
                  rating: 5,
                  overview: "Sebuah karya besar yang menjembatani presisi biologi evolusioner modern dan kosmologi fisik dengan teologi Kristen klasik. Alister McGrath menggunakan Gifford Lectures yang bergengsi untuk membangun teologi alam yang kokoh, dengan argumen bahwa resonansi antropik dari konstanta fisik dan jalur kimia organik menunjukkan kosmos yang rasional dan terarah, alih-alih kebetulan acak.",
                  key_takeaways: [
                    "Konsep penyelarasan halus (fine-tuning) melampaui konstanta kosmologis, mencakup sifat kimiawi presisi dari karbon, air, dan struktur ikatan atom.",
                    "Prinsip antropik tidak boleh diabaikan begitu saja sebagai bias pengamat, melainkan harus dipandang sebagai fitur empiris yang menunjukkan rancangan cerdas (intelligent design).",
                    "Teleologi klasik dapat diperbarui untuk memasukkan proses-proses perkembangan alam semesta, menunjukkan ciptaan yang telah diprogram dengan potensi luar biasa sejak awal."
                  ],
                  scientific_theological_alignment: "McGrath secara luar biasa menunjukkan bahwa parameter matematika yang dihitung oleh para fisikawan seperti Roger Penrose tidak bertentangan dengan teologi klasik. Sebaliknya, hal itu memberikan bukti empiris bagi konsep 'Logos'—menunjukkan bahwa alam semesta didasari oleh keteraturan rasional yang elegan yang dirancang untuk dipelajari dan dihuni manusia.",
                  recommended_chapters: [
                    {"chapter": "Bab 4: Misteri Penyelarasan Halus", "description": "Ikhtisar luar biasa tentang angka-angka fisik khusus dan konstanta kosmologis yang harus sangat presisi agar galaksi-galaksi dapat terbentuk."},
                    {"chapter": "Bab 6: Kimia Organik dan Kehidupan", "description": "Fokus pada mengapa kemampuan ikatan unik karbon sangat esensial, menunjukkan bahwa penyelarasan halus juga ada pada tingkat kimiawi atom."}
                  ]
                }
              },
              executive_summary: {
                academic_en: [
                  "The universe's initial state exhibits an extraordinarily low-entropy value, calculated by Dr. Roger Penrose as 1 in 10^10^123, pointing to an unimaginably precise starting alignment.",
                  "Fundamental physical parameters—such as the gravitational constant, the strong nuclear force, and the cosmological constant—possess exceptionally narrow tolerance thresholds required for cosmic evolution.",
                  "The multiverse hypothesis operates as a speculative, metaphysically complex alternative to a primary Intelligent Designer, yet remains empirically unprovable and violates philosophical parsimony (Occam's razor).",
                  "Modern physical mathematics does not obscure transcendental realities, but rather reveals an underlying rational, elegant order corresponding to the classic theological concept of the Logos."
                ],
                esl_en: [
                  "The universe started very clean and neat. A famous scientist, Roger Penrose, calculated that the chance of this happening by accident is 1 out of a giant number with many zeros.",
                  "The basic rules of nature, like how gravity works and how atoms hold together, are set to perfect numbers. If they changed even a tiny bit, life could not exist.",
                  "Some scientists suggest there are billions of unseen universes (the multiverse) to explain this perfection, but we cannot see or prove them. A smart Creator is a simpler explanation.",
                  "The math of modern physics does not hide God. Instead, it shows us the beautiful logic and deep intelligence behind all creation."
                ],
                translated_es: [
                  "El estado inicial del universo exhibe un valor de entropía extraordinariamente bajo, calculado por el Dr. Roger Penrose en 1 de cada 10^10^123, lo que señala una alineación inicial inimaginablemente precisa.",
                  "Los parámetros físicos fundamentales, como la constante de gravedad, la fuerza nuclear fuerte y la constante cosmológica, poseen umbrales de tolerancia excepcionalmente estrechos requeridos para la evolución cósmica.",
                  "La hipótesis del multiverso funciona como una alternativa especulativa y metafísicamente compleja a un Diseñador Inteligente primario, pero sigue siendo empíricamente indemostrable y viola la parsimonia filosófica.",
                  "Las matemáticas de la física moderna no ocultan las realidades trascendentales, sino que revelan un orden racional y elegante subyacente que corresponde al concepto teológico clásico del Logos."
                ],
                translated_id: [
                  "Keadaan awal alam semesta menunjukkan tingkat entropi yang sangat rendah, dihitung oleh Dr. Roger Penrose sebesar 1 berbanding 10^10^123, yang menunjukkan keselarasan awal yang luar biasa presisi.",
                  "Parameter fisik fundamental—seperti konstanta gravitasi, gaya nuklir kuat, dan konstanta kosmologis—memiliki ambang batas toleransi yang sangat sempit yang diperlukan bagi perkembangan alam semesta.",
                  "Hipotesis multisemesta berfungsi sebagai alternatif spekulatif dan kompleks secara metafisik untuk Perancang Cerdas, tetapi tetap tidak dapat dibuktikan secara empiris dan melanggar prinsip kesederhanaan filosofis (Occam's razor).",
                  "Matematika fisika modern tidak mengaburkan realitas transendental, melainkan menyingkapkan keteraturan rasional yang elegan yang sesuai dengan konsep teologis klasik tentang Logos."
                ]
              }
            }
          }
        ]);
      });
  }, []);

  // When selectedEpisode changes, automatically select the first dynamic tab
  useEffect(() => {
    if (selectedEpisode) {
      const tabs = getDynamicTabs(selectedEpisode);
      if (tabs.length > 0) {
        setSelectedAssetTab(tabs[0].id);
      }
    }
  }, [selectedEpisode]);

  // Helper to dynamically collect available study asset modules from dataset
  const getDynamicTabs = (episode: Episode) => {
    const tabs: { id: string; label: string }[] = [];
    if (episode.study_modules?.executive_summary) {
      tabs.push({ id: 'executive_summary', label: 'Executive Summary' });
    }
    if (episode.scenes && episode.scenes.length > 0) {
      tabs.push({ id: 'timeline', label: 'Interactive Timeline' });
    }
    if (episode.inspiring_quotations && episode.inspiring_quotations.length > 0) {
      tabs.push({ id: 'quotes', label: 'Inspiring Quotations' });
    }
    if (episode.study_modules?.mind_map) {
      tabs.push({ id: 'mind_map', label: 'Mind Map' });
    }
    if (episode.study_modules?.infographic) {
      tabs.push({ id: 'infographic', label: 'Graphic Takeaways' });
    }
    if (episode.study_modules?.slide_decks && episode.study_modules.slide_decks.length > 0) {
      tabs.push({ id: 'slide_decks', label: 'Slide Carousel' });
    }
    if (episode.study_modules?.specialized_reports) {
      tabs.push({ id: 'specialized_reports', label: 'Specialized Report' });
    }
    if (episode.study_modules?.data_table) {
      tabs.push({ id: 'data_table', label: 'Constants Table' });
    }
    if (episode.study_modules?.book_review) {
      tabs.push({ id: 'book_review', label: 'Selected Book Review' });
    }
    if (episode.study_modules?.inspiring_story) {
      tabs.push({ id: 'inspiring_story', label: 'Inspiring Story' });
    }
    if (episode.sources && episode.sources.length > 0) {
      tabs.push({ id: 'sources', label: 'Sources Used' });
    }
    if (episode.study_modules?.custom_sections) {
      episode.study_modules.custom_sections.forEach((section) => {
        tabs.push({ id: `custom_${section.id}`, label: section.label });
      });
    }
    return tabs;
  };

  const getProfileLabel = (profile: StudyProfile) => {
    switch (profile) {
      case 'academic_en': return 'College Academic (EN)';
      case 'esl_en': return 'Accessible / ESL (EN)';
      case 'translated_es': return 'Español';
      case 'translated_id': return 'Indonesian (Bahasa Indonesia)';
    }
  };

  // Filter episodes based on search query
  const filteredEpisodes = episodes.filter((ep) => {
    const titleText = ep.title[activeProfile] || ep.title['academic_en'];
    const descText = ep.description[activeProfile] || ep.description['academic_en'];
    const query = searchQuery.toLowerCase();
    return titleText.toLowerCase().includes(query) || descText.toLowerCase().includes(query);
  });

  const isBright = brightness === 'bright';
  const rawColors = THEME_MAP[visualTheme] || THEME_MAP.cosmic;
  
  const tColors = isBright ? {
    bg: visualTheme === 'emerald' ? "bg-[#f4f7f4]" : 
        visualTheme === 'amber' ? "bg-[#ecdcb9]" : // Historical warm clay background
        visualTheme === 'vatican' ? "bg-[#faf9f5]" :
        visualTheme === 'crimson' ? "bg-[#fbf5f6]" :
        "bg-[#f4f5fa]", // cosmic
    sidebarBg: visualTheme === 'amber' ? "bg-[#eddcc4]" : "bg-white",
    accentText: visualTheme === 'emerald' ? "text-emerald-600" : 
                visualTheme === 'amber' ? "text-[#C88A14]" : // Gold-amber highlight
                visualTheme === 'vatican' ? "text-yellow-600" :
                visualTheme === 'crimson' ? "text-rose-600" :
                "text-indigo-600",
    accentBg: visualTheme === 'emerald' ? "bg-emerald-600" : 
              visualTheme === 'amber' ? "bg-[#C88A14]" : // Warm gold-amber
              visualTheme === 'vatican' ? "bg-yellow-600" :
              visualTheme === 'crimson' ? "bg-rose-600" :
              "bg-indigo-600",
    accentBgHover: visualTheme === 'emerald' ? "hover:bg-emerald-700" : 
                  visualTheme === 'amber' ? "hover:bg-[#b0780f]" :
                  visualTheme === 'vatican' ? "hover:bg-yellow-700" :
                  visualTheme === 'crimson' ? "hover:bg-rose-700" :
                  "hover:bg-indigo-700",
    accentBorder: visualTheme === 'emerald' ? "border-emerald-200" : 
                  visualTheme === 'amber' ? "border-[#C88A14]/30" :
                  visualTheme === 'vatican' ? "border-yellow-200" :
                  visualTheme === 'crimson' ? "border-rose-200" :
                  "border-indigo-200",
    accentGlow: "shadow-md shadow-neutral-200",
    gradientFrom: rawColors.gradientFrom,
    gradientTo: rawColors.gradientTo,
    badgeBg: visualTheme === 'emerald' ? "bg-emerald-100/60 text-emerald-700" : 
             visualTheme === 'amber' ? "bg-[#fef3c7] text-[#92400e]" : // Gold-amber badge
             visualTheme === 'vatican' ? "bg-yellow-100/60 text-yellow-700" :
             visualTheme === 'crimson' ? "bg-rose-100/60 text-rose-700" :
             "bg-indigo-100/60 text-indigo-700",
    badgeBorder: visualTheme === 'emerald' ? "border-emerald-200" : 
                 visualTheme === 'amber' ? "border-[#C88A14]/40" :
                 visualTheme === 'vatican' ? "border-yellow-200" :
                 visualTheme === 'crimson' ? "border-rose-200" :
                 "border-indigo-200",
    iconColor: visualTheme === 'emerald' ? "text-emerald-500" : 
               visualTheme === 'amber' ? "text-[#C88A14]" :
               visualTheme === 'vatican' ? "text-yellow-500" :
               visualTheme === 'crimson' ? "text-rose-500" :
               "text-indigo-500",
    selectTabBg: visualTheme === 'amber' ? "bg-[#f5e6ce]" : "bg-neutral-100",
    selectActiveBorder: visualTheme === 'emerald' ? "border-emerald-500" : 
                        visualTheme === 'amber' ? "border-[#C88A14]" :
                        visualTheme === 'vatican' ? "border-yellow-500" :
                        visualTheme === 'crimson' ? "border-rose-500" :
                        "border-indigo-500",
    groupHoverAccent: visualTheme === 'emerald' ? "group-hover:text-emerald-600" : 
                      visualTheme === 'amber' ? "group-hover:text-[#C88A14]" :
                      visualTheme === 'vatican' ? "group-hover:text-yellow-600" :
                      visualTheme === 'crimson' ? "group-hover:text-rose-600" :
                      "group-hover:text-indigo-600",
    cardHoverBorder: visualTheme === 'emerald' ? "hover:border-emerald-400" : 
                     visualTheme === 'amber' ? "hover:border-[#C88A14]/60" :
                     visualTheme === 'vatican' ? "hover:border-yellow-400" :
                     visualTheme === 'crimson' ? "hover:border-rose-400" :
                     "hover:border-indigo-400",
    activePillBg: visualTheme === 'emerald' ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : 
                  visualTheme === 'amber' ? "bg-[#fef3c7] text-[#92400e] border border-[#C88A14]/40" :
                  visualTheme === 'vatican' ? "bg-yellow-50 text-yellow-600 border border-yellow-200" :
                  visualTheme === 'crimson' ? "bg-rose-50 text-rose-600 border border-rose-200" :
                  "bg-indigo-50 text-indigo-600 border border-indigo-200"
  } : rawColors;

  const isAmberBright = isBright && visualTheme === 'amber';

  const textMain = isAmberBright ? "text-[#5c3f15]" : isBright ? "text-neutral-800" : "text-neutral-100";
  const textMuted = isAmberBright ? "text-[#856535]" : isBright ? "text-neutral-500" : "text-neutral-400";
  const textHeading = isAmberBright ? "text-[#452d0a]" : isBright ? "text-neutral-900" : "text-white";
  const borderMuted = isAmberBright ? "border-[#C88A14]/15" : isBright ? "border-neutral-200" : "border-neutral-800/80";
  const borderStrong = isAmberBright ? "border-[#C88A14]/25" : isBright ? "border-neutral-200" : "border-neutral-900";
  const bgCard = isAmberBright ? "bg-[#fbf7ee] border-[#C88A14]/15" : isBright ? "bg-white border-neutral-200" : "bg-[#08080c] border-neutral-900";
  const bgHeader = isAmberBright ? "bg-[#ecdcb9]/80 border-[#C88A14]/15" : isBright ? "bg-white/80 border-neutral-200" : "border-b border-neutral-900 bg-[#07070b]/60";
  const bgInput = isAmberBright ? "bg-[#faf6eb] border-[#C88A14]/20 text-[#452d0a]" : isBright ? "bg-white border-neutral-200 text-neutral-800" : "bg-neutral-950 border-neutral-800 text-neutral-200";
  const bgNav = isAmberBright ? "bg-[#f5e6ce]/80 border-[#C88A14]/15" : isBright ? "bg-neutral-100/80 border-neutral-200" : "bg-neutral-900/80 border-neutral-800";

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${tColors.bg} ${isBright ? 'bright-theme text-neutral-800' : 'text-neutral-100'} font-sans selection:bg-indigo-600/30 selection:text-indigo-200`}>
      
      {/* 1. Global Header Bar (Always Top for Mobile, Left Sidebar for Desktop) */}
      <aside className={`w-full md:w-80 md:min-h-screen ${tColors.sidebarBg} border-b md:border-b-0 md:border-r ${isBright ? 'border-neutral-200' : 'border-neutral-800/80'} p-4 md:p-5 flex flex-col justify-between flex-shrink-0 z-20`}>
        <div className="flex flex-col gap-4 md:gap-8">
          
          {/* Logo Brand Block & Network Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-start gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tColors.gradientFrom} ${tColors.gradientTo} flex items-center justify-center shadow-lg ${tColors.accentGlow} border ${isBright ? 'border-black/5' : 'border-white/10'}`}>
                <Compass className="text-white animate-spin-slow" size={22} />
              </div>
              <div>
                <span className={`text-[9px] font-mono tracking-widest ${tColors.accentText} uppercase font-bold block leading-none`}>Logos-Transmission</span>
                <h1 className={`font-serif text-lg font-bold tracking-tight ${isBright ? 'text-neutral-900' : 'text-white'} mt-1`}>Logos-Explorer</h1>
              </div>
            </div>

            {/* Network Status indicator */}
            {isOffline && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-300 text-xs font-mono self-start sm:self-auto">
                <WifiOff size={14} className="text-red-400 animate-pulse" />
                <span>Offline Cache Active</span>
              </div>
            )}
          </div>

          {/* Primary Navigation Shell */}
          <nav className="grid grid-cols-3 md:flex md:flex-col gap-2">
            <button
              onClick={() => { setActiveTab('hub'); setSelectedEpisode(null); }}
              className={`flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-lg text-center md:text-left text-[11px] md:text-sm font-medium transition-all duration-200 ${
                activeTab === 'hub' && !selectedEpisode
                  ? `${tColors.accentBg} text-white shadow-lg ${tColors.accentGlow}`
                  : isBright
                    ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <BookOpen size={16} className="flex-shrink-0" />
              <span className="hidden sm:inline">Episodes Hub</span>
              <span className="sm:hidden">Hub</span>
              <span className={`hidden md:inline-block ml-auto text-xs font-mono px-1.5 py-0.2 rounded-full ${isBright ? 'bg-neutral-100 text-neutral-600 border border-neutral-200' : 'bg-neutral-900 text-neutral-400'}`}>
                {episodes.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('about'); setSelectedEpisode(null); }}
              className={`flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-lg text-center md:text-left text-[11px] md:text-sm font-medium transition-all duration-200 ${
                activeTab === 'about'
                  ? `${tColors.accentBg} text-white shadow-lg ${tColors.accentGlow}`
                  : isBright
                    ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <Info size={16} className="flex-shrink-0" />
              <span className="hidden sm:inline">About the App</span>
              <span className="sm:hidden">About</span>
            </button>

            <button
              onClick={() => { setActiveTab('admin'); setSelectedEpisode(null); }}
              className={`flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-lg text-center md:text-left text-[11px] md:text-sm font-medium transition-all duration-200 ${
                activeTab === 'admin'
                  ? `${tColors.accentBg} text-white shadow-lg ${tColors.accentGlow}`
                  : isBright
                    ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <Settings size={16} className="flex-shrink-0" />
              <span className="hidden sm:inline">Admin Workspace</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className={`hidden md:block pt-6 border-t ${isBright ? 'border-neutral-200' : 'border-neutral-900/80'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] font-mono uppercase tracking-widest ${isBright ? 'text-neutral-500' : 'text-neutral-400'}`}>Aesthetic Mode</span>
            <button
              onClick={handleToggleBrightness}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all duration-200 cursor-pointer ${
                isBright 
                  ? 'bg-neutral-50 border-neutral-200 text-neutral-800 font-medium hover:bg-neutral-100 shadow-sm' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              {isBright ? (
                <>
                  <Sun size={12} className="text-amber-500" />
                  <span>Bright Mode</span>
                </>
              ) : (
                <>
                  <Moon size={12} className="text-indigo-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] font-mono text-neutral-500 leading-relaxed">
            Explaining the profound harmony between astrophysical realities, ancient scriptures, and rational cosmology.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-mono">
            <Cpu size={12} className={tColors.iconColor} />
            <span className={isBright ? 'text-neutral-500' : 'text-neutral-400'}>PWA Static Build v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <main className="flex-grow flex flex-col min-h-screen relative overflow-x-hidden pb-20 md:pb-6">
        
        {/* Profile Selector at the Top Right header */}
        <header className={`border-b ${isBright ? 'border-neutral-200 bg-white/85' : 'border-neutral-900 bg-[#07070b]/60'} backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="flex items-center gap-3 justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className={tColors.accentText} />
              <span className={`text-xs font-mono ${isBright ? 'text-neutral-600' : 'text-neutral-400'} tracking-wider uppercase`}>
                {selectedEpisode ? `Active Episode: #${selectedEpisode.id}` : 'Browsing Archives'}
              </span>
            </div>
            
            {/* Quick theme mode toggle for mobile / smaller screens */}
            <button
              onClick={handleToggleBrightness}
              className={`sm:hidden p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                isBright 
                  ? 'bg-neutral-100 border-neutral-200 text-amber-600 hover:bg-neutral-200' 
                  : 'bg-neutral-900/80 border-neutral-800 text-indigo-400 hover:bg-neutral-800'
              }`}
              title="Toggle theme mode"
            >
              {isBright ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Profile pill group */}
            <div className={`flex items-center gap-2 ${isBright ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/80 border-neutral-800'} border p-1 rounded-xl self-stretch sm:self-auto overflow-x-auto custom-scrollbar`}>
              <span className={`text-[10px] font-mono ${isBright ? 'text-neutral-500' : 'text-neutral-500'} uppercase px-2 font-bold select-none whitespace-nowrap`}>Study Profile:</span>
              {(['academic_en', 'esl_en', 'translated_es', 'translated_id'] as StudyProfile[]).map((profile) => (
                <button
                  key={profile}
                  onClick={() => setActiveProfile(profile)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    activeProfile === profile
                      ? tColors.activePillBg
                      : isBright
                        ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950'
                  }`}
                >
                  {getProfileLabel(profile)}
                </button>
              ))}
            </div>

            {/* Desktop theme mode toggle */}
            <button
              onClick={handleToggleBrightness}
              className={`hidden sm:flex items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isBright 
                  ? 'bg-neutral-50 border-neutral-200 text-amber-600 hover:bg-neutral-100 shadow-sm' 
                  : 'bg-neutral-900/80 border-neutral-800 text-indigo-400 hover:bg-neutral-800'
              }`}
              title="Toggle theme mode"
            >
              {isBright ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Outer Section Router */}
        <div className="flex-grow p-6 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {/* ADMIN WORKSPACE TAB */}
            {activeTab === 'admin' && (
              <motion.div
                key="admin-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <AdminDashboard
                  episodes={episodes}
                  onUpdateEpisodes={handleUpdateEpisodes}
                  onResetEpisodes={handleResetEpisodes}
                  currentTheme={visualTheme}
                  onChangeTheme={handleChangeTheme}
                  onClose={() => setActiveTab('hub')}
                />
              </motion.div>
            )}
            
            {/* ABOUT TAB VIEW */}
            {activeTab === 'about' && (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="max-w-3xl space-y-6">
                    <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">
                      App Manifest & Ethos
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-bold tracking-tight">
                      Harmony of Creation, Science & Theology
                    </h2>
                    <p className="font-sans text-sm md:text-base text-neutral-400 leading-relaxed">
                      <strong>Logos-Explorer</strong> is the definitive open-source study repository tailored for students, academics, and theologians following the <em>Logos-Transmission</em> dialogues. Our work is dedicated to showing how cutting-edge astrophysics, molecular biology, and quantum parameters are not in conflict with historical theology—but rather reveal the magnificent, rational mind of the divine Creator.
                    </p>
                  </div>
                </div>

                {/* Grid describing study profiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-xl space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900/40">
                      <Cpu size={16} />
                    </div>
                    <h4 className="font-serif text-base text-neutral-200">College Academic (EN)</h4>
                    <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                      Includes advanced scientific metrics, Roger Penrose's phase volume parameters, and cosmological constants fine-tuning equations mapped to historical philosophical contexts.
                    </p>
                  </div>

                  <div className="glass-card p-6 rounded-xl space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/30 flex items-center justify-center text-emerald-400 border border-emerald-900/40">
                      <Languages size={16} />
                    </div>
                    <h4 className="font-serif text-base text-neutral-200">Accessible / ESL (EN)</h4>
                    <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                      Written with clear, simplified vocabulary, short paragraphs, and supportive definitions designed for English as a Second Language learners and general study reviews.
                    </p>
                  </div>

                  <div className="glass-card p-6 rounded-xl space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900/40">
                      <Globe size={16} />
                    </div>
                    <h4 className="font-serif text-base text-neutral-200">Español (ES)</h4>
                    <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                      Una traducción rigurosa e integrada para toda la comunidad de habla hispana, preservando la profundidad teológica y la precisión científica de los episodios originales.
                    </p>
                  </div>
                </div>

                {/* offline capability module */}
                <div className={`glass-card p-6 rounded-xl border ${tColors.accentBorder} bg-gradient-to-r ${tColors.selectTabBg} to-neutral-950 flex flex-col md:flex-row items-center justify-between gap-6`}>
                  <div className="space-y-2">
                    <h4 className="font-serif text-base text-neutral-200 flex items-center gap-2">
                      <BookOpenCheck size={16} className={`${tColors.accentText} animate-pulse`} />
                      Offline-First PWA Technology
                    </h4>
                    <p className="font-sans text-xs text-neutral-400 max-w-2xl leading-relaxed">
                      This application incorporates a PWA Cache service worker. Once you open an episode, all of its accompanying study slides, specialized reports, and data parameters are stored directly on your phone or laptop. Study anywhere—even in remote retreats with zero internet connectivity.
                    </p>
                  </div>
                  <div className={`text-xs font-mono ${tColors.accentText} border ${tColors.badgeBorder} px-3 py-1.5 rounded-lg ${tColors.badgeBg} whitespace-nowrap`}>
                    Installed & Offline Ready
                  </div>
                </div>
              </motion.div>
            )}

            {/* EPISODES HUB HOMEVIEW */}
            {activeTab === 'hub' && !selectedEpisode && (
              <motion.div
                key="hub-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Search Bar / Filters */}
                <div className={`flex flex-col sm:flex-row items-center gap-4 ${isBright ? 'bg-white' : 'bg-[#0a0a0e]'} p-4 rounded-xl border ${borderMuted}`}>
                  <div className="relative w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search episodes, topics, or historical figures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full ${isBright ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-neutral-950 border-neutral-800 text-neutral-200'} border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:${tColors.selectActiveBorder} transition-colors`}
                    />
                  </div>
                </div>

                {/* Empty State */}
                {filteredEpisodes.length === 0 && (
                  <div className="text-center py-20 bg-neutral-900/20 rounded-xl border border-neutral-900">
                    <BookOpen size={48} className="mx-auto text-neutral-600 mb-4 stroke-1" />
                    <h3 className="font-serif text-lg text-neutral-400">No episodes matched your search</h3>
                    <p className="text-xs text-neutral-500 mt-1">Try resetting your keywords or filters</p>
                  </div>
                )}

                {/* Episodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEpisodes.map((episode, idx) => {
                    const title = episode.title[activeProfile] || episode.title['academic_en'];
                    const description = episode.description[activeProfile] || episode.description['academic_en'];
                    const dynamicModules = getDynamicTabs(episode);

                    return (
                      <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ scale: 1.005 }}
                        className={`glass-card p-6 rounded-2xl flex flex-col justify-between group cursor-pointer border border-neutral-900 transition-all ${tColors.cardHoverBorder}`}
                        onClick={() => setSelectedEpisode(episode)}
                        id={`episode-card-${episode.id}`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={`font-mono text-xs font-bold ${tColors.accentText} ${tColors.badgeBg} border ${tColors.badgeBorder} px-2.5 py-0.5 rounded`}>
                              Episode {episode.id}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                              <Calendar size={12} />
                              <span>{episode.publish_date}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className={`font-serif text-base md:text-lg font-bold text-neutral-100 ${tColors.groupHoverAccent} transition-colors line-clamp-1`}>
                              {title}
                            </h3>
                            <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed line-clamp-3">
                              {description}
                            </p>
                          </div>
                        </div>

                        {/* List of dynamic modules inside this card to show off structure */}
                        <div className="border-t border-neutral-900 pt-4 mt-5 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {dynamicModules.slice(2, 6).map((module) => (
                              <span key={module.id} className="text-[9px] font-mono font-medium tracking-wide uppercase bg-neutral-950 text-neutral-400 border border-neutral-900 px-1.5 py-0.5 rounded">
                                {module.label}
                              </span>
                            ))}
                          </div>
                          
                          <span className={`text-xs font-mono ${tColors.accentText} group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1`}>
                            Explore Assets <ChevronRight size={14} />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* EPISODE DETAIL STUDY VIEW */}
            {selectedEpisode && (
              <motion.div
                key={`detail-${selectedEpisode.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Back button header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEpisode(null)}
                    id="back-to-hub-btn"
                    className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 hover:text-indigo-300 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to Episodes
                  </button>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                    <span>Published: {selectedEpisode.publish_date}</span>
                  </div>
                </div>

                {/* Big detailed heading banner */}
                <div className="space-y-4">
                  <h2 className="font-serif text-xl md:text-3xl text-neutral-100 font-bold tracking-tight">
                    {selectedEpisode.title[activeProfile] || selectedEpisode.title['academic_en']}
                  </h2>
                  <p className="font-sans text-sm md:text-base text-neutral-400 leading-relaxed max-w-4xl">
                    {selectedEpisode.description[activeProfile] || selectedEpisode.description['academic_en']}
                  </p>
                </div>

                {/* 1. HTML5 Dual-Source Audio overview */}
                {selectedEpisode.audio_overview && (
                  <AudioPlayer
                    podcastUrl={
                      selectedEpisode.audio_overview.podcast_url_by_profile?.[activeProfile] ||
                      selectedEpisode.audio_overview.podcast_url
                    }
                    briefUrl={
                      selectedEpisode.audio_overview.brief_url_by_profile?.[activeProfile] ||
                      selectedEpisode.audio_overview.brief_url
                    }
                    activeProfile={activeProfile}
                  />
                )}

                {/* 2. Interactive Asset Tab Section (Dynamically generated tabs) */}
                <div className="space-y-6">
                  {/* Dynamic Tab Picker */}
                  <div className="border-b border-neutral-800 flex items-center overflow-x-auto custom-scrollbar gap-1.5 pb-px">
                    {getDynamicTabs(selectedEpisode).map((tab) => (
                      <button
                        key={tab.id}
                        id={`asset-tab-${tab.id}`}
                        onClick={() => setSelectedAssetTab(tab.id)}
                        className={`px-4 py-3 rounded-t-xl text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                          selectedAssetTab === tab.id
                            ? `${tColors.selectActiveBorder} ${tColors.accentText} ${tColors.selectTabBg} font-semibold`
                            : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/20'
                        }`}
                      >
                        {tab.id === 'executive_summary' && <FileText size={12} className={tColors.iconColor} />}
                        {tab.id === 'timeline' && <Play size={12} className={`fill-current/10 ${tColors.iconColor}`} />}
                        {tab.id === 'quotes' && <Quote size={12} className={tColors.iconColor} />}
                        {tab.id === 'mind_map' && <Cpu size={12} className={tColors.iconColor} />}
                        {tab.id === 'infographic' && <Sparkles size={12} className={tColors.iconColor} />}
                        {tab.id === 'book_review' && <BookOpen size={12} className={tColors.iconColor} />}
                        {tab.id === 'inspiring_story' && <Flame size={12} className={tColors.iconColor} />}
                        {tab.id === 'sources' && <Bookmark size={12} className={tColors.iconColor} />}
                        {tab.id.startsWith('custom_') && <Award size={12} className={tColors.iconColor} />}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active tab content container with motion animation transition */}
                  <div className="pt-4 min-h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedAssetTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedAssetTab === 'executive_summary' && selectedEpisode.study_modules.executive_summary && (
                          <ExecutiveSummary 
                            summaryData={selectedEpisode.study_modules.executive_summary} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'timeline' && (
                          <Timeline 
                            scenes={selectedEpisode.scenes} 
                            activeProfile={activeProfile} 
                            youtubeVideoId={selectedEpisode.youtube_video_id} 
                          />
                        )}

                        {selectedAssetTab === 'quotes' && (
                          <Quotations 
                            quotations={selectedEpisode.inspiring_quotations} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'mind_map' && (
                          <MindMap 
                            mindMapData={selectedEpisode.study_modules.mind_map} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'infographic' && (
                          <Infographic 
                            infographicData={selectedEpisode.study_modules.infographic} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'slide_decks' && (
                          <SlideDeckComponent 
                            slideDecks={selectedEpisode.study_modules.slide_decks} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'specialized_reports' && (
                          <ReportPanel 
                            reports={selectedEpisode.study_modules.specialized_reports} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'data_table' && (
                          <DataTable 
                            dataTableData={selectedEpisode.study_modules.data_table} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'book_review' && selectedEpisode.study_modules.book_review && (
                          <BookReviewComponent 
                            bookReviewData={selectedEpisode.study_modules.book_review} 
                            activeProfile={activeProfile} 
                          />
                        )}

                        {selectedAssetTab === 'inspiring_story' && selectedEpisode.study_modules.inspiring_story && (
                          <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8 rounded-2xl border border-amber-900/20 bg-gradient-to-tr from-neutral-950 via-[#0a0705] to-neutral-950">
                            <div className="flex items-center gap-3 border-b border-amber-900/10 pb-4">
                              <div className="w-10 h-10 rounded-full bg-amber-950/40 border border-amber-900/50 flex items-center justify-center text-amber-400">
                                <Flame size={20} className="animate-pulse" />
                              </div>
                              <div>
                                <h3 className="font-serif text-lg text-amber-200">Inspiring Narrative</h3>
                                <p className="text-[10px] font-mono text-neutral-500 uppercase">A Story of Discovery, Devotion, and Wisdom</p>
                              </div>
                            </div>
                            <div className="font-serif text-base md:text-lg text-neutral-300 leading-relaxed italic pr-4 pl-6 border-l-2 border-amber-500/30 whitespace-pre-line">
                              {selectedEpisode.study_modules.inspiring_story[activeProfile] || selectedEpisode.study_modules.inspiring_story['academic_en']}
                            </div>
                          </div>
                        )}

                        {selectedAssetTab === 'sources' && selectedEpisode.sources && (
                          <div className="space-y-6 max-w-4xl mx-auto p-4">
                            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-center text-indigo-400">
                                <Bookmark size={20} />
                              </div>
                              <div>
                                <h3 className="font-serif text-lg text-neutral-200">Sources & Reference Literature</h3>
                                <p className="text-[10px] font-mono text-neutral-500 uppercase">Primary Material, Academic Research & Scriptures Cited</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedEpisode.sources.map((source, idx) => (
                                <div key={idx} className="glass-card p-5 rounded-xl border border-neutral-800 bg-neutral-950/30 hover:border-neutral-700 transition-all">
                                  <div className="flex items-start justify-between gap-3">
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 uppercase tracking-wider">
                                      {source.type || 'literature'}
                                    </span>
                                    {source.url && (
                                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                                        <Link2 size={14} />
                                      </a>
                                    )}
                                  </div>
                                  <h4 className="font-serif text-base text-neutral-100 font-bold mt-2 leading-snug">
                                    {source.title}
                                  </h4>
                                  <p className="text-xs text-neutral-400 mt-1">
                                    {source.author} {source.year ? `(${source.year})` : ''}
                                  </p>
                                  {source.citation && (
                                    <p className="text-[11px] font-mono text-neutral-500 mt-3 border-t border-neutral-900 pt-2 italic">
                                      {source.citation}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedAssetTab.startsWith('custom_') && (
                          (() => {
                            const customId = selectedAssetTab.replace('custom_', '');
                            const section = selectedEpisode.study_modules?.custom_sections?.find(s => s.id === customId);
                            if (!section) return null;
                            const text = section.content[activeProfile] || section.content['academic_en'] || '';
                            return (
                              <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8 rounded-2xl border border-neutral-800 bg-gradient-to-tr from-neutral-950 via-[#09090d] to-neutral-950">
                                <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                                    <Award size={20} />
                                  </div>
                                  <div>
                                    <h3 className="font-serif text-lg text-neutral-200">{section.label}</h3>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase">Custom Dialogue Module</p>
                                  </div>
                                </div>
                                <div className="font-sans text-sm md:text-base text-neutral-300 leading-relaxed whitespace-pre-line">
                                  {text}
                                </div>
                              </div>
                            );
                          })()
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Creator's Reflection Notes Panel */}
                {selectedEpisode.study_modules.creator_reflection && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-2xl relative border-dashed border-indigo-900/40 bg-gradient-to-tr from-neutral-950 via-[#0c0c12]/60 to-neutral-950"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={16} className="text-indigo-400" />
                      <h4 className="font-serif text-sm md:text-base text-indigo-200">
                        Logos-Transmission Creator Reflection
                      </h4>
                    </div>
                    <p className="font-serif text-xs md:text-sm text-neutral-300 italic leading-relaxed pl-4 border-l border-indigo-900/50">
                      "{selectedEpisode.study_modules.creator_reflection[activeProfile] || selectedEpisode.study_modules.creator_reflection['academic_en']}"
                    </p>
                  </motion.div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* 3. MOBILE navigation bar (Stick bottom for small viewports) */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0e]/95 backdrop-blur-md border-t border-neutral-900/90 flex items-center justify-around px-4 z-30">
        <button
          onClick={() => { setActiveTab('hub'); setSelectedEpisode(null); }}
          className={`flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors ${
            activeTab === 'hub' && !selectedEpisode ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[10px] font-medium">Hub</span>
        </button>

        <button
          onClick={() => { setActiveTab('about'); setSelectedEpisode(null); }}
          className={`flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors ${
            activeTab === 'about' ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <Info size={18} />
          <span className="text-[10px] font-medium">About</span>
        </button>
      </footer>

    </div>
  );
}
