/// <reference types="vite/client" />

declare module 'virtual:portfolio-content' {
  import type { PortfolioData } from './types/portfolio';
  export const portfolioData: PortfolioData;
  export default portfolioData;
}
