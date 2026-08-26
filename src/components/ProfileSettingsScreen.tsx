import React, { useState } from 'react';
import { User, Crown, Globe, Shield, Code, Sparkles, Zap, Copy, Check, Info, FileCode, Trash2, Smartphone } from 'lucide-react';
import { LanguageCode, UserSubscription } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';
import { ExportAndroidService, AndroidFile } from '../services/exportAndroidService';

interface ProfileSettingsScreenProps {
  subscription: UserSubscription;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenPremium: () => void;
  onOpenRewardedAd: () => void;
  onResetData: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  subscription,
  language,
  onLanguageChange,
  onOpenPremium,
  onOpenRewardedAd,
  onResetData,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isRtl = language === 'ur';

  const [androidFiles] = useState<AndroidFile[]>(ExportAndroidService.getAndroidProjectFiles());
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);

  const handleCopyCode = () => {
    const file = androidFiles[selectedFileIndex];
    if (file) {
      navigator.clipboard.writeText(file.content);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  return (
    <div id="profile-settings-screen" className="p-4 flex flex-col gap-5">
      {/* User Profile Card */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            U
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Creator Account</h3>
              {subscription.isPremium ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  PRO VIP
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                  Free Tier
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">syedmuzfara07@gmail.com</p>
          </div>
        </div>

        {!subscription.isPremium ? (
          <button
            id="profile-upgrade-btn"
            onClick={onOpenPremium}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1 active:scale-95 transition-all"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Upgrade</span>
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Crown className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Credits & Usage Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">Remaining Credits</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-indigo-400">
              {subscription.isPremium ? '∞' : subscription.creditsRemaining}
            </span>
            {!subscription.isPremium && (
              <button
                onClick={onOpenRewardedAd}
                className="text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-0.5"
              >
                <Zap className="w-2.5 h-2.5" /> +2 More
              </button>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">Total Generated</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-black text-pink-400">
              {subscription.totalGenerations}
            </span>
            <span className="text-[10px] text-zinc-500">videos & audio</span>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-zinc-200">App Language (زبان / भाषा)</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { code: 'en' as const, label: 'English', native: 'English' },
            { code: 'ur' as const, label: 'Urdu', native: 'اردو' },
            { code: 'hi' as const, label: 'Hindi', native: 'हिन्दी' },
          ].map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                id={`lang-selector-${item.code}`}
                onClick={() => onLanguageChange(item.code)}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/40 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs">{item.label}</span>
                <span className="text-[10px] text-zinc-500">{item.native}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Android Studio Export Section */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-zinc-200">{t.exportAndroid}</span>
              <p className="text-[10px] text-zinc-400">Kotlin & Jetpack Compose Native Code</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="download-android-zip-btn"
              onClick={async () => {
                await ExportAndroidService.exportProjectZip();
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <FileCode className="w-3 h-3" />
              <span>Download ZIP</span>
            </button>

            <button
              id="copy-android-code-btn"
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold flex items-center gap-1 border border-zinc-700 transition-colors"
            >
              {copiedFile ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFile ? t.copied : t.copyCode}</span>
            </button>
          </div>
        </div>

        {/* File selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {androidFiles.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFileIndex(idx)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all ${
                selectedFileIndex === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>

        {/* Code viewer box */}
        <div className="relative rounded-xl bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto max-h-56 custom-scrollbar font-mono text-[11px] text-zinc-300 leading-relaxed">
          <pre className="text-emerald-400/90">{androidFiles[selectedFileIndex]?.content}</pre>
        </div>

        {/* Terminal Build Commands Quick Card */}
        <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col gap-1.5 text-[11px]">
          <span className="text-zinc-400 font-bold">Terminal APK Build Command:</span>
          <div className="flex items-center justify-between bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-indigo-300">
            <code>./gradlew assembleRelease</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText('./gradlew assembleRelease');
              }}
              className="text-zinc-400 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">Output APK: <span className="font-mono text-zinc-400">app/build/outputs/apk/release/app-release.apk</span></p>
        </div>
      </div>

      {/* AdMob & Monetization Info */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-200 font-bold">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Google AdMob Integration Status</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Google Mobile Ads SDK is active in Test Mode. Free users can watch rewarded ads to earn credits for video generation. Upgrading to Pro permanently disables all ads.
        </p>
      </div>

      {/* Reset Cache / Demo Data */}
      <div className="pt-1">
        <button
          onClick={onResetData}
          className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Sample History & Credits</span>
        </button>
      </div>
    </div>
  );
};
