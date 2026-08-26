import React, { useState } from 'react';
import { Sparkles, Wand2, Play, Volume2, Film, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, Layers } from 'lucide-react';
import { AspectRatio, CameraMotion, GeneratedVideo, LanguageCode, UserSubscription, VideoStyle } from '../types';
import { ASPECT_RATIOS, CAMERA_MOTIONS, UI_TRANSLATIONS, VIDEO_STYLES, VOICE_OPTIONS } from '../data/mockData';
import { GeminiService } from '../services/geminiService';
import { TTSService } from '../services/ttsService';

interface TextToVideoScreenProps {
  subscription: UserSubscription;
  language: LanguageCode;
  initialPrompt?: string;
  initialStyle?: VideoStyle;
  initialRatio?: AspectRatio;
  onVideoGenerated: (video: GeneratedVideo) => void;
  onConsumeCredit: () => boolean;
  onOpenRewardedAd: () => void;
  onOpenPremium: () => void;
}

export const TextToVideoScreen: React.FC<TextToVideoScreenProps> = ({
  subscription,
  language,
  initialPrompt = '',
  initialStyle = 'cinematic',
  initialRatio = '9:16',
  onVideoGenerated,
  onConsumeCredit,
  onOpenRewardedAd,
  onOpenPremium,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isRtl = language === 'ur';

  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState<VideoStyle>(initialStyle);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(initialRatio);
  const [cameraMotion, setCameraMotion] = useState<CameraMotion>('pan_right');
  const [duration, setDuration] = useState<number>(5);
  const [selectedVoice, setSelectedVoice] = useState<string>('en_zephyr');
  const [includeVoiceover, setIncludeVoiceover] = useState(true);
  const [voiceoverLanguage, setVoiceoverLanguage] = useState<LanguageCode>(language);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // AI Prompt Enhancer
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await GeminiService.enhancePrompt(prompt, style, language);
      if (res && res.enhancedPrompt) {
        setPrompt(res.enhancedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Video
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a description for your video prompt.');
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
    setGenerationStep(1);
    setGenerationProgress(10);

    try {
      // Step 1: Analyze prompt & storyboarding
      const scriptData = await GeminiService.generateScriptAndScenes(prompt, voiceoverLanguage, duration);
      setGenerationStep(2);
      setGenerationProgress(30);

      // Step 2: Visual Frame Generation (Server AI or fallback procedural imagery)
      const sceneVisualUrl = await GeminiService.generateSceneVisual(prompt, aspectRatio, style);
      setGenerationStep(3);
      setGenerationProgress(60);

      // Step 3: Audio synthesis if voiceover enabled
      let audioResult: { audioUrl?: string; durationSeconds: number } | null = null;
      if (includeVoiceover && scriptData.script) {
        const voiceObj = VOICE_OPTIONS.find(v => v.id === selectedVoice);
        audioResult = await TTSService.synthesizeSpeech(
          scriptData.script,
          voiceObj?.geminiVoice || 'Zephyr',
          voiceoverLanguage
        );
      }
      setGenerationStep(4);
      setGenerationProgress(85);

      // Step 4: Final composite render
      const newVideo: GeneratedVideo = {
        id: `vid_${Date.now()}`,
        title: scriptData.title || prompt.slice(0, 30),
        prompt: prompt,
        type: 'text_to_video',
        style: style,
        aspectRatio: aspectRatio,
        durationSeconds: duration,
        cameraMotion: cameraMotion,
        sourceImage: sceneVisualUrl || undefined,
        thumbnailUrl: sceneVisualUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        videoUrl: '',
        audioUrl: audioResult?.audioUrl,
        subtitles: scriptData.script ? [scriptData.script] : undefined,
        createdAt: Date.now(),
        language: voiceoverLanguage,
        voiceId: selectedVoice,
        isFavorite: false,
      };

      setGenerationStep(5);
      setGenerationProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        onVideoGenerated(newVideo);
      }, 800);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Video generation failed. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div id="text-to-video-screen" className="p-4 flex flex-col gap-5">
      {/* Prompt Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Video Description Prompt</span>
          </label>
          <button
            id="text-to-video-enhance-btn"
            onClick={handleEnhancePrompt}
            disabled={isEnhancing || !prompt.trim()}
            className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-opacity"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Enhancing...' : t.enhanceWithAI}</span>
          </button>
        </div>

        <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-indigo-500 transition-colors shadow-inner overflow-hidden">
          <textarea
            id="text-to-video-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.promptPlaceholder}
            rows={4}
            className="w-full p-3.5 bg-transparent text-zinc-100 text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="px-3 py-1.5 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Supports Urdu (اردو), Hindi (हिन्दी), & English</span>
            <span>{prompt.length} chars</span>
          </div>
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
          {t.aspectRatio}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECT_RATIOS.map((item) => {
            const isSelected = aspectRatio === item.id;
            return (
              <button
                key={item.id}
                id={`ratio-btn-${item.id}`}
                onClick={() => setAspectRatio(item.id)}
                className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/40 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-bold">{item.name}</span>
                <span className="text-[10px] text-zinc-400 mt-0.5 truncate">{item.bestFor}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Style Selection Grid */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
          {t.selectStyle}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VIDEO_STYLES.map((st) => {
            const isSelected = style === st.id;
            const title = language === 'ur' ? st.nameUr : language === 'hi' ? st.nameHi : st.name;
            return (
              <button
                key={st.id}
                id={`style-btn-${st.id}`}
                onClick={() => setStyle(st.id)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-900/60 to-zinc-900 border-indigo-500 ring-1 ring-indigo-500/40 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${st.previewBg} flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-zinc-200'}`}>
                    {title}
                  </h4>
                  <p className="text-[9px] text-zinc-400 line-clamp-1 mt-0.5">{st.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Motion & Duration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Camera Motion */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
            {t.cameraMotion}
          </label>
          <select
            id="camera-motion-select"
            value={cameraMotion}
            onChange={(e) => setCameraMotion(e.target.value as CameraMotion)}
            className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
          >
            {CAMERA_MOTIONS.map((cm) => (
              <option key={cm.id} value={cm.id} className="bg-zinc-900 text-zinc-100">
                {language === 'ur' ? cm.nameUr : language === 'hi' ? cm.nameHi : cm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Video Duration */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
            Duration: <span className="text-indigo-400">{duration} Seconds</span>
          </label>
          <div className="flex items-center gap-2 h-11 bg-zinc-900 rounded-2xl border border-zinc-800 px-3">
            {[4, 5, 8, 10].map((dur) => (
              <button
                key={dur}
                onClick={() => setDuration(dur)}
                className={`flex-1 py-1 rounded-xl text-xs font-bold transition-colors ${
                  duration === dur ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Multilingual Voiceover Attachment Section */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-200">{t.addVoiceover}</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="toggle-voiceover-checkbox"
              checked={includeVoiceover}
              onChange={(e) => setIncludeVoiceover(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {includeVoiceover && (
          <div className="flex flex-col gap-2.5 pt-2 border-t border-zinc-800/80">
            {/* Voice Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400">Language:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { code: 'en' as const, label: 'English' },
                  { code: 'ur' as const, label: 'Urdu (اردو)' },
                  { code: 'hi' as const, label: 'Hindi (हिन्दी)' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setVoiceoverLanguage(lang.code);
                      const matchingVoice = VOICE_OPTIONS.find(v => v.language === lang.code);
                      if (matchingVoice) setSelectedVoice(matchingVoice.id);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                      voiceoverLanguage === lang.code
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Choice */}
            <select
              id="voiceover-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-medium focus:outline-none"
            >
              {VOICE_OPTIONS.filter((v) => v.language === voiceoverLanguage).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.gender === 'female' ? 'Female' : 'Male'}) — {v.accent}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Generate Button */}
      <div className="pt-2">
        <button
          id="text-to-video-generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>{t.generateVideo}</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
            {subscription.isPremium ? 'PRO' : '1 Credit'}
          </span>
        </button>
      </div>

      {/* Generation Progress Dialog */}
      {isGenerating && (
        <div
          id="generation-progress-overlay"
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
              <div
                className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"
              />
              <Film className="w-8 h-8 text-indigo-400" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {t.generatingVideoTitle}
            </h3>

            <p className="text-xs text-zinc-400 min-h-[36px] max-w-xs">
              {generationStep === 1 && t.generatingStep1}
              {generationStep === 2 && t.generatingStep2}
              {generationStep === 3 && t.generatingStep3}
              {generationStep === 4 && t.generatingStep4}
              {generationStep === 5 && t.generatingStep5}
            </p>

            <div className="w-full bg-zinc-800 rounded-full h-2 my-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>

            <span className="text-[10px] font-mono text-zinc-500">
              {generationProgress}% • Multi-Core Neural Render
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
