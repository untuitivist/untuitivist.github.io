import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import type { DomainInfo, Locale, PublicationItem } from '../types/portfolio';
import { getDomainById, pickLocale } from '../utils/portfolio';

interface PublicationsSectionProps {
  domains: DomainInfo[];
  publications: PublicationItem[];
  locale: Locale;
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({
  domains,
  publications,
  locale,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedBibId, setExpandedBibId] = useState<string | null>(null);

  const handleCopyBibtex = async (pub: PublicationItem) => {
    try {
      await navigator.clipboard.writeText(pub.bibtex.trim());
      setCopiedId(pub.id);
      window.setTimeout(() => setCopiedId((prev) => (prev === pub.id ? null : prev)), 2000);
    } catch {
      setExpandedBibId(pub.id);
    }
  };

  return (
    <section id="publications" className="border-b border-white/10 bg-[#06080D] py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono-tech text-xs uppercase tracking-[0.22em] text-[#D4F0A0]">
              {locale === 'zh' ? '学术发表与引用' : 'Selected Publications'}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
              {locale === 'zh' ? '论文、数据集与开放文献' : 'Papers, Benchmarks & Citations'}
            </h2>
          </div>
          <a
            href="https://scholar.google.com/citations?hl=zh-CN&user=2fr6v4EAAAAJ"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono-tech text-xs text-slate-300 transition-colors hover:text-[#D4F0A0]"
          >
            <span>{locale === 'zh' ? '查看 Google 学术主页' : 'Full Google Scholar Profile'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="divide-y divide-white/10">
          {publications.map((pub) => {
            const domain = getDomainById(domains, pub.domain);
            const isCopied = copiedId === pub.id;
            const isOpen = expandedBibId === pub.id;

            return (
              <div key={pub.id} className="py-7">
                <div className="grid gap-4 lg:grid-cols-12">
                  <div className="flex items-start gap-3 font-mono-tech text-xs lg:col-span-2">
                    <span className="text-slate-300">{pub.year}</span>
                    <span className="text-white/20">/</span>
                    <span style={{ color: domain.color }}>{pickLocale(domain.title, locale)}</span>
                  </div>

                  <div className="lg:col-span-10">
                    <h3 className="font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
                      {pickLocale(pub.title, locale)}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 sm:text-sm">{pub.authors}</p>
                    <p className="mt-1 font-mono-tech text-xs text-[#D4F0A0]/90">{pub.venue}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      {pub.links.map((lnk) => (
                        <a
                          key={lnk.url}
                          href={lnk.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 border border-white/15 bg-[#0C1018] px-3 py-1.5 font-mono-tech text-xs text-slate-200 transition-colors hover:border-[#D4F0A0]/60 hover:text-[#D4F0A0]"
                        >
                          <span>{lnk.label}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      ))}

                      <button
                        type="button"
                        onClick={() => setExpandedBibId(isOpen ? null : pub.id)}
                        className="border border-white/12 px-3 py-1.5 font-mono-tech text-xs text-slate-400 transition-colors hover:border-white/30 hover:text-white"
                      >
                        {isOpen ? 'Hide BibTeX' : 'BibTeX'}
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleCopyBibtex(pub)}
                        className="inline-flex items-center gap-1.5 border border-white/12 px-3 py-1.5 font-mono-tech text-xs text-slate-400 transition-colors hover:border-[#D4F0A0]/60 hover:text-[#D4F0A0]"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#D4F0A0]" />
                            <span className="text-[#D4F0A0]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>{locale === 'zh' ? '复制引用' : 'Copy Citation'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {isOpen && (
                      <pre className="mt-4 overflow-x-auto border border-white/10 bg-[#0A0E16] p-4 font-mono-tech text-xs leading-relaxed text-slate-300">
                        {pub.bibtex.trim()}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
