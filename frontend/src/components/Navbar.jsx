import { motion } from 'framer-motion';

export default function Navbar({ onNavigate, currentPage }) {
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (err) {
    console.error('Failed to parse user', err);
    localStorage.removeItem('user');
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 print-hide"
      style={{
        padding: '16px 32px',
      }}
    >
      <div
        className="glass"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          borderRadius: '16px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          onClick={() => onNavigate('landing')}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '800',
            color: 'white',
          }}>
            R
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '18px',
            background: 'linear-gradient(135deg, #818cf8, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ResumeBuilder
          </span>
        </motion.div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentPage !== 'landing' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('landing')}
              className="btn-secondary"
              style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '10px' }}
            >
              Home
            </motion.button>
          )}

          {currentPage === 'landing' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('builder')}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '10px' }}
            >
              Start Building
            </motion.button>
          )}

          {user ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => onNavigate('profile')}
                style={{ cursor: 'pointer', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(99, 102, 241, 0.5)' }}
                title="Go to Profile"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt="Profile Avatar"
                  referrerPolicy="no-referrer"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
              </motion.div>

              {user.role === 'admin' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onNavigate('admin')}
                  className="btn-secondary"
                  style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '10px', borderColor: '#818cf8', color: '#818cf8' }}
                >
                  Admin
                </motion.button>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('auth')}
              className="btn-secondary"
              style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '10px' }}
            >
              Login
            </motion.button>
          )}

        </div>
      </div>
    </motion.nav>
  );
}
