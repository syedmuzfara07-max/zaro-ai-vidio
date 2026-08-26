/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, AspectRatio, GeneratedAudio, GeneratedVideo, LanguageCode, UserSubscription, VideoStyle } from './types';
import { INITIAL_GENERATED_VIDEOS } from './data/mockData';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNavBar } from './components/BottomNavBar';
import { AdMobBannerView } from './components/AdMobBannerView';
import { AdMobRewardedAdModal } from './components/AdMobRewardedAdModal';
import { PremiumModal } from './components/PremiumModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { HomeScreen } from './components/HomeScreen';
import { TextToVideoScreen } from './components/TextToVideoScreen';
import { ImageToVideoScreen } from './components/ImageToVideoScreen';
import { TextToSpeechScreen } from './components/TextToSpeechScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ProfileSettingsScreen } from './components/ProfileSettingsScreen';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_VIDEOS = 'zaro_ai_videos_v1';
const STORAGE_KEY_SUBSCRIPTION = 'zaro_ai_subscription_v1';
const STORAGE_KEY_LANG = 'zaro_ai_lang_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as LanguageCode) || 'en';
  });

  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUBSCRIPTION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      isPremium: false,
      tier: 'free',
      creditsRemaining: 5,
      totalGenerations: 3,
    };
  });

  const [videos, setVideos] = useState<GeneratedVideo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VIDEOS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_GENERATED_VIDEOS;
  });

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isRewardedAdModalOpen, setIsRewardedAdModalOpen] = useState(false);
  const [selectedVideoForPlayback, setSelectedVideoForPlayback] = useState<GeneratedVideo | null>(null);
  const [isDeviceMockup, setIsDeviceMockup] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Prefilled prompt for remixing or home trending suggestions
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');
  const [prefilledStyle, setPrefilledStyle] = useState<VideoStyle>('cinematic');
  const [prefilledRatio, setPrefilledRatio] = useState<AspectRatio>('9:16');

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, language);
  }, [language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleConsumeCredit = (): boolean => {
    if (subscription.isPremium) {
      setSubscription((prev) => ({
        ...prev,
        totalGenerations: prev.totalGenerations + 1,
      }));
      return true;
    }

    if (subscription.creditsRemaining <= 0) {
      return false;
    }

    setSubscription((prev) => ({
      ...prev,
      creditsRemaining: prev.creditsRemaining - 1,
      totalGenerations: prev.totalGenerations + 1,
    }));
    return true;
  };

  const handleRewardClaimed = (earnedCredits: number) => {
    setSubscription((prev) => ({
      ...prev,
      creditsRemaining: prev.creditsRemaining + earnedCredits,
    }));
    showToast(`+${earnedCredits} Free Credits added to your account!`);
  };

  const handleUpgrade = (tier: 'monthly' | 'yearly' | 'lifetime') => {
    setSubscription((prev) => ({
      ...prev,
      isPremium: true,
      tier,
      creditsRemaining: 99999,
    }));
    showToast('🎉 Upgraded to Zaro AI Video Pro!');
  };

  const handleVideoGenerated = (newVideo: GeneratedVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
    setSelectedVideoForPlayback(newVideo);
    showToast('✨ AI Video Rendered Successfully!');
  };

  const handleAudioGenerated = (newAudio: GeneratedAudio) => {
    showToast('🎙️ AI Speech generated!');
  };

  const handleUseInVideo = (scriptText: string, voiceId: string, lang: LanguageCode) => {
    setPrefilledPrompt(scriptText);
    setActiveTab('text_to_video');
    showToast('Script transferred to Video Studio!');
  };

  const handleSelectPromptFromHome = (promptText: string, styleId?: string, ratio?: string) => {
    setPrefilledPrompt(promptText);
    if (styleId) setPrefilledStyle(styleId as VideoStyle);
    if (ratio) setPrefilledRatio(ratio as AspectRatio);
    setActiveTab('text_to_video');
  };

  const handleRemix = (video: GeneratedVideo) => {
    setPrefilledPrompt(video.prompt);
    setPrefilledStyle(video.style);
    setPrefilledRatio(video.aspectRatio);
    setActiveTab('text_to_video');
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    showToast('Item deleted.');
  };

  const handleToggleFavorite = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  const handleResetData = () => {
    setVideos(INITIAL_GENERATED_VIDEOS);
    setSubscription({
      isPremium: false,
      tier: 'free',
      creditsRemaining: 5,
      totalGenerations: 3,
    });
    showToast('Reset to default sample data.');
  };

  return (
    <>
      <AndroidFrame
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        language={language}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        onOpenRewardedAd={() => setIsRewardedAdModalOpen(true)}
        isDeviceMockup={isDeviceMockup}
        setIsDeviceMockup={setIsDeviceMockup}
      >
        {/* Tab View Routing */}
        {activeTab === 'home' && (
          <HomeScreen
            setActiveTab={setActiveTab}
            subscription={subscription}
            language={language}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onOpenRewardedAd={() => setIsRewardedAdModalOpen(true)}
            onSelectPrompt={handleSelectPromptFromHome}
            recentVideos={videos}
            onPlayVideo={(v) => setSelectedVideoForPlayback(v)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'text_to_video' && (
          <TextToVideoScreen
            subscription={subscription}
            language={language}
            initialPrompt={prefilledPrompt}
            initialStyle={prefilledStyle}
            initialRatio={prefilledRatio}
            onVideoGenerated={handleVideoGenerated}
            onConsumeCredit={handleConsumeCredit}
            onOpenRewardedAd={() => setIsRewardedAdModalOpen(true)}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {activeTab === 'image_to_video' && (
          <ImageToVideoScreen
            subscription={subscription}
            language={language}
            onVideoGenerated={handleVideoGenerated}
            onConsumeCredit={handleConsumeCredit}
            onOpenRewardedAd={() => setIsRewardedAdModalOpen(true)}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {activeTab === 'text_to_speech' && (
          <TextToSpeechScreen
            subscription={subscription}
            language={language}
            onAudioGenerated={handleAudioGenerated}
            onUseInVideo={handleUseInVideo}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            videos={videos}
            onPlayVideo={(v) => setSelectedVideoForPlayback(v)}
            onDeleteVideo={handleDeleteVideo}
            onToggleFavorite={handleToggleFavorite}
            onNavigateCreate={() => setActiveTab('text_to_video')}
            language={language}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsScreen
            subscription={subscription}
            language={language}
            onLanguageChange={setLanguage}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onOpenRewardedAd={() => setIsRewardedAdModalOpen(true)}
            onResetData={handleResetData}
          />
        )}

        {/* AdMob Banner for Free Tier */}
        <AdMobBannerView
          isPremium={subscription.isPremium}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          onOpenRewardedAd={() => setIsRewardedAdModalOpen(true)}
        />

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
        />
      </AndroidFrame>

      {/* Fullscreen Video Player & Exporter Modal */}
      <VideoPlayerModal
        video={selectedVideoForPlayback}
        isOpen={!!selectedVideoForPlayback}
        onClose={() => setSelectedVideoForPlayback(null)}
        onRemix={handleRemix}
        onToggleFavorite={handleToggleFavorite}
        isPremium={subscription.isPremium}
        language={language}
      />

      {/* Rewarded Video Ad Modal */}
      <AdMobRewardedAdModal
        isOpen={isRewardedAdModalOpen}
        onClose={() => setIsRewardedAdModalOpen(false)}
        onRewardClaimed={handleRewardClaimed}
      />

      {/* Premium Subscription Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        subscription={subscription}
        onUpgrade={handleUpgrade}
      />

      {/* Material 3 Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700 text-zinc-100 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
