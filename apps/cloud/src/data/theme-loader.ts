import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface ThemeCharacter {
  id: string;
  name: string;
  rank: string;
  role: string;
  skillResonance: string | null;
  attributes: Record<string, number>;
  catchphrase: string | null;
  bio: string | null;
  communityRating: number | null;
}

export interface ThemePalette {
  primary: string;
  accent: string;
  surface: string;
  text: string;
  highlight: string;
  glow: string;
}

export interface ThemePack {
  meta: {
    id: string;
    version: string;
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    franchise: string;
    series: string;
    status: string;
  };
  palette: ThemePalette;
  characters: ThemeCharacter[];
}

/**
 * Minimal YAML parser for flat theme pack structure.
 * Handles: scalars, simple objects, arrays of objects with nested attributes.
 * Not a general YAML parser — scoped to the theme pack schema.
 */
function parseThemeYaml(raw: string): ThemePack {
  const lines = raw.split('\n');

  const meta: Record<string, string> = {};
  const palette: Record<string, string> = {};
  const characters: ThemeCharacter[] = [];

  let section = '';
  let currentChar: Partial<ThemeCharacter> | null = null;
  let currentAttrs: Record<string, number> = {};
  let inAttributes = false;

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') continue;

    // Top-level sections
    if (/^meta:/.test(line)) { section = 'meta'; continue; }
    if (/^palette:/.test(line)) { section = 'palette'; continue; }
    if (/^characters:/.test(line)) { section = 'characters'; continue; }
    if (/^schema:/.test(line)) { section = 'schema'; continue; }

    if (section === 'schema') continue; // Skip schema section

    if (section === 'meta') {
      const m = line.match(/^\s{2}(\w+):\s*"?([^"]*)"?\s*$/);
      if (m) meta[m[1]] = m[2];
      continue;
    }

    if (section === 'palette') {
      const m = line.match(/^\s{2}(\w+):\s*"?([^"]*)"?\s*$/);
      if (m) palette[m[1]] = m[2];
      continue;
    }

    if (section === 'characters') {
      // New character entry
      if (/^\s{2}- id:/.test(line)) {
        // Save previous character
        if (currentChar) {
          currentChar.attributes = currentAttrs;
          characters.push(currentChar as ThemeCharacter);
        }
        const idMatch = line.match(/id:\s*(\w+)/);
        currentChar = {
          id: idMatch?.[1] ?? '',
          name: '',
          rank: '',
          role: '',
          skillResonance: null,
          attributes: {},
          catchphrase: null,
          bio: null,
          communityRating: null,
        };
        currentAttrs = {};
        inAttributes = false;
        continue;
      }

      if (!currentChar) continue;

      // Attributes block
      if (/^\s{4}attributes:/.test(line)) {
        inAttributes = true;
        continue;
      }

      if (inAttributes) {
        const attrMatch = line.match(/^\s{6}(\w+):\s*(\d+)/);
        if (attrMatch) {
          currentAttrs[attrMatch[1]] = parseInt(attrMatch[2], 10);
          continue;
        } else {
          inAttributes = false;
        }
      }

      // Character scalar fields
      const fieldMatch = line.match(/^\s{4}(\w+):\s*(.*)/);
      if (fieldMatch) {
        const [, key, rawVal] = fieldMatch;
        const val = rawVal.replace(/^"(.*)"$/, '$1').trim();

        if (key === 'name') currentChar.name = val;
        else if (key === 'rank') currentChar.rank = val;
        else if (key === 'role') currentChar.role = val;
        else if (key === 'skillResonance') currentChar.skillResonance = val === 'null' ? null : val;
        else if (key === 'catchphrase') currentChar.catchphrase = val === 'null' ? null : val;
        else if (key === 'bio') currentChar.bio = val === 'null' ? null : val;
        else if (key === 'communityRating') currentChar.communityRating = val === 'null' ? null : parseFloat(val);
      }
    }
  }

  // Push last character
  if (currentChar) {
    currentChar.attributes = currentAttrs;
    characters.push(currentChar as ThemeCharacter);
  }

  return {
    meta: {
      id: meta.id ?? '',
      version: meta.version ?? '',
      name: meta.name ?? '',
      shortName: meta.shortName ?? '',
      tagline: meta.tagline ?? '',
      description: meta.description ?? '',
      franchise: meta.franchise ?? '',
      series: meta.series ?? '',
      status: meta.status ?? '',
    },
    palette: {
      primary: palette.primary ?? '#000',
      accent: palette.accent ?? '#fff',
      surface: palette.surface ?? '#111',
      text: palette.text ?? '#eee',
      highlight: palette.highlight ?? '#f00',
      glow: palette.glow ?? '#0ff',
    },
    characters,
  };
}

const DATA_DIR = join(import.meta.dir, '../../data/theme-packs');

let cache: Map<string, ThemePack> | null = null;

export function loadAllThemePacks(): Map<string, ThemePack> {
  if (cache) return cache;

  cache = new Map();
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.yml'));

  for (const file of files) {
    const raw = readFileSync(join(DATA_DIR, file), 'utf-8');
    const pack = parseThemeYaml(raw);
    cache.set(pack.meta.id, pack);
  }

  return cache;
}

export function loadThemePack(id: string): ThemePack | undefined {
  return loadAllThemePacks().get(id);
}
