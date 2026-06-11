import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const jsonDir = join(root, 'src', 'data', 'json');

const requiredJsonFiles = [
  'user.json',
  'stats.json',
  'works.json',
  'badges.json',
  'trends.json',
  'assistant.json',
];

const errors = [];
const jsonData = new Map();

const toDisplayPath = (filePath) => relative(root, filePath).split(sep).join('/');
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const assertArray = (value, label) => {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array.`);
  }
};

for (const fileName of requiredJsonFiles) {
  const filePath = join(jsonDir, fileName);

  if (!existsSync(filePath)) {
    errors.push(`Missing required JSON file: ${toDisplayPath(filePath)}`);
    continue;
  }

  try {
    jsonData.set(fileName, JSON.parse(readFileSync(filePath, 'utf8')));
  } catch (error) {
    errors.push(`Invalid JSON in ${toDisplayPath(filePath)}: ${error.message}`);
  }
}

if (jsonData.has('user.json') && !isObject(jsonData.get('user.json'))) {
  errors.push('user.json must contain one object.');
}

if (jsonData.has('stats.json')) {
  const stats = jsonData.get('stats.json');
  assertArray(stats?.todayMetrics, 'stats.todayMetrics');
  assertArray(stats?.abilityScores, 'stats.abilityScores');
}

for (const fileName of ['works.json', 'badges.json', 'assistant.json']) {
  if (jsonData.has(fileName)) {
    assertArray(jsonData.get(fileName), fileName);
  }
}

if (jsonData.has('trends.json')) {
  const trends = jsonData.get('trends.json');
  for (const key of ['weeklyTrends', 'monthlyTrends', 'yearlyTrends', 'heatmapDays']) {
    assertArray(trends?.[key], `trends.${key}`);
  }
}

if (errors.length === 0) {
  const srcDir = join(root, 'src');
  const excludedFiles = new Set([join(srcDir, 'data', 'localData.ts')]);
  const oldMockNames = [
    'mockUser',
    'mockWorks',
    'mockBadges',
    'mockAssistantMessages',
    'mockStats',
    'mockTrends',
    'mockAssistant',
  ];
  const oldMockNamePattern = new RegExp(`\\b(?:${oldMockNames.join('|')})\\b`);
  const oldMockImportPattern = /(?:from\s+['"][^'"]*\/mock[A-Z][^'"]*['"]|import\s*\([^)]*['"][^'"]*\/mock[A-Z][^'"]*['"][^)]*\))/;

  const scanSourceFile = (filePath) => {
    if (excludedFiles.has(filePath)) {
      return;
    }

    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      return;
    }

    const source = readFileSync(filePath, 'utf8');
    const displayPath = toDisplayPath(filePath);

    if (oldMockImportPattern.test(source)) {
      errors.push(`${displayPath} contains an old mock data import.`);
    }

    if (oldMockNamePattern.test(source)) {
      errors.push(`${displayPath} references an old mock export name.`);
    }
  };

  const scanDirectory = (dirPath) => {
    for (const entry of readdirSync(dirPath)) {
      const entryPath = join(dirPath, entry);
      const stats = statSync(entryPath);

      if (stats.isDirectory()) {
        scanDirectory(entryPath);
      } else if (stats.isFile()) {
        scanSourceFile(entryPath);
      }
    }
  };

  scanDirectory(srcDir);
}

if (errors.length > 0) {
  console.error('Local JSON data verification failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Local JSON data verification passed.');
