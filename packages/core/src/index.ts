// @steaz/core — The Terminal Engine
// TypeScript types + version constant for server-side consumers.
// Browser engine lives in browser/ as vanilla JS ES modules.

export const STEAZ_VERSION = '0.1.0';

export interface SteazConfig {
  scrollSpeed: number;
  fontSize: number;
  opacity: number;
  glowIntensity: number;
  colorScheme: 'green' | 'cyan' | 'amber' | 'white';
  typewriterSpeed: number;
  scrollMode: 'native' | 'transform';
}

export interface SteazCommandConfig {
  listEndpoint: string | null;
  searchEndpoint: string | null;
  contentLabel: string;
}

export interface VoidConfig {
  starCount: { far: number; mid: number; near: number; bright: number };
  driftSpeed: number;
  twinkleSpeed: number;
  nebulaIntensity: number;
  parallaxDepth: number;
}

export interface HoloNavDomain {
  id: string;
  label: string;
  url: string;
  color: string;
}

export interface HoloNavConfig {
  current: string;
  domains: HoloNavDomain[];
}
