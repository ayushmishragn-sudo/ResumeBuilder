import { useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ResumeProvider } from './context/ResumeContext';
import Navbar from './components/Navbar';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const BuilderPage = lazy(() => import('./pages/BuilderPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: '800',
          color: 'white',
        }}>
          R
        </div>
        <span style={{
          fontSize: '13px',
          opacity: 0.4,
          fontWeight: '500',
        }}>Loading...</span>
      </motion.div>
    </div>
  );
}

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  // We wrap setCurrentPage to mock routing logic easily
  const handleNavigate = (page) => {
    // Standard mock hash routing wrapper
    window.location.hash = page;
    setCurrentPage(page);
  };

  return (
    <ResumeProvider>
        <div className="noise-overlay">
          <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

          <Suspense fallback={<LoadingFallback />}>
            <AnimatePresence mode="wait">
              {currentPage === 'landing' && (
                <motion.div key="landing" {...pageTransition}>
                  <LandingPage onNavigate={handleNavigate} />
                </motion.div>
              )}
              {currentPage === 'builder' && (
                <motion.div key="builder" {...pageTransition}>
                  <BuilderPage onNavigate={handleNavigate} />
                </motion.div>
              )}
              {currentPage === 'auth' && (
                <motion.div key="auth" {...pageTransition}>
                  <AuthPage onNavigate={handleNavigate} />
                </motion.div>
              )}
              {currentPage === 'admin' && (
                <motion.div key="admin" {...pageTransition}>
                  <AdminDashboard onNavigate={handleNavigate} />
                </motion.div>
              )}
              {currentPage === 'profile' && (
                <motion.div key="profile" {...pageTransition}>
                  <ProfilePage onNavigate={handleNavigate} />
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>
        </div>
      </ResumeProvider>
  );
}
