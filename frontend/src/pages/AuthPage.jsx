import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// We fall back to a dummy string if the env var isn't set so the app doesn't crash
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function CustomGoogleButton({ onNavigate, setIsLoading, disabled }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        // 1. Fetch user profile from google
        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        // 2. Send verified user to our backend
        const { data } = await axios.post('/api/auth/oauth/google', {
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          providerId: profile.sub
        });

        localStorage.setItem('user', JSON.stringify(data));
        
        if (data.role === 'admin') {
          onNavigate('admin');
        } else {
          onNavigate('builder');
        }
      } catch (err) {
        console.error('Google Auth Failed on Backend:', err);
        alert('Could not authenticate. Make sure backend is running.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => console.log('Google Auth Failed', err)
  });

  return (
    <OAuthButton provider="Google" icon={<FaGoogle />} color="#db4437" onClick={() => login()} disabled={disabled} />
  );
}

export default function AuthPage({ onNavigate }) {
  const [isLoading, setIsLoading] = useState(false);

  // Mock handlers for Github/LinkedIn until you add their OAuth APIs
  const handleMockLogin = async (provider) => {
    setIsLoading(true);
    try {
      const mockEmail = provider === 'github' ? 'user@github.com' : 'user@linkedin.com';
      const { data } = await axios.post('/api/auth/oauth/mock', {
        provider,
        email: mockEmail,
        name: `Test ${provider.toUpperCase()}`,
        avatar: `https://ui-avatars.com/api/?name=${provider}&background=random`
      });

      localStorage.setItem('user', JSON.stringify(data));
      onNavigate(data.role === 'admin' ? 'admin' : 'builder');
    } catch (err) {
      console.error('Login Failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1016' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
          zIndex: 0, pointerEvents: 'none'
        }} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{ padding: '40px', maxWidth: '400px', width: '100%', zIndex: 1, textAlign: 'center' }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: '#a5b4fc', marginBottom: '32px', fontSize: '14px' }}>Sign in to sync your AI resumes</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* GENUINE GOOGLE BUTTON */}
            <CustomGoogleButton onNavigate={onNavigate} setIsLoading={setIsLoading} disabled={isLoading} />
            
            {/* MOCK BUTTONS */}
            <OAuthButton provider="GitHub (Mock)" icon={<FaGithub />} color="#333" onClick={() => handleMockLogin('github')} disabled={isLoading} />
            <OAuthButton provider="LinkedIn (Mock)" icon={<FaLinkedin />} color="#0077b5" onClick={() => handleMockLogin('linkedin')} disabled={isLoading} />
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}

function OAuthButton({ provider, icon, color, onClick, disabled }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: `0 4px 12px ${color}40` }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)', cursor: disabled ? 'not-allowed' : 'pointer',
        color: '#fff', fontSize: '16px', fontWeight: '500', transition: 'background 0.3s'
      }}
    >
      <span style={{ color, fontSize: '20px' }}>{icon}</span>
      Continue with {provider}
    </motion.button>
  );
}
