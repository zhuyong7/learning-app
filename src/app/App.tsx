import { AnimatePresence } from 'framer-motion';
import { useLocation, useRoutes, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageTransition } from '../components/layout/PageTransition';
import { routes } from './routes';
import { AuthProvider, useAuthContext } from './auth-context';
import LoginPage from '../pages/LoginPage';

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
  const { isLoggedIn } = useAuthContext();

  if (!isLoggedIn) {
    return (
      <div className="relative z-10 flex min-h-screen">
        <LoginPage onLogin={() => {}} />
      </div>
    );
  }

  return <RoutingContent />;
}

function RoutingContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const element = useRoutes(routes);

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname} onExitComplete={() => navigate(location.pathname)}>
        {element}
      </PageTransition>
    </AnimatePresence>
  );
}
