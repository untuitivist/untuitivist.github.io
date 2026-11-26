import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';
import type { PortfolioData } from '../src/types/portfolio';

export function loadPortfolioContent(rootDir: string): PortfolioData {
  const filePath = path.join(rootDir, 'content', 'portfolio.yml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseYaml(raw) as PortfolioData;
  return parsed;
}
