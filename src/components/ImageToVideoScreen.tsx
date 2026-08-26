import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Sparkles, Wand2, Film, RefreshCw, AlertCircle, Camera, Check } from 'lucide-react';
import { AspectRatio, CameraMotion, GeneratedVideo, LanguageCode, UserSubscription, VideoStyle } from '../types';
import { ASPECT_RATIOS, CAMERA_MOTIONS, SAMPLE_STARTING_IMAGES, UI_TRANSLATIONS } from '../data/mockData';
import { GeminiService } from '../services/geminiService';

interface ImageToVideoScreenProps {
  subscription: UserSubscription;
  language: LanguageCode;
  onVideoGenerated: (video: GeneratedVideo) => void;
  onConsumeCredit: () => boolean;
  onOpenRewardedAd: () => void;
  onOpenPremium: () => void;
}

export const ImageToVideoScreen: React.FC<ImageToVideoScreenProps> = ({
  subscription,
  language,
  onVideoGenerated,
  onConsumeCredit,
  onOpenRewardedAd,
  onOpenPremium,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isRtl = language === 'ur';

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_STARTING_IMAGES[0].url);
  const [imageName, setImageName] = useState<string>(SAMPLE_STARTING_IMAGES[0].name);
  const [motionPrompt, setMotionPrompt] = useState<string>(SAMPLE_STARTING_IMAGES[0].prompt);
  const [cameraMotion, setCameraMotion] = useState<CameraMotion>('zoom_in');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [duration, setDuration] = useState<number>(5);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setImageName(file.name);
          setMotionPrompt('Fluid camera motion, atmospheric living environment, sharp 4k detail');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select or upload an image first.');
      return;
    }

    if (!subscription.isPremium && subscription.creditsRemaining <= 0) {
      onOpenRewardedAd();
      return;
    }

    const success = onConsumeCredit();
    if (!success) {
      onOpenRewardedAd();
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationProgress(15);

    const progressTimer = setInterval(() => {
      setGenerationProgress((p) => {
        if (p >= 90) return p;
        return p + 15;
      });
    }, 400);

    try {
      // Simulate/Trigger Image-to-Video generation pipeline
      setTimeout(() => {
        clearInterval(progressTimer);
        setGenerationProgress(100);

        const newVideo: GeneratedVideo = {
          id: `img_vid_${Date.now()}`,
          title: `Animated ${imageName || 'Photo'}`,
          prompt: motionPrompt || 'Smooth cinematic image animation',
          type: 'image_to_video',
          style: 'realistic_4k',
          aspectRatio: aspectRatio,
          durationSeconds: duration,
          cameraMotion: cameraMotion,
          sourceImage: selectedImage,
          thumbnailUrl: selectedImage,
          videoUrl: '',
          createdAt: Date.now(),
          language: language,
          isFavorite: false,
        };

        setIsGenerating(false);
        onVideoGenerated(newVideo);
      }, 2200);
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Failed to animate image.');
    }
  };

  return (
    <div id="image-to-video-screen" className="p-4 flex flex-col gap-5">
      {/* Upload / Preview Hero Card */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1 flex items-center justify-between">
          <span>{t.uploadImage}</span>
          <button
            id="choose-image-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Selected Image Stage */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative h-60 rounded-3xl overflow-hidden bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-pink-500 cursor-pointer group flex items-center justify-center transition-all shadow-inner"
        >
          {selectedImage ? (
            <>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs">
                <Camera className="w-4 h-4" />
                <span>Click to change photo</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-400 p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-zinc-300">Tap to upload your image</span>
              <span className="text-[10px] text-zinc-500">Supports PNG, JPG, WEBP</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Sample Images Carousel */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Or Choose a Preset Image
        </label>

        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_STARTING_IMAGES.map((sample) => {
            const isSelected = selectedImage === sample.url;
            return (
              <button
                key={sample.id}
                onClick={() => {
                  setSelectedImage(sample.url);
                  setImageName(sample.name);
                  setMotionPrompt(sample.prompt);
                }}
                className={`relative rounded-2xl overflow-hidden aspect-square border transition-all ${
                  isSelected
                    ? 'border-pink-500 ring-2 ring-pink-500/50 shadow-md'
                    : 'border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation Motion Prompt */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
          {t.imageMotionPrompt}
        </label>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-pink-500 transition-colors p-3">
          <textarea
            id="image-to-video-prompt-input"
            value={motionPrompt}
            onChange={(e) => setMotionPrompt(e.target.value)}
            placeholder="Describe what parts of the photo should move..."
            rows={2}
            className="w-full bg-transparent text-zinc-100 text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Camera Motion & Aspect Ratio Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Camera Motion */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
            {t.cameraMotion}
          </label>
          <select
            id="image-motion-select"
            value={cameraMotion}
            onChange={(e) => setCameraMotion(e.target.value as CameraMotion)}
            className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-medium focus:outline-none focus:border-pink-500"
          >
            {CAMERA_MOTIONS.map((cm) => (
              <option key={cm.id} value={cm.id} className="bg-zinc-900 text-zinc-100">
                {language === 'ur' ? cm.nameUr : language === 'hi' ? cm.nameHi : cm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Aspect Ratio */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
            {t.aspectRatio}
          </label>
          <div className="grid grid-cols-3 gap-1.5 h-11 bg-zinc-900 rounded-2xl border border-zinc-800 p-1">
            {ASPECT_RATIOS.map((item) => (
              <button
                key={item.id}
                onClick={() => setAspectRatio(item.id)}
                className={`rounded-xl text-xs font-bold transition-all ${
                  aspectRatio === item.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Animate Button */}
      <div className="pt-2">
        <button
          id="image-to-video-generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-pink-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>{t.generateFromImage}</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
            {subscription.isPremium ? 'PRO' : '1 Credit'}
          </span>
        </button>
      </div>

      {/* Loading Dialog */}
      {isGenerating && (
        <div
          id="image-generation-progress-overlay"
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-pink-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
              <ImageIcon className="w-8 h-8 text-pink-400" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Synthesizing Image Motion
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs">
              Calculating optical motion flow and 3D depth parallax...
            </p>

            <div className="w-full bg-zinc-800 rounded-full h-2 my-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {generationProgress}% • Optical Flow Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
