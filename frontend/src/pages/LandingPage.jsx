import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';

const HeroScene = lazy(() => import('../components/3d/HeroScene'));

export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* 3D Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '13px',
            color: '#a5b4fc',
            marginBottom: '24px',
            fontWeight: '500',
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#6366f1',
            animation: 'pulse 2s infinite',
          }} />
          Powered by AI • ATS Optimized
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 7vw, 80px)',
            fontWeight: '800',
            lineHeight: '1.05',
            maxWidth: '900px',
            marginBottom: '20px',
            letterSpacing: '-0.03em',
          }}
        >
          <span>Build Your AI Resume</span>
          <br />
          <span className="gradient-text">in Seconds</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            maxWidth: '560px',
            marginBottom: '40px',
            opacity: 0.6,
            lineHeight: '1.6',
            fontWeight: '400',
          }}
        >
          Powered by AI. Designed for Impact. Create professional,
          ATS-optimized resumes with one click.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('builder')}
            className="btn-primary"
            style={{
              padding: '16px 40px',
              fontSize: '16px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Generate Resume</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </motion.button>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{
            marginTop: '64px',
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { icon: '⚡', title: 'AI-Powered', desc: 'Smart content generation' },
            { icon: '🎯', title: 'ATS-Optimized', desc: '95%+ pass rate' },
            { icon: '📄', title: 'PDF Export', desc: 'Perfect formatting' },
            { icon: '✨', title: 'Live Preview', desc: 'Real-time editing' }
          ].map((f, i) => (
            <motion.div
              key={i}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
                borderColor: 'rgba(99, 102, 241, 0.3)'
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '24px',
                borderRadius: '16px',
                background: 'rgba(30, 30, 46, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'border-color 0.3s'
              }}
            >
              <span style={{ fontSize: '20px' }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{f.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.5 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(to top, var(--color-surface-950), transparent)',
        zIndex: 5,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
