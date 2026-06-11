import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { BadgesPage } from '../pages/BadgesPage';
import { HomePage } from '../pages/HomePage';
import { TrendsPage } from '../pages/TrendsPage';
import { WorkDetailPage } from '../pages/WorkDetailPage';
import { WorksPage } from '../pages/WorksPage';

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
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
