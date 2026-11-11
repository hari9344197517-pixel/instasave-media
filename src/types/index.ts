export type DownloadCategory =
  | 'video'
  | 'reels'
  | 'story'
  | 'photo'
  | 'audio';

export interface MediaItem {
  id: string;
  type: 'video' | 'photo' | 'audio' | 'profile';
  url: string;
  thumbnail: string;
  quality: string;
  width?: number;
  height?: number;
  formattedSize?: string;
  duration?: string;
  downloadFilename: string;
}

export interface ExtractionResult {
  success: boolean;
  category: DownloadCategory | string;
  sourceUrl: string;
  title: string;
  caption?: string;
  author: {
    username: string;
    fullName?: string;
    avatarUrl?: string;
    verified?: boolean;
  };
  metrics?: {
    likes?: string;
    views?: string;
    comments?: string;
  };
  items: MediaItem[];
  supportedQualities?: string[];
  notice?: string;
  error?: string;
  message?: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  category: string;
  title: string;
  thumbnail: string;
  author: string;
  downloadUrl: string;
  filename: string;
  quality: string;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'hi' | 'id';

export interface CategoryInfo {
  id: DownloadCategory;
  nameKey: string;
  defaultName: string;
  iconName: string;
  heroHeading: string;
  heroSubtitle: string;
  inputPlaceholder: string;
  sampleUrl: string;
  instructions: {
    step1: string;
    step2: string;
    step3: string;
  };
  description: string;
  supportedFormats: string[];
}
