import React from 'react';
import { BookOpen, Star, Award, BookMarked, ThumbsUp, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { BookReviewData, StudyProfile } from '../types';

interface BookReviewProps {
  bookReviewData: BookReviewData;
  activeProfile: StudyProfile;
}

export default function BookReviewComponent({ bookReviewData, activeProfile }: BookReviewProps) {
  const review = bookReviewData[activeProfile] || bookReviewData['academic_en'];

  // Labels based on selected profile language
  const labels = {
    academic_en: {
      sectionTitle: "Selected Theological-Scientific Literature Review",
      authorLabel: "Author",
      publishedLabel: "Published",
      ratingLabel: "Academic Rating",
      overviewTab: "Executive Overview",
      takeawaysTab: "Key Cognitive Takeaways",
      alignmentTab: "Scientific-Theological Syntheses",
      chaptersTab: "Essential Chapter Guidance",
      takeawaysTitle: "Key Scholarly Takeaways",
      alignmentTitle: "Cosmic Integration Reflection",
      recommendedTitle: "Recommended Chapters for Study"
    },
    esl_en: {
      sectionTitle: "Book Review for Your Study",
      authorLabel: "Who wrote it",
      publishedLabel: "Year made",
      ratingLabel: "Our Score",
      overviewTab: "Summary of Book",
      takeawaysTab: "Important Lessons",
      alignmentTab: "Science & Faith Connection",
      chaptersTab: "Best Chapters to Read",
      takeawaysTitle: "Important Lessons to Learn",
      alignmentTitle: "How Science and Faith Meet",
      recommendedTitle: "Great Chapters to Read First"
    },
    translated_es: {
      sectionTitle: "Reseña de Literatura Teológica-Científica Seleccionada",
      authorLabel: "Autor",
      publishedLabel: "Publicado",
      ratingLabel: "Calificación Académica",
      overviewTab: "Resumen Ejecutivo",
      takeawaysTab: "Puntos Clave de Aprendizaje",
      alignmentTab: "Síntesis Científico-Teológica",
      chaptersTab: "Capítulos Esenciales Recomendados",
      takeawaysTitle: "Puntos de Aprendizaje Clave",
      alignmentTitle: "Reflexión sobre Integración Cósmica",
      recommendedTitle: "Capítulos Recomendados para el Estudio"
    },
    translated_id: {
      sectionTitle: "Ulasan Literatur Teologis-Ilmiah Pilihan",
      authorLabel: "Penulis",
      publishedLabel: "Tahun Terbit",
      ratingLabel: "Peringkat Akademis",
      overviewTab: "Ringkasan Eksekutif",
      takeawaysTab: "Poin Pembelajaran Utama",
      alignmentTab: "Sintesis Ilmiah-Teologis",
      chaptersTab: "Rekomendasi Bab Esensial",
      takeawaysTitle: "Poin-Poin Penting untuk Dipahami",
      alignmentTitle: "Refleksi Integrasi Kosmis",
      recommendedTitle: "Rekomendasi Bab untuk Dipelajari"
    }
  };

  const l = labels[activeProfile] || labels['academic_en'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
      id="book-review-panel"
    >
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="text-indigo-400" size={20} />
          <h3 className="font-serif text-lg text-indigo-200 font-medium">
            {l.sectionTitle}
          </h3>
        </div>
        <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800/60">
          {review.publish_year} Edition
        </span>
      </div>

      {/* Main Grid: Book Cover & Quick Specs + Full Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column 1: Book Visual & Metadata */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-stretch space-y-6">
          
          {/* Cover Art Card */}
          <div className="w-64 lg:w-full h-80 rounded-2xl relative overflow-hidden shadow-2xl border border-indigo-900/30 bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 flex flex-col justify-between p-6 group">
            <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Spine Highlight */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-indigo-600/30 border-r border-indigo-500/10" />

            {/* Book Header */}
            <div className="pl-4 space-y-2">
              <BookMarked size={28} className="text-indigo-400 animate-pulse" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded inline-block">
                LOGOS STUDY CHOICE
              </div>
            </div>

            {/* Book Title & Author on Cover */}
            <div className="pl-4 space-y-3">
              <h4 className="font-serif text-lg lg:text-xl font-bold text-neutral-100 tracking-tight leading-snug group-hover:text-indigo-200 transition-colors">
                {review.title}
              </h4>
              <p className="font-sans text-xs text-neutral-400">
                {review.author}
              </p>
            </div>

            {/* Book Footer on Cover */}
            <div className="pl-4 border-t border-neutral-900 pt-3 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>{review.publish_year}</span>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={10} className="fill-amber-500" />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Specs List */}
          <div className="w-full bg-[#0a0a0e]/40 border border-neutral-900/80 rounded-xl p-4 space-y-3.5">
            <div className="flex justify-between text-xs border-b border-neutral-900/60 pb-2">
              <span className="text-neutral-500">{l.authorLabel}</span>
              <span className="text-neutral-300 font-medium text-right">{review.author}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-neutral-900/60 pb-2">
              <span className="text-neutral-500">{l.publishedLabel}</span>
              <span className="text-neutral-300 font-mono">{review.publish_year}</span>
            </div>
            <div className="flex justify-between text-xs pb-1">
              <span className="text-neutral-500">{l.ratingLabel}</span>
              <div className="flex items-center gap-1">
                <span className="text-amber-400 font-bold font-mono text-xs">{review.rating}.0 / 5.0</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Column 2: Full Tabbed Content (Overview, Takeaways, Alignment, Recommendations) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Summary / Overview */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden border border-neutral-800/80">
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
            <h4 className="font-serif text-base text-neutral-100 font-semibold mb-3 flex items-center gap-2">
              <Award size={16} className="text-indigo-400" />
              {l.overviewTab}
            </h4>
            <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed">
              {review.overview}
            </p>
          </div>

          {/* Key Takeaways Section */}
          <div className="glass-card p-6 rounded-2xl border border-neutral-800/80 space-y-4">
            <h4 className="font-serif text-base text-neutral-100 font-semibold flex items-center gap-2 border-b border-neutral-900 pb-2">
              <ThumbsUp size={16} className="text-emerald-400" />
              {l.takeawaysTitle}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {review.key_takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex gap-3 bg-[#0a0a0e]/60 border border-neutral-900/60 p-3 rounded-xl hover:border-indigo-900/40 transition-all">
                  <span className="text-indigo-400 font-mono text-xs font-bold bg-indigo-950/40 w-5 h-5 rounded flex items-center justify-center shrink-0 border border-indigo-900/40">
                    {idx + 1}
                  </span>
                  <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alignment Module */}
          <div className="p-6 rounded-2xl relative border border-dashed border-indigo-900/40 bg-gradient-to-tr from-neutral-950 via-[#0c0c12]/60 to-neutral-950">
            <h4 className="font-serif text-sm md:text-base text-indigo-200 font-semibold mb-3 flex items-center gap-2">
              <BookMarked size={16} className="text-indigo-400" />
              {l.alignmentTitle}
            </h4>
            <p className="font-serif text-xs md:text-sm text-neutral-300 leading-relaxed italic border-l-2 border-indigo-500/40 pl-4">
              "{review.scientific_theological_alignment}"
            </p>
          </div>

          {/* Recommended Chapters */}
          <div className="glass-card p-6 rounded-2xl border border-neutral-800/80 space-y-4">
            <h4 className="font-serif text-base text-neutral-100 font-semibold flex items-center gap-2 border-b border-neutral-900 pb-2">
              <ArrowRight size={16} className="text-indigo-400 animate-pulse" />
              {l.recommendedTitle}
            </h4>
            <div className="space-y-3 pt-1">
              {review.recommended_chapters.map((chap, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 bg-neutral-950/60 border border-neutral-900 rounded-xl hover:bg-neutral-900/20 transition-all">
                  <div className="font-serif text-xs md:text-sm text-indigo-300 font-medium sm:w-1/3 shrink-0">
                    {chap.chapter}
                  </div>
                  <div className="font-sans text-xs text-neutral-400 leading-relaxed sm:w-2/3">
                    {chap.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
