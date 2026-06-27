import React from 'react';
import { FileText, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { ExecutiveSummaryData, StudyProfile } from '../types';

interface ExecutiveSummaryProps {
  summaryData: ExecutiveSummaryData;
  activeProfile: StudyProfile;
}

export default function ExecutiveSummary({ summaryData, activeProfile }: ExecutiveSummaryProps) {
  const points = summaryData[activeProfile] || summaryData['academic_en'];

  // Multi-profile UI localized labels
  const labels = {
    academic_en: {
      title: "Executive Synthesis & Logical Proofs",
      subtitle: "Scholarly overview of core argumentative threads",
      badge: "Scholarly Synthesis",
      pointsHeader: "Key Argumentative Milestones"
    },
    esl_en: {
      title: "Simple Executive Summary",
      subtitle: "The main points of this talk explained simply",
      badge: "Simple Points",
      pointsHeader: "Main Lessons Learned"
    },
    translated_es: {
      title: "Síntesis Ejecutiva y Pruebas Lógicas",
      subtitle: "Resumen académico de los hilos argumentales principales",
      badge: "Síntesis Académica",
      pointsHeader: "Hitos Argumentativos Clave"
    },
    translated_id: {
      title: "Sintesis Eksekutif & Bukti Logis",
      subtitle: "Tinjauan akademis dari poin-poin argumentasi utama",
      badge: "Sintesis Akademis",
      pointsHeader: "Poin Argumentasi Utama"
    }
  };

  const l = labels[activeProfile] || labels['academic_en'];

  // Animation variants for staggered list entry
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -12, y: 5 },
    show: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
      id="executive-summary-panel"
    >
      {/* Banner/Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <FileText className="text-indigo-400" size={20} />
            <h3 className="font-serif text-lg text-indigo-200 font-medium">
              {l.title}
            </h3>
          </div>
          <p className="text-xs text-neutral-400">
            {l.subtitle}
          </p>
        </div>
        <span className="self-start sm:self-center text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-900/50 px-2.5 py-1 rounded-md">
          {l.badge}
        </span>
      </div>

      {/* Hero Core Concept Statement Card */}
      <div className="p-5 rounded-2xl relative overflow-hidden border border-indigo-950 bg-gradient-to-r from-indigo-950/20 via-[#0a0a10]/50 to-neutral-950/80">
        <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex gap-4 items-start">
          <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/30 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold">
              {activeProfile === 'esl_en' ? 'Core Thesis' : 'Central Logical Premise'}
            </h4>
            <p className="font-serif text-sm text-neutral-200 italic leading-relaxed">
              {activeProfile === 'academic_en' && '"The mathematical fine-tuning of cosmic parameters and low-entropy initial states presents a rigorous empirical challenge to materialism, pointing rationally toward a primary teleological source—the Logos."'}
              {activeProfile === 'esl_en' && '"The perfect rules and clean setup of our universe are not lucky accidents. They show a highly smart and powerful Creator designed our home with a plan."'}
              {activeProfile === 'translated_es' && '"El ajuste fino matemático de los parámetros cósmicos y los estados iniciales de baja entropía presenta un desafío empírico riguroso al materialismo, apuntando racionalmente hacia una fuente teleológica primaria: el Logos."'}
              {activeProfile === 'translated_id' && '"Penyelarasan halus matematis dari parameter kosmis dan tingkat entropi awal yang rendah menyajikan tantangan empiris yang kuat terhadap materialisme, menunjuk secara rasional kepada sumber teleologis utama—yaitu Logos."'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Bullet Points List */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold pl-1 flex items-center gap-2">
          <Bookmark size={12} className="text-neutral-500" />
          {l.pointsHeader}
        </h4>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4"
        >
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 hover:bg-neutral-900/10 hover:border-indigo-950 transition-all group"
            >
              {/* Animated Bullet Bullet Marker */}
              <div className="p-1 rounded-lg bg-[#0e0e15] border border-neutral-800 text-indigo-400 shrink-0 mt-0.5 group-hover:text-indigo-300 group-hover:border-indigo-900/50 transition-colors">
                <CheckCircle2 size={15} />
              </div>

              {/* Point content */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-500 font-semibold">
                  {activeProfile === 'academic_en' && `CORE ARGUMENT 0${idx + 1}`}
                  {activeProfile === 'esl_en' && `POINT ${idx + 1}`}
                  {activeProfile === 'translated_es' && `ARGUMENTO PRINCIPAL 0${idx + 1}`}
                  {activeProfile === 'translated_id' && `ARGUMEN UTAMA 0${idx + 1}`}
                </span>
                <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed group-hover:text-neutral-200 transition-colors">
                  {point}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
