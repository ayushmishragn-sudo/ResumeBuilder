import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../context/ResumeContext';
import ProgressBar from '../components/ProgressBar';
import { PersonalInfoStep, SkillsStep, ProjectsStep, ExperienceStep, EducationStep, ExtrasStep } from '../components/FormSteps';
import ResumePreview from '../components/ResumePreview';
import ScoreCard from '../components/ScoreCard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const STEP_COMPONENTS = [
  PersonalInfoStep,
  SkillsStep,
  ProjectsStep,
  ExperienceStep,
  EducationStep,
  ExtrasStep,
];

export default function BuilderPage({ onNavigate }) {
  const {
    currentStep, setCurrentStep,
    generatedResume, setGeneratedResume, isGenerating,
    generateResume, scoreResume, resumeScore,
    formData, template, setTemplate
  } = useResume();

  let isLoggedIn = false;
  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      isLoggedIn = true;
      loggedInUser = JSON.parse(userStr);
    }
  } catch (e) { }

  // Lock screen if not logged in
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        {/* Background gradients */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '60px', textAlign: 'center', maxWidth: '500px', position: 'relative', zIndex: 1, borderRadius: '24px' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>Access Restricted</h2>
          <p style={{ color: '#a5b4fc', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6' }}>
            You must be logged in to securely create, save, and download your AI-generated resumes. Let's get you authenticated!
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
            onClick={() => onNavigate && onNavigate('auth')}
            style={{
              padding: '16px 40px', fontSize: '16px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const resumeRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [myResumes, setMyResumes] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch my resumes
  const fetchMyResumes = async () => {
    setIsLoadingHistory(true);
    setShowHistory(prev => !prev);
    try {
      const token = loggedInUser?.token;
      const { default: axios } = await import('axios');
      const { data } = await axios.get('/api/resume/my-resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyResumes(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Pre-load resumes quietly in the background when they enter Builder
  useEffect(() => {
    if (isLoggedIn && loggedInUser?.token) {
      import('axios').then(({ default: axios }) => {
        axios.get('/api/resume/my-resumes', {
          headers: { Authorization: `Bearer ${loggedInUser.token}` }
        })
          .then(res => setMyResumes(res.data))
          .catch(err => console.error('Silent preload error:', err));
      });
    }
  }, [isLoggedIn, loggedInUser?.token]);

  const handleDeleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this resume?')) return;
    try {
      const token = loggedInUser?.token;
      const { default: axios } = await import('axios');
      await axios.delete(`/api/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyResumes(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete resume:', err);
      alert('Could not delete resume.');
    }
  };

  const StepComponent = STEP_COMPONENTS[currentStep];

  const handleNext = () => {
    if (currentStep < STEP_COMPONENTS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    try {
      await generateResume();
    } catch (err) {
      console.error('Failed to generate:', err);
    }
  };

  const handleScore = async () => {
    try {
      await scoreResume();
    } catch (err) {
      console.error('Failed to score:', err);
    }
  };

  const handleExportPDF = useCallback(async () => {
    try {
      if (loggedInUser && generatedResume) {
        setIsExporting(true);
        const { default: axios } = await import('axios');
        await axios.post('/api/resume/save', {
          content: generatedResume,
          template: template
        }, {
          headers: { Authorization: `Bearer ${loggedInUser.token}` }
        });

        // Refresh the 'My Resumes' panel array quietly in the background
        const { data } = await axios.get('/api/resume/my-resumes', {
          headers: { Authorization: `Bearer ${loggedInUser.token}` }
        });
        setMyResumes(data);
      }
    } catch (err) {
      console.error('Failed to explicitly save resume on download:', err);
    } finally {
      setIsExporting(false);
      window.print();
    }
  }, [loggedInUser, generatedResume, template]);

  return (
    <div className="builder-page-root" style={{
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '40px',
    }}>
      {/* Background gradients */}
      <div className="print-hide" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div className="print-hide" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="builder-grid" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT: Form Panel */}
        <motion.div
          className="print-hide"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {loggedInUser && (
            <div style={{
              marginBottom: '24px',
              padding: '16px 20px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                <img
                  src={loggedInUser.avatar || `https://ui-avatars.com/api/?name=${loggedInUser.name}`}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(99, 102, 241, 0.5)' }}
                />
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                    Welcome back, {loggedInUser.name}!
                  </h3>
                  <p style={{ color: '#a5b4fc', fontSize: '13px', margin: '4px 0 0 0' }}>
                    Authenticated securely as <span style={{ color: '#fff' }}>{loggedInUser.email}</span>
                  </p>
                </div>
                <button
                  onClick={fetchMyResumes}
                  className="btn-secondary"
                  style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                >
                  {showHistory ? 'Close History' : '📁 View My Resumes'}
                </button>
              </div>

              {/* History Expandable Panel */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#a5b4fc' }}>Your Automatically Saved Resumes</h4>
                      {isLoadingHistory ? (
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>Loading past resumes...</p>
                      ) : myResumes.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                          {myResumes.map(r => (
                            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{r.content?.header?.title || r.content?.experience?.[0]?.title || 'Resume'}</div>
                                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(r.createdAt).toLocaleString()} · {r.content?.template || 'Classic'} template</div>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => {
                                    setTemplate(r.content?.template || 'classic');
                                    setGeneratedResume(r.content);
                                    if (resumeRef.current) {
                                      resumeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }}
                                  style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                  View / Score
                                </button>
                                <button
                                  onClick={() => handleDeleteResume(r._id)}
                                  title="Remove Resume"
                                  style={{ padding: '6px 10px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>No past resumes found. Generate one!</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <div className="glass-card" style={{ padding: '28px' }}>
            <ProgressBar />

            {/* Animated step content */}
            <div style={{ minHeight: '400px' }}>
              <AnimatePresence mode="wait">
                <StepComponent key={currentStep} />
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '28px',
              gap: '12px',
            }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="btn-secondary"
                style={{
                  flex: 1,
                  padding: '14px',
                  opacity: currentStep === 0 ? 0.3 : 1,
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous
              </motion.button>

              {currentStep < STEP_COMPONENTS.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="btn-primary"
                  style={{ flex: 1, padding: '14px' }}
                >
                  Next →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isGenerating ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{ display: 'inline-block' }}
                      >⚡</motion.span>
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate Resume</>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Score & Export Buttons */}
          {generatedResume && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: '20px' }}
            >
              <ScoreCard score={resumeScore} />

              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleScore}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '14px', borderRadius: '12px' }}
                >
                  🎯 Check ATS Score
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: isExporting ? 'not-allowed' : 'pointer',
                    opacity: isExporting ? 0.6 : 1,
                    fontFamily: 'var(--font-sans)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isExporting ? '⏳ Exporting...' : '📄 Download PDF'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT: Resume Preview */}
        <motion.div
          className="resume-preview-wrapper"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'sticky',
            top: '100px',
          }}
        >
          <div className="print-hide" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#a5b4fc',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Templates
              </span>
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                {['classic', 'modern', 'minimalist'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    style={{
                      background: template === t ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: template === t ? '#818cf8' : '#fff',
                      border: 'none',
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {generatedResume && (
              <span style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}>
                ✓ Generated
              </span>
            )}
          </div>

          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
          }}>
            <ResumePreview
              ref={resumeRef}
              data={generatedResume}
              isGenerating={isGenerating}
              template={template}
            />
          </div>
        </motion.div>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
