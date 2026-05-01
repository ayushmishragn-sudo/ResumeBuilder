import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage({ onNavigate }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user) {
    return (
      <div style={{ color: '#ff4b4b', paddingTop: '100px', textAlign: 'center' }}>
        <h2>Forbidden</h2>
        <p>You must be logged in to view your profile.</p>
        <button className="btn-secondary" onClick={() => onNavigate('auth')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>My Profile</h1>
      <p style={{ color: '#a5b4fc', marginBottom: '32px' }}>View your account details and current role.</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '32px', borderRadius: '24px', textAlign: 'center' }}
      >
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
            alt="Profile Avatar" 
            referrerPolicy="no-referrer"
            style={{ 
              width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', 
              border: '4px solid rgba(99, 102, 241, 0.5)', boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)'
            }} 
          />
          {user.role === 'admin' && (
            <div style={{
              position: 'absolute', bottom: '0', right: '0', background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff',
              border: '2px solid rgba(15, 23, 42, 0.8)'
            }}>
              ADMIN
            </div>
          )}
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#fff' }}>{user.name}</h2>
        <p style={{ color: '#9ca3af', fontSize: '15px', margin: '0 0 32px 0' }}>{user.email}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <span style={{ color: '#818cf8', fontWeight: '500' }}>Account ID</span>
            <span style={{ color: '#e4e4e7', fontSize: '14px', fontFamily: 'monospace' }}>{user._id || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <span style={{ color: '#818cf8', fontWeight: '500' }}>Auth Provider</span>
            <span style={{ color: '#e4e4e7', textTransform: 'capitalize' }}>{user.provider || 'Google'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#818cf8', fontWeight: '500' }}>Account Role</span>
            <span style={{ color: user.role === 'admin' ? '#fbbf24' : '#4ade80', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {user.role}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
          {user.role === 'admin' ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('admin')}
              className="btn-secondary"
              style={{ flex: 1, padding: '12px', borderRadius: '12px', borderColor: '#fbbf24', color: '#fbbf24' }}
            >
              Go to Admin Dashboard
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('builder')}
              className="btn-secondary"
              style={{ flex: 1, padding: '12px', borderRadius: '12px' }}
            >
              Go to Builder Dashboard
            </motion.button>
          )}

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.removeItem('user');
              onNavigate('landing');
            }}
            style={{ 
              flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
