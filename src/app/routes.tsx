import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { BadgesPage } from '../pages/BadgesPage';
import { HomePage } from '../pages/HomePage';
import { TrendsPage } from '../pages/TrendsPage';
import { WorkDetailPage } from '../pages/WorkDetailPage';
import { WorksPage } from '../pages/WorksPage';
import LoginPage from '../pages/LoginPage';
import TaskCenterPage from '../pages/TaskCenterPage';
import RewardMarketPage from '../pages/RewardMarketPage';
import { useAuthContext } from './auth-context';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/trends',
    element: <TrendsPage />,
  },
  {
    path: '/works',
    element: <WorksPage />,
  },
  {
    path: '/works/:workId',
    element: <WorkDetailPage />,
  },
  {
    path: '/badges',
    element: <BadgesPage />,
  },
  {
    path: '/tasks',
    element: <TasksRoute />,
  },
  {
    path: '/rewards',
    element: <RewardsRoute />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

function TasksRoute() {
  const { session, isAdmin, isLoggedIn } = useAuthContext();
  if (!isLoggedIn) return <LoginPage onLogin={(_u, _r) => {}} />;
  return <TaskCenterPage isAdmin={isAdmin} userName={session!.username} />;
}

function RewardsRoute() {
  const { session, isAdmin, isLoggedIn } = useAuthContext();
  if (!isLoggedIn) return <LoginPage onLogin={(_u, _r) => {}} />;
  return <RewardMarketPage isAdmin={isAdmin} userName={session!.username} />;
}
