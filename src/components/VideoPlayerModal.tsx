import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Download, Share2, Sparkles, X, Check, Copy, Film, Heart } from 'lucide-react';
import { GeneratedVideo, LanguageCode } from '../types';
import { VideoRenderer } from '../services/videoRenderer';
import { TTSService } from '../services/ttsService';

interface VideoPlayerModalProps {
  video: GeneratedVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onRemix: (video: GeneratedVideo) => void;
  onToggleFavorite: (id: string) => void;
  isPremium: boolean;
  language: LanguageCode;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
  onRemix,
  onToggleFavorite,
  isPremium,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen || !video) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioRef.current) audioRef.current.pause();
      TTSService.stopBrowserSpeech();
      return;
    }

    setIsPlaying(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    // Pre-load source image if applicable
    if (video.sourceImage) {
      VideoRenderer.loadImage(video.sourceImage).catch(() => {});
    }

    // Trigger TTS / audio if available
    if (video.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(video.audioUrl);
      } else {
        audioRef.current.src = video.audioUrl;
      }
      audioRef.current.loop = true;
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    } else if (video.subtitles && video.subtitles.length > 0) {
      TTSService.speakInBrowser(video.subtitles.join('. '), video.language);
    }

    const durationMs = (video.durationSeconds || 5) * 1000;

    const renderLoop = () => {
      if (isPlaying) {
        const elapsed = (Date.now() - startTimeRef.current) % durationMs;
        const currentProgress = elapsed / durationMs;
        setProgress(currentProgress);

        if (canvasRef.current) {
          const w = video.aspectRatio === '16:9' ? 640 : video.aspectRatio === '1:1' ? 480 : 360;
          const h = video.aspectRatio === '16:9' ? 360 : video.aspectRatio === '1:1' ? 480 : 640;

          VideoRenderer.renderFrame({
            canvas: canvasRef.current,
            width: w,
            height: h,
            progress: currentProgress,
            prompt: video.prompt,
            style: video.style,
            cameraMotion: video.cameraMotion,
            aspectRatio: video.aspectRatio,
            sourceImage: video.sourceImage || video.thumbnailUrl,
            subtitles: video.subtitles,
            isPremium,
          });
        }
      }
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioRef.current) audioRef.current.pause();
      TTSService.stopBrowserSpeech();
    };
  }, [isOpen, video, isPlaying, isPremium]);

  if (!isOpen || !video) return null;

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      TTSService.stopBrowserSpeech();
    } else {
      setIsPlaying(true);
      startTimeRef.current = Date.now() - progress * (video.durationSeconds * 1000);
      if (audioRef.current) audioRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) audioRef.current.muted = nextMute;
    if (nextMute) TTSService.stopBrowserSpeech();
  };

  const handleDownloadVideo = async () => {
    setIsDownloading(true);
    try {
      const w = video.aspectRatio === '16:9' ? 640 : video.aspectRatio === '1:1' ? 480 : 360;
      const h = video.aspectRatio === '16:9' ? 360 : video.aspectRatio === '1:1' ? 480 : 640;

      const blob = await VideoRenderer.exportVideoBlob(
        {
          width: w,
          height: h,
          prompt: video.prompt,
          style: video.style,
          cameraMotion: video.cameraMotion,
          aspectRatio: video.aspectRatio,
          sourceImage: video.sourceImage || video.thumbnailUrl,
          subtitles: video.subtitles,
          isPremium,
        },
        video.durationSeconds || 5,
        30
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zaro_ai_${video.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this AI Video created with Zaro AI Video: "${video.prompt}"`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(
        `Check out this AI Video made with Zaro AI Video: ${video.title} - ${window.location.href}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      id="video-player-modal-backdrop"
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in select-none"
    >
      <div
        id="video-player-container"
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] relative"
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 truncate pr-2">
            <Film className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-100 truncate">{video.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="player-favorite-btn"
              onClick={() => onToggleFavorite(video.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                video.isFavorite ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 bg-zinc-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${video.isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              id="player-close-btn"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px]">
          <canvas
            ref={canvasRef}
            className={`max-w-full max-h-[58vh] object-contain shadow-2xl transition-all ${
              video.aspectRatio === '9:16'
                ? 'aspect-[9/16] rounded-2xl border border-zinc-800'
                : video.aspectRatio === '16:9'
                ? 'aspect-[16/9] rounded-xl border border-zinc-800'
                : 'aspect-square rounded-xl border border-zinc-800'
            }`}
          />

          {/* Quick Play Overlay Icon when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute w-14 h-14 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-2xl transition-transform active:scale-95"
            >
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            </button>
          )}

          {/* Aspect Ratio & Style Pill Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-200 uppercase">
              {video.aspectRatio}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-600/80 backdrop-blur-md border border-indigo-500/30 text-[10px] font-bold text-white uppercase">
              {video.style.replace('_', ' ')}
            </span>
          </div>

          {/* Audio Mute button overlay */}
          <button
            id="player-mute-toggle-btn"
            onClick={toggleMute}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all z-10"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col gap-3">
          {/* Progress Timeline */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400">
              {(progress * video.durationSeconds).toFixed(1)}s
            </span>

            <div
              className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                setProgress(clickPos);
                startTimeRef.current = Date.now() - clickPos * (video.durationSeconds * 1000);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <span className="text-[10px] font-mono text-zinc-400">
              {video.durationSeconds}.0s
            </span>
          </div>

          {/* Control Bar Actions */}
          <div className="flex items-center justify-between gap-2">
            <button
              id="player-toggle-play-btn"
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 text-xs font-semibold"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-zinc-100" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              id="player-download-btn"
              onClick={handleDownloadVideo}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved to Device!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </>
              )}
            </button>

            <button
              id="player-share-btn"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 text-xs font-semibold"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Remix Prompt Bar */}
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between gap-2">
            <p className="text-[11px] text-zinc-300 line-clamp-1 italic">
              "{video.prompt}"
            </p>
            <button
              id="player-remix-btn"
              onClick={() => {
                onRemix(video);
                onClose();
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Remix</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
