import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Play, Pause, Download, Sparkles, Wand2, ArrowRight, Check, VolumeX, Clapperboard, Globe } from 'lucide-react';
import { GeneratedAudio, LanguageCode, UserSubscription, VoiceOption } from '../types';
import { UI_TRANSLATIONS, VOICE_OPTIONS } from '../data/mockData';
import { TTSService } from '../services/ttsService';

interface TextToSpeechScreenProps {
  subscription: UserSubscription;
  language: LanguageCode;
  onAudioGenerated: (audio: GeneratedAudio) => void;
  onUseInVideo: (scriptText: string, voiceId: string, lang: LanguageCode) => void;
}

export const TextToSpeechScreen: React.FC<TextToSpeechScreenProps> = ({
  subscription,
  language,
  onAudioGenerated,
  onUseInVideo,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isRtl = language === 'ur';

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('en_zephyr');
  const [scriptText, setScriptText] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set default sample text when language changes
  useEffect(() => {
    const activeVoices = VOICE_OPTIONS.filter((v) => v.language === selectedLanguage);
    if (activeVoices.length > 0) {
      setSelectedVoiceId(activeVoices[0].id);
      setScriptText(activeVoices[0].previewText);
    }
  }, [selectedLanguage]);

  const selectedVoice = VOICE_OPTIONS.find((v) => v.id === selectedVoiceId) || VOICE_OPTIONS[0];

  const handlePreviewVoice = async () => {
    if (!scriptText.trim()) return;

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      TTSService.stopBrowserSpeech();
      setIsPlaying(false);
      return;
    }

    setIsSynthesizing(true);
    try {
      const result = await TTSService.synthesizeSpeech(
        scriptText,
        selectedVoice.geminiVoice || 'Zephyr',
        selectedLanguage,
        speed,
        pitch
      );

      if (result.audioUrl) {
        setCurrentAudioUrl(result.audioUrl);
        if (!audioRef.current) {
          audioRef.current = new Audio(result.audioUrl);
        } else {
          audioRef.current.src = result.audioUrl;
        }

        audioRef.current.playbackRate = speed;
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          // Fallback to Web Speech API
          TTSService.speakInBrowser(scriptText, selectedLanguage, speed, pitch, () => {
            setIsPlaying(false);
          });
        };

        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        TTSService.speakInBrowser(scriptText, selectedLanguage, speed, pitch, () => {
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('Speech synthesis error:', e);
      TTSService.speakInBrowser(scriptText, selectedLanguage, speed, pitch, () => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleDownloadAudio = () => {
    if (!currentAudioUrl) return;
    const a = document.createElement('a');
    a.href = currentAudioUrl;
    a.download = `zaro_voice_${selectedVoice.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="text-to-speech-screen" className="p-4 flex flex-col gap-5">
      {/* Language Selector Tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Select Voice Language</span>
        </label>

        <div className="grid grid-cols-3 gap-2">
          {[
            { code: 'en' as const, label: 'English', sub: 'Global' },
            { code: 'ur' as const, label: 'Urdu (اردو)', sub: 'پاکستانی لہجہ' },
            { code: 'hi' as const, label: 'Hindi (हिन्दी)', sub: 'भारतीय टोन' },
          ].map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`tts-lang-btn-${lang.code}`}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-bold">{lang.label}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">{lang.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Script Text Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voiceover Script</span>
          </label>
          <span className="text-[10px] text-zinc-500">{scriptText.length} characters</span>
        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-emerald-500 transition-colors p-3 shadow-inner">
          <textarea
            id="tts-script-input"
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            placeholder={t.enterScriptText}
            rows={4}
            dir={selectedLanguage === 'ur' ? 'rtl' : 'ltr'}
            className="w-full bg-transparent text-zinc-100 text-xs sm:text-sm placeholder:text-zinc-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Voice Selection Cards (Male / Female) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 px-1">
          {t.selectVoice}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VOICE_OPTIONS.filter((v) => v.language === selectedLanguage).map((voice) => {
            const isSelected = selectedVoiceId === voice.id;
            return (
              <button
                key={voice.id}
                id={`voice-option-${voice.id}`}
                onClick={() => setSelectedVoiceId(voice.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/60 to-zinc-900 border-emerald-500 ring-1 ring-emerald-500/40 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      voice.gender === 'female'
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {voice.gender === 'female' ? '♀' : '♂'}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-zinc-200'}`}>
                      {voice.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400">{voice.accent}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    voice.gender === 'female'
                      ? 'bg-pink-500/10 text-pink-300'
                      : 'bg-blue-500/10 text-blue-300'
                  }`}
                >
                  {voice.gender}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Tuning Sliders: Speed & Pitch */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        {/* Speed */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 font-semibold">{t.speed}</span>
            <span className="font-mono text-emerald-400 font-bold">{speed}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Pitch */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 font-semibold">{t.pitch}</span>
            <span className="font-mono text-emerald-400 font-bold">{pitch}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.3"
            step="0.05"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Audio Waveform Simulator Graphic when playing */}
      {isPlaying && (
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center gap-1.5 h-14 overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-emerald-400 rounded-full animate-pulse"
              style={{
                height: `${Math.max(8, Math.sin(i + Date.now()) * 32 + 16)}px`,
                animationDelay: `${(i % 5) * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          id="tts-preview-play-btn"
          onClick={handlePreviewVoice}
          disabled={isSynthesizing || !scriptText.trim()}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
        >
          {isSynthesizing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Neural Audio...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Stop Playback</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{t.listenPreview}</span>
            </>
          )}
        </button>

        {currentAudioUrl && (
          <button
            id="tts-download-audio-btn"
            onClick={handleDownloadAudio}
            className="py-3.5 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Save WAV</span>
          </button>
        )}

        <button
          id="tts-use-in-video-btn"
          onClick={() => onUseInVideo(scriptText, selectedVoiceId, selectedLanguage)}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md"
        >
          <Clapperboard className="w-4 h-4" />
          <span>Use in Video</span>
        </button>
      </div>
    </div>
  );
};
