import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const topNavigation = readFileSync(join(process.cwd(), 'src', 'components', 'layout', 'TopNavigation.tsx'), 'utf8');

if (topNavigation.includes("../../data/mockUser") || topNavigation.includes('../data/mockUser') || topNavigation.includes('mockUser')) {
  throw new Error('TopNavigation must receive user data via props instead of importing or referencing mockUser directly.');
}

if (!topNavigation.includes('interface TopNavigationProps') || !topNavigation.includes('user: UserProfile')) {
  throw new Error('TopNavigation must expose a TopNavigationProps interface with user: UserProfile.');
}

console.log('Component boundary check passed: TopNavigation receives user data via props.');
