import { motion } from 'framer-motion';

export default function ScoreCard({ score }) {
  if (!score) return null;

  const getScoreColor = (val) => {
    if (val >= 85) return '#22c55e';
    if (val >= 70) return '#eab308';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score.overallScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ padding: '24px', marginBottom: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        {/* Circular score */}
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="rgba(99, 102, 241, 0.1)"
              strokeWidth="6"
            />
            <motion.circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={getScoreColor(score.overallScore)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              color: getScoreColor(score.overallScore),
            }}>
              {score.overallScore}
            </div>
            <div style={{ fontSize: '9px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ATS Score
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '4px',
          }}>Resume Score</h3>
          <p style={{ fontSize: '12px', opacity: 0.5 }}>
            Based on ATS compatibility analysis
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {Object.entries(score.breakdown || {}).map(([key, val]) => (
          <div key={key} style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
            }}>
              <span style={{ fontSize: '11px', textTransform: 'capitalize', fontWeight: '500' }}>{key}</span>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: getScoreColor(val.score),
              }}>{val.score}</span>
            </div>
            <div style={{
              height: '3px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${val.score}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  background: getScoreColor(val.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {score.topSuggestions?.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a5b4fc', marginBottom: '8px' }}>
            Top Suggestions
          </div>
          {score.topSuggestions.map((suggestion, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.05)',
              marginBottom: '4px',
              fontSize: '12px',
              alignItems: 'flex-start',
            }}>
              <span style={{ color: '#818cf8', flexShrink: 0 }}>💡</span>
              <span style={{ opacity: 0.7 }}>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
