import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { loadPortfolioContent } from './scripts/loadPortfolioContent';

const VIRTUAL_MODULE_ID = 'virtual:portfolio-content';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_MODULE_ID;

function portfolioContentPlugin(): Plugin {
  const rootDir = process.cwd();
  const contentFile = path.join(rootDir, 'content', 'portfolio.yml');

  return {
    name: 'portfolio-content-plugin',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_ID;
      return null;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_ID) {
        const data = loadPortfolioContent(rootDir);
        return `export const portfolioData = ${JSON.stringify(data)};\nexport default portfolioData;`;
      }
      return null;
    },
    configureServer(server) {
      server.watcher.add(contentFile);
      server.watcher.on('change', (changedPath) => {
        if (path.resolve(changedPath) === path.resolve(contentFile)) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
          }
        }
      });
    },
    closeBundle() {
      const distDir = path.join(rootDir, 'dist');
      if (!fs.existsSync(distDir)) return;
      fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), portfolioContentPlugin()],
  optimizeDeps: {
    exclude: ['@rerun-io/web-viewer'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
});
