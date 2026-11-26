import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { DomainInfo, Locale, ProfileData } from '../types/portfolio';
import { pickLocale } from '../utils/portfolio';

interface WorldviewFooterProps {
  profile: ProfileData;
  domains: DomainInfo[];
  locale: Locale;
}

export const WorldviewFooter: React.FC<WorldviewFooterProps> = ({ profile, domains, locale }) => {
  return (
    <footer className="bg-[#05070C] py-16">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        {/* Three Truth Domains Worldview Strip */}
        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {domains.map((domain) => (
            <div key={domain.id} className="bg-[#070B12] p-6">
              <p
                className="font-mono-tech text-xs uppercase tracking-[0.18em]"
                style={{ color: domain.color }}
              >
                {pickLocale(domain.title, locale)}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-white">
                {pickLocale(domain.subtitle, locale)}
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                {pickLocale(domain.thesis, locale)}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Identity & Verified Links */}
        <div className="mt-10 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-xl font-bold text-[#D4F0A0]">{profile.brand}</span>
              <span className="font-mono-tech text-xs text-slate-300">
                {pickLocale(profile.name, locale)} · @{profile.handle}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {pickLocale(profile.location, locale)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {profile.links.map((lnk) => (
              <a
                key={lnk.url}
                href={lnk.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono-tech text-xs text-slate-400 transition-colors hover:text-[#D4F0A0]"
              >
                <span>{pickLocale(lnk.label, locale)}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
