import { AnimatePresence } from 'framer-motion';
import { useLocation, useRoutes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageTransition } from '../components/layout/PageTransition';
import { routes } from './routes';

export default function App() {
  const location = useLocation();
  const element = useRoutes(routes);

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>{element}</PageTransition>
      </AnimatePresence>
    </AppShell>
  );
}
