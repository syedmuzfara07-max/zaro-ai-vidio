import React from 'react';
import { Clapperboard, Image as ImageIcon, Mic, Sparkles, Crown, Play, ArrowRight, TrendingUp, Zap, Wand2, Globe, Heart } from 'lucide-react';
import { ActiveTab, GeneratedVideo, LanguageCode, UserSubscription } from '../types';
import { SAMPLE_PROMPTS, UI_TRANSLATIONS, VIDEO_STYLES } from '../data/mockData';

interface HomeScreenProps {
  setActiveTab: (tab: ActiveTab) => void;
  subscription: UserSubscription;
  language: LanguageCode;
  onOpenPremium: () => void;
  onOpenRewardedAd: () => void;
  onSelectPrompt: (promptText: string, styleId?: string, ratio?: string) => void;
  recentVideos: GeneratedVideo[];
  onPlayVideo: (video: GeneratedVideo) => void;
  onToggleFavorite: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveTab,
  subscription,
  language,
  onOpenPremium,
  onOpenRewardedAd,
  onSelectPrompt,
  recentVideos,
  onPlayVideo,
  onToggleFavorite,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isRtl = language === 'ur';

  return (
    <div id="home-screen-container" className="p-4 flex flex-col gap-5">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-950 to-zinc-950 border border-indigo-500/30 p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Video Generation</span>
            </span>

            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
              <Globe className="w-3 h-3 text-indigo-400" />
              <span>Urdu • Hindi • English</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Create Stunning AI Videos in Seconds
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-sm">
              Convert text prompts & photos into cinematic short videos with realistic AI voiceovers.
            </p>
          </div>

          {/* Credits status & Upgrade Bar */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-200">
                  {subscription.isPremium ? 'Unlimited Pro Access' : `${subscription.creditsRemaining} Free Generations`}
                </p>
                <p className="text-[9px] text-zinc-400">
                  {subscription.isPremium ? 'Fast cloud queue active' : 'Watch ads to recharge anytime'}
                </p>
              </div>
            </div>

            {!subscription.isPremium ? (
              <button
                id="home-watch-ad-btn"
                onClick={onOpenRewardedAd}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>+2 Credits</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                PRO ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main 3 Quick Feature Launchers */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Creation Studio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Text to Video Card */}
          <button
            id="home-action-text-to-video"
            onClick={() => setActiveTab('text_to_video')}
            className="p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-indigo-500/50 flex flex-col justify-between text-left group transition-all shadow-md active:scale-98"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clapperboard className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold">
                9:16 / 16:9
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                {t.textToVideo}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Write a prompt, select cinematography style, and render video.
              </p>
            </div>
          </button>

          {/* Image to Video Card */}
          <button
            id="home-action-image-to-video"
            onClick={() => setActiveTab('image_to_video')}
            className="p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-pink-500/50 flex flex-col justify-between text-left group transition-all shadow-md active:scale-98"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-11 h-11 rounded-2xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 text-[10px] font-bold">
                Motion AI
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100 group-hover:text-pink-300 transition-colors">
                {t.imageToVideo}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Upload your photos and animate them with dynamic camera flows.
              </p>
            </div>
          </button>

          {/* Text to Voice / Speech Card */}
          <button
            id="home-action-text-to-voice"
            onClick={() => setActiveTab('text_to_speech')}
            className="p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/50 flex flex-col justify-between text-left group transition-all shadow-md active:scale-98"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">
                Urdu / Hindi
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                {t.textToVoice}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Natural AI voiceovers in Urdu, Hindi & English for reels & shorts.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Trending Prompt Ideas */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Trending Prompts & Styles
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400">1-Tap to Generate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_PROMPTS.map((sample, idx) => {
            const title = language === 'ur' ? sample.titleUr : language === 'hi' ? sample.titleHi : sample.title;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between gap-2.5 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-amber-300 text-[10px] font-bold">
                      {sample.tag}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">
                      {sample.aspectRatio}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-100">{title}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                    "{sample.prompt}"
                  </p>
                </div>

                <button
                  id={`try-prompt-btn-${idx}`}
                  onClick={() => {
                    onSelectPrompt(sample.prompt, sample.style, sample.aspectRatio);
                    setActiveTab('text_to_video');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-indigo-600 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Use This Prompt</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Creations Reel */}
      {recentVideos.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Recent Creations
            </h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recentVideos.slice(0, 3).map((vid) => (
              <div
                key={vid.id}
                onClick={() => onPlayVideo(vid)}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-indigo-500/60 aspect-[9/14] cursor-pointer shadow-md transition-all flex flex-col justify-end p-3"
              >
                {/* Background Thumbnail */}
                <img
                  src={vid.thumbnailUrl || vid.sourceImage}
                  alt={vid.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Favorite Heart Badge */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(vid.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-zinc-300 hover:text-rose-500 transition-colors z-10"
                >
                  <Heart className={`w-3.5 h-3.5 ${vid.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Play Button Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>

                {/* Bottom Metadata */}
                <div className="relative z-10">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-600/80 text-[9px] font-bold text-white uppercase">
                    {vid.aspectRatio}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate mt-1">{vid.title}</h4>
                  <p className="text-[10px] text-zinc-300">{vid.durationSeconds}s • {vid.style}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
