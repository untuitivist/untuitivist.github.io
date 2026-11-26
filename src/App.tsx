import React, { useEffect, useState } from 'react';
import { portfolioData } from 'virtual:portfolio-content';
import type { Locale } from './types/portfolio';
import { TopBar } from './components/TopBar';
import { OrbitalObservatory } from './three/OrbitalObservatory';
import { SpatialWorkStage } from './components/SpatialWorkStage';
import { PublicationsSection } from './components/PublicationsSection';
import { WorldviewFooter } from './components/WorldviewFooter';

const LOCALE_STORAGE_KEY = 'wiz_portfolio_locale';

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') return saved;
  } catch {
    // Ignore storage access errors in sandboxed iframes
  }
  return 'en';
}

export function App() {
  const [locale, setLocale] = useState<Locale>(resolveInitialLocale);
  const [activeWorkId, setActiveWorkId] = useState<string>(
    portfolioData.works[0]?.id ?? 'robomocap',
  );

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage write errors
    }
  }, [locale]);

  const handleEnterStage = (workId: string) => {
    setActiveWorkId(workId);
    const el = document.getElementById('stages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-[#EEF2F6]">
      <TopBar profile={portfolioData.profile} locale={locale} onToggleLocale={setLocale} />

      <main>
        <OrbitalObservatory
          profile={portfolioData.profile}
          domains={portfolioData.domains}
          works={portfolioData.works}
          activeWorkId={activeWorkId}
          locale={locale}
          onSelectWork={setActiveWorkId}
          onEnterStage={handleEnterStage}
        />

        <SpatialWorkStage
          domains={portfolioData.domains}
          works={portfolioData.works}
          activeWorkId={activeWorkId}
          locale={locale}
          onSelectWork={setActiveWorkId}
        />

        <PublicationsSection
          domains={portfolioData.domains}
          publications={portfolioData.publications}
          locale={locale}
        />
      </main>

      <WorldviewFooter
        profile={portfolioData.profile}
        domains={portfolioData.domains}
        locale={locale}
      />
    </div>
  );
}

export default App;
