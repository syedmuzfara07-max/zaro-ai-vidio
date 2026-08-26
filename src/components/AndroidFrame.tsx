import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Sparkles, Crown, Plus, ArrowLeft } from 'lucide-react';
import { ActiveTab, LanguageCode, UserSubscription } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subscription: UserSubscription;
  language: LanguageCode;
  onOpenPremium: () => void;
  onOpenRewardedAd: () => void;
  isDeviceMockup: boolean;
  setIsDeviceMockup: (val: boolean) => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  setActiveTab,
  subscription,
  language,
  onOpenPremium,
  onOpenRewardedAd,
  isDeviceMockup,
  setIsDeviceMockup,
}) => {
  const [time, setTime] = useState('10:45');
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isRtl = language === 'ur';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return t.appName;
      case 'text_to_video':
        return t.textToVideo;
      case 'image_to_video':
        return t.imageToVideo;
      case 'text_to_speech':
        return t.textToVoice;
      case 'history':
        return t.history;
      case 'profile':
        return t.profile;
      case 'android_studio':
        return t.exportAndroid;
      default:
        return t.appName;
    }
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center ${isDeviceMockup ? 'p-2 sm:p-6' : 'p-0'} selection:bg-indigo-500 selection:text-white font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Floating Control Bar for Mockup Toggle & Branding */}
      <div className="w-full max-w-5xl mx-auto mb-3 px-4 py-2 flex items-center justify-between text-xs text-zinc-400 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-zinc-200 tracking-wide">Zaro AI Video</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium text-[10px] border border-indigo-500/30">
            Android 15 Material 3
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-mockup-mode-btn"
            onClick={() => setIsDeviceMockup(!isDeviceMockup)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all font-medium border border-zinc-700/60"
            title="Toggle Phone Frame vs Fullscreen view"
          >
            {isDeviceMockup ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isDeviceMockup ? 'Fullscreen View' : 'Android Phone Frame'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Phone chassis or Fullscreen container */}
      <div
        className={`w-full transition-all duration-300 relative bg-zinc-900 overflow-hidden flex flex-col ${
          isDeviceMockup
            ? 'max-w-[420px] h-[860px] max-h-[94vh] rounded-[48px] border-[10px] border-zinc-800 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-zinc-700/50'
            : 'max-w-4xl min-h-screen sm:min-h-[90vh] sm:rounded-3xl sm:border sm:border-zinc-800/80 shadow-2xl'
        }`}
      >
        {/* Android Status Bar */}
        <div className="h-9 px-6 pt-1.5 flex items-center justify-between text-xs text-zinc-300 font-medium select-none z-30 shrink-0 bg-zinc-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-zinc-200 tracking-tight">{time}</span>
          </div>

          {/* Android Camera Punch Hole (in mockup mode) */}
          {isDeviceMockup && (
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-2 ring-zinc-800/80 shadow-inner flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-950/60" />
            </div>
          )}

          <div className="flex items-center gap-2 text-zinc-400">
            <Wifi className="w-3.5 h-3.5 text-zinc-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[11px] font-semibold text-zinc-300">92%</span>
              <Battery className="w-4 h-4 text-zinc-300 fill-zinc-300" />
            </div>
          </div>
        </div>

        {/* Material 3 App Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            {activeTab !== 'home' && (
              <button
                id="header-back-btn"
                onClick={() => setActiveTab('home')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            )}
            <div>
              <h1 className="text-base font-bold text-zinc-100 flex items-center gap-1.5 leading-tight">
                {getHeaderTitle()}
                {activeTab === 'home' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </h1>
              {activeTab === 'home' && (
                <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                  {t.appTagline}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Free Credits Badge / Add credits button */}
            <button
              id="header-credits-pill-btn"
              onClick={onOpenRewardedAd}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 text-xs font-semibold shadow-sm transition-all"
              title="Watch Ad to get +2 Free Credits"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{subscription.isPremium ? 'PRO' : `${subscription.creditsRemaining} ⚡`}</span>
              {!subscription.isPremium && (
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5" />
                </div>
              )}
            </button>

            {/* Go Premium Button */}
            {!subscription.isPremium && (
              <button
                id="header-premium-btn"
                onClick={onOpenPremium}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.premium}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950/60 flex flex-col relative pb-20 custom-scrollbar">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill (in Mockup Mode) */}
        {isDeviceMockup && (
          <div className="absolute bottom-1 left-0 right-0 h-4 flex items-center justify-center pointer-events-none z-40">
            <div className="w-32 h-1 rounded-full bg-zinc-600/60" />
          </div>
        )}
      </div>
    </div>
  );
};
