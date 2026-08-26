import React, { useState } from 'react';
import { Crown, Sparkles, ExternalLink, X } from 'lucide-react';
import { DEFAULT_ADMOB_CONFIG } from '../services/adMobService';

interface AdMobBannerViewProps {
  isPremium: boolean;
  onOpenPremium: () => void;
  onOpenRewardedAd: () => void;
}

export const AdMobBannerView: React.FC<AdMobBannerViewProps> = ({
  isPremium,
  onOpenPremium,
  onOpenRewardedAd,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isPremium || isDismissed) {
    return null;
  }

  return (
    <div
      id="admob-banner-container"
      className="w-full px-3 py-1.5 shrink-0 bg-zinc-950/90 border-t border-zinc-800/60 z-20"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-700/50 p-2 flex items-center justify-between gap-2 shadow-md">
        {/* Google AdMob Tag Badge */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold tracking-wider border border-amber-500/30 uppercase">
                AdMob Test
              </span>
              <span className="text-[11px] font-bold text-zinc-200 truncate">
                Zaro AI Pro — Unlock 4K & Unlimited
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate">
              Watch a 5s ad to get +2 free credits or remove all ads.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="admob-banner-rewarded-cta-btn"
            onClick={onOpenRewardedAd}
            className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
          >
            <span>+2 Credits</span>
          </button>

          <button
            id="admob-banner-premium-cta-btn"
            onClick={onOpenPremium}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 flex items-center justify-center border border-zinc-700 transition-colors"
            title="Remove Ads"
          >
            <Crown className="w-3.5 h-3.5" />
          </button>

          <button
            id="admob-banner-dismiss-btn"
            onClick={() => setIsDismissed(true)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5"
            title="Hide Banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
