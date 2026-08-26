import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, Play, Volume2, ShieldCheck } from 'lucide-react';

interface AdMobRewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (credits: number) => void;
}

export const AdMobRewardedAdModal: React.FC<AdMobRewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(5);
      setIsCompleted(false);
      setRewardClaimed(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimReward = () => {
    if (!rewardClaimed) {
      setRewardClaimed(true);
      onRewardClaimed(2);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div
      id="admob-rewarded-modal-backdrop"
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
    >
      <div
        id="admob-rewarded-card"
        className="w-full max-w-sm bg-zinc-900 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
              AdMob Rewarded Ad
            </span>
            <span className="text-xs text-zinc-400">
              {isCompleted ? 'Reward Ready!' : `Reward in ${secondsRemaining}s`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <button
                id="admob-rewarded-close-btn"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-800/80 text-zinc-400 flex items-center justify-center text-xs font-bold font-mono">
                {secondsRemaining}
              </div>
            )}
          </div>
        </div>

        {/* Video Simulation Canvas / Graphic */}
        <div className="relative h-64 bg-gradient-to-br from-indigo-950 via-purple-900 to-zinc-950 flex flex-col items-center justify-center text-center p-6 overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute w-40 h-40 rounded-full bg-pink-500/20 blur-3xl -top-10 -left-10 animate-pulse" />
          <div className="absolute w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl -bottom-10 -right-10 animate-pulse" />

          {/* Ad Sponsor Mockup Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-xl mb-3 relative z-10 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-white relative z-10">
            Zaro AI Video Studio Pro
          </h3>
          <p className="text-xs text-zinc-300 max-w-xs mt-1 relative z-10">
            Render 4K Ultra HD AI Videos, clone realistic Urdu & Hindi AI voices, with zero watermarks.
          </p>

          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] text-zinc-300 relative z-10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Play Certified App</span>
          </div>

          {/* Bottom Video Progress Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - secondsRemaining) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Footer Action Card */}
        <div className="p-4 bg-zinc-950 flex flex-col gap-2.5">
          {rewardClaimed ? (
            <div className="py-3 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>+2 Free Credits Claimed!</span>
            </div>
          ) : isCompleted ? (
            <button
              id="claim-reward-button"
              onClick={handleClaimReward}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Claim +2 Free Credits</span>
            </button>
          ) : (
            <div className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-center text-xs flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Please watch {secondsRemaining} seconds to earn credits...</span>
            </div>
          )}

          <p className="text-[10px] text-zinc-500 text-center">
            Ad provided by Google AdMob Network. Free tier users can watch ads anytime to recharge credits.
          </p>
        </div>
      </div>
    </div>
  );
};
