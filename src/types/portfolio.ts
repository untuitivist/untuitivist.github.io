export type Locale = 'en' | 'zh';

export type DomainId = 'macro' | 'micro' | 'social';

export type StageType =
  | 'robomocap'
  | 'rerun'
  | 'retargeting'
  | 'arm3d'
  | 'spectral'
  | 'vision'
  | 'terminal';

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface ExternalLink {
  id?: string;
  label: LocalizedText;
  url: string;
  primary?: boolean;
}

export interface ProfileData {
  brand: string;
  brandExpansion: LocalizedText;
  name: LocalizedText;
  handle: string;
  tagline: LocalizedText;
  subtitle: LocalizedText;
  location: LocalizedText;
  links: ExternalLink[];
}

export interface DomainInfo {
  id: DomainId;
  color: string;
  orbitRadius: number;
  orbitTilt: [number, number, number];
  title: LocalizedText;
  subtitle: LocalizedText;
  thesis: LocalizedText;
}

export interface WorkHighlight {
  label: LocalizedText;
  value: string;
}

export interface WorkMedia {
  poster?: string;
  video?: string;
  image?: string;
  overview?: string;
  g1Video?: string;
  g1Poster?: string;
  bodyVideo?: string;
  bodyPoster?: string;
  robocapImg?: string;
  robowristImg?: string;
  ego1?: string;
  ego2?: string;
  defaultLocalRrd?: string;
  sampleRrdUrl?: string;
  secondarySampleRrdUrl?: string;
}

export interface WorkItem {
  id: string;
  code: string;
  domain: DomainId;
  stageType: StageType;
  year: string;
  orbitAngle: number;
  title: LocalizedText;
  tagline: LocalizedText;
  summary: LocalizedText;
  highlights: WorkHighlight[];
  media: WorkMedia;
  links: ExternalLink[];
}

export interface PublicationItem {
  id: string;
  year: string;
  domain: DomainId;
  venue: string;
  title: LocalizedText;
  authors: string;
  links: Array<{ label: string; url: string }>;
  bibtex: string;
}

export interface PortfolioData {
  profile: ProfileData;
  domains: DomainInfo[];
  works: WorkItem[];
  publications: PublicationItem[];
}
