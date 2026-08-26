import React, { useState } from 'react';
import { History, Film, Play, Trash2, Heart, Download, Share2, Sparkles, Plus, Mic } from 'lucide-react';
import { GeneratedVideo, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface HistoryScreenProps {
  videos: GeneratedVideo[];
  onPlayVideo: (video: GeneratedVideo) => void;
  onDeleteVideo: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateCreate: () => void;
  language: LanguageCode;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  videos,
  onPlayVideo,
  onDeleteVideo,
  onToggleFavorite,
  onNavigateCreate,
  language,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isRtl = language === 'ur';

  const [activeFilter, setActiveFilter] = useState<'all' | 'videos' | 'favorites'>('all');

  const filteredVideos = videos.filter((v) => {
    if (activeFilter === 'favorites') return v.isFavorite;
    if (activeFilter === 'videos') return v.type === 'text_to_video' || v.type === 'image_to_video';
    return true;
  });

  return (
    <div id="history-screen" className="p-4 flex flex-col gap-4">
      {/* Top Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {[
          { id: 'all' as const, label: 'All Creations', count: videos.length },
          { id: 'videos' as const, label: 'Videos', count: videos.filter(v => v.type === 'text_to_video' || v.type === 'image_to_video').length },
          { id: 'favorites' as const, label: 'Favorites', count: videos.filter(v => v.isFavorite).length },
        ].map((chip) => {
          const isSelected = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span>{chip.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-indigo-700 text-indigo-200' : 'bg-zinc-800 text-zinc-500'}`}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Creations */}
      {filteredVideos.length === 0 ? (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3 bg-zinc-900/60 rounded-3xl border border-zinc-800">
          <div className="w-14 h-14 rounded-3xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Film className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-200">{t.noHistoryYet}</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">{t.noHistoryDesc}</p>
          </div>
          <button
            onClick={onNavigateCreate}
            className="mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create AI Video</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onPlayVideo(video)}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-indigo-500/60 aspect-[9/13] cursor-pointer shadow-md transition-all flex flex-col justify-between p-3"
            >
              {/* Thumbnail Image */}
              <img
                src={video.thumbnailUrl || video.sourceImage}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

              {/* Top Bar on Card */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-zinc-200 uppercase border border-white/10">
                  {video.aspectRatio}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(video.id);
                    }}
                    className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-zinc-300 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-3 h-3 ${video.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVideo(video.id);
                    }}
                    className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Center Play Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              </div>

              {/* Bottom Metadata */}
              <div className="relative z-10">
                <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-zinc-300 mt-0.5">
                  <span>{video.durationSeconds}s</span>
                  <span className="capitalize">{video.style.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
