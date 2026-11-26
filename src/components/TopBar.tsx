import React from 'react';
import type { Locale, ProfileData } from '../types/portfolio';
import { pickLocale } from '../utils/portfolio';

interface TopBarProps {
  profile: ProfileData;
  locale: Locale;
  onToggleLocale: (next: Locale) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ profile, locale, onToggleLocale }) => {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-white/10 bg-[#06080D]/95">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <a href="#observatory" className="group flex items-baseline gap-3">
          <span className="font-display text-xl font-bold tracking-tight text-[#D4F0A0]">
            {profile.brand}
          </span>
          <span className="hidden font-mono-tech text-xs text-slate-400 transition-colors group-hover:text-slate-200 sm:inline">
            {pickLocale(profile.name, locale)}
          </span>
        </a>

        <nav className="flex items-center gap-5 sm:gap-7">
          <a
            href="#observatory"
            className="hidden text-xs font-medium tracking-wide text-slate-300 transition-colors hover:text-[#D4F0A0] md:inline"
          >
            {locale === 'zh' ? '轨道观测站' : 'Observatory'}
          </a>
          <a
            href="#stages"
            className="text-xs font-medium tracking-wide text-slate-300 transition-colors hover:text-[#D4F0A0]"
          >
            {locale === 'zh' ? '交互舞台' : 'Stages'}
          </a>
          <a
            href="#publications"
            className="text-xs font-medium tracking-wide text-slate-300 transition-colors hover:text-[#D4F0A0]"
          >
            {locale === 'zh' ? '论文与引用' : 'Publications'}
          </a>

          <div
            className="inline-flex items-center border border-white/15 bg-[#0C1018] font-mono-tech text-[11px]"
            role="group"
            aria-label="Language switch"
          >
            <button
              type="button"
              onClick={() => onToggleLocale('en')}
              className={`px-2.5 py-1 transition-colors ${
                locale === 'en'
                  ? 'bg-[#D4F0A0] font-semibold text-[#06080D]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLocale('zh')}
              className={`px-2.5 py-1 transition-colors ${
                locale === 'zh'
                  ? 'bg-[#D4F0A0] font-semibold text-[#06080D]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              中
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
