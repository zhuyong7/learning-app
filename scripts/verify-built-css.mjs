import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const cssDir = join(process.cwd(), 'dist', 'assets');
if (!existsSync(cssDir)) {
  throw new Error('dist/assets does not exist. Run npm run build before verifying CSS output.');
}

const cssFile = readdirSync(cssDir).find((file) => file.endsWith('.css'));
if (!cssFile) {
  throw new Error('No built CSS file found in dist/assets.');
}

const css = readFileSync(join(cssDir, cssFile), 'utf8');
const requiredSnippets = [
  '.bg-growth-background',
  '.text-growth-ink',
  '.rounded-card',
  '.shadow-card',
  '.from-growth-primary',
  '.to-growth-secondary',
  '.text-white',
  '.bg-slate-50',
  '.text-slate-600',
];

const missing = requiredSnippets.filter((snippet) => !css.includes(snippet));
if (missing.length > 0) {
  throw new Error(`Built CSS is missing required Tailwind utilities: ${missing.join(', ')}`);
}

console.log(`Built CSS contains required Tailwind utilities in ${cssFile}.`);
