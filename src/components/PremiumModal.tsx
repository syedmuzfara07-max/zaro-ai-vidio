import React, { useState } from 'react';
import { Crown, Check, Sparkles, X, Shield, Zap, Lock, AlertCircle } from 'lucide-react';
import { UserSubscription } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgrade: (tier: 'monthly' | 'yearly' | 'lifetime') => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgrade,
}) => {
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Monthly Pro',
      price: '$9.99',
      billing: '/month',
      badge: 'Most Popular',
      popular: true,
      description: 'Ideal for creators making weekly shorts & reels'
    },
    {
      id: 'yearly' as const,
      name: 'Annual VIP',
      price: '$59.99',
      billing: '/year ($4.99/mo)',
      badge: 'Save 50%',
      popular: false,
      description: 'Best value for professional content studios'
    },
    {
      id: 'lifetime' as const,
      name: 'Lifetime Access',
      price: '$99.00',
      billing: 'one-time',
      badge: 'Forever',
      popular: false,
      description: 'Pay once, enjoy lifetime unlimited AI video generation'
    }
  ];

  const features = [
    { title: 'Unlimited AI Video Generations', desc: 'No daily limits or credit constraints' },
    { title: 'Ultra HD 4K Quality', desc: 'Crisp 60fps high-resolution rendering' },
    { title: 'Zero Watermarks', desc: 'Clean, professional videos ready for clients & monetization' },
    { title: '100% Ad-Free Experience', desc: 'No Google AdMob banners or rewarded popups' },
    { title: 'All Multilingual Voices', desc: 'Full access to all Urdu, Hindi, & English voiceovers' },
    { title: 'Fast-Track Cloud Rendering', desc: 'Skip the standard queue with dedicated compute' }
  ];

  const handleStartPurchase = () => {
    // Open explicit confirmation step to comply with user billing rules
    setShowConfirmDialog(true);
  };

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmDialog(false);
      onUpgrade(selectedTier);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="premium-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 select-none"
    >
      <div
        id="premium-modal-card"
        className="w-full max-w-md bg-zinc-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative my-auto"
      >
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Close Button & Header Banner */}
        <div className="p-5 pb-3 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Zaro AI Pro</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                  VIP
                </span>
              </div>
              <p className="text-xs text-zinc-400">Unlock your full AI filmmaking superpower</p>
            </div>
          </div>

          <button
            id="premium-close-button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subscription Plans Selector */}
        <div className="px-5 py-2 flex flex-col gap-2 relative z-10">
          <div className="grid grid-cols-3 gap-2">
            {plans.map((plan) => {
              const isSelected = selectedTier === plan.id;
              return (
                <button
                  key={plan.id}
                  id={`plan-card-${plan.id}`}
                  onClick={() => setSelectedTier(plan.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all relative ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/20 to-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {plan.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mb-1 ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <span className="text-xs font-bold text-zinc-200">{plan.name}</span>
                  <span className="text-base font-black text-amber-400 mt-1">{plan.price}</span>
                  <span className="text-[9px] text-zinc-400">{plan.billing}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="px-5 py-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col gap-2.5">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-100">{feat.title}</p>
                  <p className="text-[10px] text-zinc-400">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Upgrade CTA & Explicit Confirmation Trigger */}
        <div className="p-5 pt-2 bg-zinc-950 border-t border-zinc-800/80 flex flex-col gap-2 relative z-10">
          <button
            id="continue-to-subscription-btn"
            onClick={handleStartPurchase}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-zinc-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4 text-zinc-950 fill-zinc-950" />
            <span>
              Upgrade Now • {plans.find((p) => p.id === selectedTier)?.price}
            </span>
          </button>

          <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Google Play Protected
            </span>
            <span>•</span>
            <span>Cancel anytime</span>
            <span>•</span>
            <span>No hidden fees</span>
          </div>
        </div>

        {/* Explicit Confirmation Dialog Overlay (Ensuring users are never charged without explicit confirmation) */}
        {showConfirmDialog && (
          <div
            id="explicit-billing-confirmation-modal"
            className="absolute inset-0 bg-black/90 backdrop-blur-md p-5 flex flex-col justify-center items-center z-50 text-center animate-in fade-in"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">Confirm Your Subscription</h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-xs">
              You are selecting the{' '}
              <strong className="text-amber-400">
                {plans.find((p) => p.id === selectedTier)?.name}
              </strong>{' '}
              plan at{' '}
              <strong className="text-white">
                {plans.find((p) => p.id === selectedTier)?.price}
              </strong>
              .
            </p>

            <div className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-left my-4 text-xs flex flex-col gap-1 text-zinc-400">
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="text-zinc-200 font-medium">syedmuzfara07@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-zinc-200 font-medium">Google Play Store</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Renewal:</span>
                <span className="text-zinc-200 font-medium">Manageable in Play Store</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                id="cancel-explicit-billing-btn"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-explicit-billing-btn"
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm & Pay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
