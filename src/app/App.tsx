import { AnimatePresence } from 'framer-motion';
import { useLocation, useRoutes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageTransition } from '../components/layout/PageTransition';
import { routes } from './routes';
import { AuthProvider } from './auth-context';

export default function App() {
  return (
    <AuthProvider>
      <AppShell>
        <AuthenticatedApp />
      </AppShell>
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const location = useLocation();
  const element = useRoutes(routes);

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>{element}</PageTransition>
    </AnimatePresence>
  );
}
