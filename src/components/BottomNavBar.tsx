import React from 'react';
import { Home, Clapperboard, Image as ImageIcon, Mic, History, User } from 'lucide-react';
import { ActiveTab, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: LanguageCode;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  language,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'text_to_video', label: t.textToVideo, icon: Clapperboard },
    { id: 'image_to_video', label: t.imageToVideo, icon: ImageIcon },
    { id: 'text_to_speech', label: t.textToVoice, icon: Mic },
    { id: 'history', label: t.history, icon: History },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <nav
      id="android-bottom-nav"
      aria-label="Bottom Navigation"
      className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800/80 flex items-center justify-around px-1 z-30 select-none shadow-[0_-8px_25px_rgba(0,0,0,0.5)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`nav-item-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all group active:scale-95`}
          >
            {/* Material 3 Active Pill Indicator */}
            <div
              className={`w-12 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/30 text-indigo-400 ring-1 ring-indigo-500/40 shadow-inner'
                  : 'text-zinc-400 group-hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`} />
            </div>
            
            <span
              className={`text-[10px] mt-0.5 font-medium transition-colors tracking-tight truncate max-w-[64px] ${
                isActive ? 'text-indigo-300 font-bold' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
