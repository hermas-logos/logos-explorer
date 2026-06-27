export type StudyProfile = 'academic_en' | 'esl_en' | 'translated_es' | 'translated_id';

export interface ProfileMappedString {
  academic_en: string;
  esl_en: string;
  translated_es: string;
  translated_id: string;
}

export interface Scene {
  timestamp_seconds: number;
  title: ProfileMappedString;
  description: ProfileMappedString;
}

export interface Quotation {
  author: string;
  historical_role: string;
  quote_text: ProfileMappedString;
}

export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}

export interface Metric {
  label: string;
  value: string;
  sub: string;
}

export interface InfographicData {
  title: string;
  metrics: Metric[];
  takeaways: string[];
}

export interface SlideDeckSlide {
  slide_number: number;
  title: ProfileMappedString;
  bullets: ProfileMappedString; // Wait, bullets can be a list of strings mapped by profile! Let's check how we modeled it in the JSON:
  // In the JSON, we have: "bullets": { "academic_en": [ "..." ], "esl_en": [ "..." ], "translated_es": [ "..." ] }
}

export interface SlideDeck {
  slide_number: number;
  title: ProfileMappedString;
  bullets: {
    academic_en: string[];
    esl_en: string[];
    translated_es: string[];
    translated_id: string[];
  };
}

export interface SpecializedReportData {
  title: string;
  body: string;
}

export interface DataTableConstantRow {
  constant: ProfileMappedString;
  symbol: string;
  value: string;
  tolerance: ProfileMappedString;
  implication: ProfileMappedString;
}

export interface DataTableData {
  headers: {
    academic_en: string[];
    esl_en: string[];
    translated_es: string[];
    translated_id: string[];
  };
  rows: DataTableConstantRow[];
}

export interface BookChapterRecommendation {
  chapter: string;
  description: string;
}

export interface BookReview {
  title: string;
  author: string;
  publish_year: string;
  rating: number; // e.g., 5
  overview: string;
  key_takeaways: string[];
  scientific_theological_alignment: string;
  recommended_chapters: BookChapterRecommendation[];
}

export interface BookReviewData {
  academic_en: BookReview;
  esl_en: BookReview;
  translated_es: BookReview;
  translated_id: BookReview;
}

export interface ExecutiveSummaryData {
  academic_en: string[];
  esl_en: string[];
  translated_es: string[];
  translated_id: string[];
}

export interface EpisodeSource {
  title: string;
  description: string;
  url: string;
}

export interface CustomSection {
  id: string;
  label: string;
  content: ProfileMappedString;
}

export interface StudyModules {
  mind_map: {
    academic_en: MindMapNode;
    esl_en: MindMapNode;
    translated_es: MindMapNode;
    translated_id: MindMapNode;
  };
  infographic: {
    academic_en: InfographicData;
    esl_en: InfographicData;
    translated_es: InfographicData;
    translated_id: InfographicData;
  };
  slide_decks: SlideDeck[];
  specialized_reports: {
    academic_en: SpecializedReportData;
    esl_en: SpecializedReportData;
    translated_es: SpecializedReportData;
    translated_id: SpecializedReportData;
  };
  data_table: DataTableData;
  creator_reflection: ProfileMappedString;
  book_review?: BookReviewData;
  executive_summary?: ExecutiveSummaryData;
  inspiring_story?: ProfileMappedString;
  custom_sections?: CustomSection[];
}

export interface Episode {
  id: string;
  title: ProfileMappedString;
  description: ProfileMappedString;
  publish_date: string;
  youtube_video_id: string;
  audio_overview: {
    podcast_url: string;
    brief_url: string;
    podcast_url_by_profile?: {
      academic_en?: string;
      esl_en?: string;
      translated_es?: string;
      translated_id?: string;
    };
    brief_url_by_profile?: {
      academic_en?: string;
      esl_en?: string;
      translated_es?: string;
      translated_id?: string;
    };
  };
  scenes: Scene[];
  inspiring_quotations: Quotation[];
  study_modules: StudyModules;
  sources?: EpisodeSource[];
}
