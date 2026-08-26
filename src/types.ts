export type AspectRatio = '9:16' | '16:9' | '1:1';
export type VideoStyle = 
  | 'cinematic' 
  | 'anime' 
  | 'realistic_4k' 
  | 'cyberpunk' 
  | '3d_animation' 
  | 'vintage_film' 
  | 'watercolor' 
  | 'studio_portrait';

export type CameraMotion = 
  | 'zoom_in' 
  | 'zoom_out' 
  | 'pan_left' 
  | 'pan_right' 
  | 'orbit_360' 
  | 'drone_flythrough' 
  | 'static';

export type LanguageCode = 'en' | 'ur' | 'hi';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: LanguageCode;
  accent: string;
  sampleAudio?: string;
  geminiVoice?: string;
  previewText: string;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  prompt: string;
  type: 'text_to_video' | 'image_to_video';
  style: VideoStyle;
  aspectRatio: AspectRatio;
  durationSeconds: number;
  cameraMotion: CameraMotion;
  sourceImage?: string;
  videoUrl: string;
  thumbnailUrl: string;
  audioUrl?: string;
  subtitles?: string[];
  createdAt: number;
  language: LanguageCode;
  voiceId?: string;
  isFavorite?: boolean;
}

export interface GeneratedAudio {
  id: string;
  title: string;
  text: string;
  language: LanguageCode;
  voiceId: string;
  voiceName: string;
  gender: 'male' | 'female';
  audioUrl: string;
  durationSeconds: number;
  createdAt: number;
}

export interface UserSubscription {
  isPremium: boolean;
  tier: 'free' | 'monthly' | 'yearly' | 'lifetime';
  creditsRemaining: number;
  totalGenerations: number;
  expiresAt?: number;
}

export type ActiveTab = 'home' | 'text_to_video' | 'image_to_video' | 'text_to_speech' | 'history' | 'profile' | 'premium' | 'android_studio';
