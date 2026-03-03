import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SkillData } from '../types';

const SKILLS_DIR = '/Users/verdey/.claude/skills';
const SKIP_DIRS = new Set(['_example', 'portal']);
const OUTPUT = join(import.meta.dir, 'skills-manifest.json');

async function buildManifest() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skills: SkillData[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;

    const skillMdPath = join(SKILLS_DIR, entry.name, 'SKILL.md');
    let content: string;
    try {
      content = await readFile(skillMdPath, 'utf-8');
    } catch {
      continue; // no SKILL.md in this directory
    }

    // Split frontmatter from body
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!fmMatch) continue;

    const frontmatter = fmMatch[1];
    const rawBody = fmMatch[2];

    // Extract name from frontmatter
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const name = nameMatch ? nameMatch[1].trim() : entry.name;

    // Extract description (handles both quoted and unquoted)
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
    let description = '';
    if (descMatch) {
      description = descMatch[1].trim();
      // Strip surrounding quotes
      if ((description.startsWith('"') && description.endsWith('"')) ||
          (description.startsWith("'") && description.endsWith("'"))) {
        description = description.slice(1, -1);
      }
    }

    // Skip skills with disable-model-invocation
    if (/^disable-model-invocation:\s*true/m.test(frontmatter)) continue;

    // Extract emoji (first emoji-presentation character from description)
    const emojiMatch = description.match(/(\p{Extended_Pictographic})/u);
    const emoji = emojiMatch ? emojiMatch[1] : null;

    // Strip markdown bold markers and trailing periods from extracted text
    const clean = (s: string) => s.replace(/\*+/g, '').replace(/\.$/, '').trim();

    // Extract TNG resonance from body — just the character name, not the sentence after
    const tngMatch = rawBody.match(/\*{0,2}TNG resonance:?\*{0,2}\s*([^\n]+)/);
    let tngResonance: string | null = null;
    if (tngMatch) {
      const raw = clean(tngMatch[1]);
      // Split on sentence boundary: period followed by space, but skip abbreviations like "Dr."
      const nameEnd = raw.search(/(?<=[A-Za-z]{3,})\.\s/);
      tngResonance = (nameEnd > 0 ? raw.slice(0, nameEnd) : raw).trim();
    }

    // Extract Archetype from body — just the title, not the elaboration
    const archMatch = rawBody.match(/\*{0,2}Archetype:?\*{0,2}\s*([^\n]+)/);
    let archetype: string | null = null;
    if (archMatch) {
      const raw = clean(archMatch[1]);
      const titleEnd = raw.search(/(?<=[A-Za-z]{3,})\.\s/);
      archetype = (titleEnd > 0 ? raw.slice(0, titleEnd) : raw).trim();
    }

    // Extract Earthly overlay from body
    const overlayMatch = rawBody.match(/\*{0,2}Earthly overlay:?\*{0,2}\s*([^\n]+)/);
    const earthlyOverlay = overlayMatch ? clean(overlayMatch[1]) : null;

    skills.push({ name, description, emoji, tngResonance, archetype, earthlyOverlay, rawBody });
  }

  await writeFile(OUTPUT, JSON.stringify(skills, null, 2));
  console.log(`Built manifest: ${skills.length} skills`);
}

buildManifest();
