import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../context/ResumeContext';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'skills', label: 'Skills', icon: '🛠' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'extras', label: 'More', icon: '✨' },
];

export default function ProgressBar() {
  const { currentStep, setCurrentStep } = useResume();
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: '20px' }}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Step indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '4px',
      }}>
        {STEPS.map((step, index) => (
          <motion.button
            key={step.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep(index)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              background: index === currentStep
                ? 'rgba(99, 102, 241, 0.15)'
                : index < currentStep
                  ? 'rgba(99, 102, 241, 0.05)'
                  : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1,
            }}
          >
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              background: index === currentStep
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : index < currentStep
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
              color: index <= currentStep ? 'white' : 'rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
            }}>
              {index < currentStep ? '✓' : step.icon}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: index === currentStep ? '600' : '400',
              color: index === currentStep
                ? '#a5b4fc'
                : index < currentStep
                  ? 'rgba(165, 180, 252, 0.6)'
                  : 'rgba(255, 255, 255, 0.25)',
              transition: 'all 0.3s ease',
            }}>
              {step.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export { STEPS };
