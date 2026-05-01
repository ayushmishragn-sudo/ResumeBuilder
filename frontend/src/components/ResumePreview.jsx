import { forwardRef } from 'react';

const ResumePreview = forwardRef(({ data, isGenerating, template = 'classic' }, ref) => {
  if (isGenerating) {
    return (
      <div className="resume-preview" style={{ minHeight: '1000px' }}>
        <div className="skeleton" style={{ height: '28px', width: '60%', margin: '0 auto 8px' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%', margin: '0 auto 4px' }} />
        <div className="skeleton" style={{ height: '14px', width: '70%', margin: '0 auto 20px' }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div className="skeleton" style={{ height: '16px', width: '30%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '12px', width: '100%', marginBottom: '4px' }} />
            <div className="skeleton" style={{ height: '12px', width: '90%', marginBottom: '4px' }} />
            <div className="skeleton" style={{ height: '12px', width: '95%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="resume-preview" style={{
        minHeight: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.4,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#888' }}>Your Resume Preview</div>
        <div style={{ fontSize: '13px', color: '#aaa', marginTop: '8px' }}>
          Fill in the form and click "Generate" to see your AI-enhanced resume
        </div>
      </div>
    );
  }

  const { header, skills, projects, internships, education, certifications, achievements, leadership } = data;

  // Helper to parse markdown-style bold text (**text**)
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div ref={ref} className={`resume-preview template-${template}`} id="resume-content">
      {/* HEADER */}
      <h1>{header?.name || 'Your Name'}</h1>
      {(header?.college || header?.location) && (
        <div className="college-line">
          {[header?.college, header?.location].filter(Boolean).join(', ')}
        </div>
      )}
      <div className="contact-line">
        {[
          header?.phone && <span key="phone"><i className="fas fa-phone"></i> <a href={`tel:${header.phone}`}>{header.phone}</a></span>,
          header?.email && <span key="email"><i className="fas fa-envelope"></i> <a href={`mailto:${header.email}`}>{header.email}</a></span>,
          header?.linkedin && <span key="linkedin"><i className="fab fa-linkedin"></i> <a href={header.linkedin.startsWith('http') ? header.linkedin : `https://${header.linkedin}`} target="_blank" rel="noopener noreferrer">{header.linkedin.replace(/https?:\/\//, '').replace('www.', '').replace('linkedin.com/in/', '').replace(/\/$/, '')}</a></span>,
          header?.github && <span key="github"><i className="fab fa-github"></i> <a href={header.github.startsWith('http') ? header.github : `https://${header.github}`} target="_blank" rel="noopener noreferrer">{header.github.replace(/https?:\/\//, '').replace('www.', '').replace('github.com/', '').replace(/\/$/, '')}</a></span>,
        ].filter(Boolean).reduce((acc, item, idx) => {
          if (idx > 0) acc.push(<span key={`sep-${idx}`} className="contact-sep">|</span>);
          acc.push(item);
          return acc;
        }, [])}
      </div>

      {/* SKILLS */}
      {skills && Object.values(skills).some(arr => arr?.length > 0) && (
        <>
          <div className="section-title">Skills</div>
          <div style={{ marginBottom: '8px' }}>
            {skills.programmingLanguages?.length > 0 && (
              <div style={{ marginBottom: '2px' }}>
                <span className="skill-category">Programming Languages: </span>
                <span className="skill-items">{skills.programmingLanguages.join(', ')}</span>
              </div>
            )}
            {skills.webDevelopment?.length > 0 && (
              <div style={{ marginBottom: '2px' }}>
                <span className="skill-category">Web Development: </span>
                <span className="skill-items">{skills.webDevelopment.join(', ')}</span>
              </div>
            )}
            {skills.toolsPlatforms?.length > 0 && (
              <div style={{ marginBottom: '2px' }}>
                <span className="skill-category">Tools & Platforms: </span>
                <span className="skill-items">{skills.toolsPlatforms.join(', ')}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* PROJECTS */}
      {projects?.length > 0 && (
        <>
          <div className="section-title">Projects</div>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div>
                <span className="project-title">{proj.title}</span>
                {proj.description && (
                  <span className="project-desc"> — {proj.description}</span>
                )}
                {proj.isGroup && <span style={{ fontSize: '11pt', color: '#000' }}>(Group Project)</span>}
              </div>
              {proj.techStack?.length > 0 && (
                <div className="tech-stack">
                  Tech Stack: {proj.techStack.join(', ')}
                </div>
              )}
              {proj.bullets?.length > 0 && (
                <ul>
                  {proj.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                    <li key={bIdx}>{renderText(bullet)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* INTERNSHIPS */}
      {internships?.length > 0 && (
        <>
          <div className="section-title">Internships</div>
          {internships.map((intern, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '11pt' }}>{intern.role}</span>
                  {intern.organization && <span style={{ fontWeight: '700' }}> — {intern.organization}</span>}
                </div>
                {intern.year && <div style={{ fontSize: '10.5pt' }}>{intern.year}</div>}
              </div>
              {intern.description && (
                <div style={{ fontSize: '10.5pt', marginTop: '2px' }}>
                  {renderText(intern.description)}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <>
          <div className="section-title">Education</div>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {education.map((edu, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>
                <div className="education-entry" style={{ marginBottom: '0' }}>
                  <div className="education-inst">{edu.institution}</div>
                  <div className="education-right">{edu.location || ''}</div>
                </div>
                <div className="education-entry" style={{ marginBottom: '0' }}>
                  <div className="education-degree">{edu.degree}</div>
                  <div className="education-right">{edu.year}</div>
                </div>
                {edu.details && <div style={{ fontSize: '10.5pt' }}>{edu.details}</div>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* CERTIFICATIONS */}
      {certifications?.length > 0 && (
        <>
          <div className="section-title">Certifications / Awards</div>
          <ul>
            {certifications.filter(c => c.trim()).map((cert, i) => (
              <li key={i}>{renderText(cert)}</li>
            ))}
          </ul>
        </>
      )}

      {/* ACHIEVEMENTS */}
      {achievements?.length > 0 && (
        <>
          <div className="section-title">Achievements</div>
          <ul>
            {achievements.filter(a => a.trim()).map((achievement, i) => (
              <li key={i}>{renderText(achievement)}</li>
            ))}
          </ul>
        </>
      )}

      {/* LEADERSHIP */}
      {leadership?.length > 0 && (
        <>
          <div className="section-title">Leadership / Extracurricular</div>
          {leadership.map((item, i) => {
            if (typeof item === 'object') {
              return (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: '700', fontSize: '11pt' }}>{item.title}</div>
                    <div style={{ fontSize: '10.5pt' }}>{item.date}</div>
                  </div>
                  {item.bullets?.length > 0 && (
                    <ul>
                      {item.bullets.map((b, bIdx) => <li key={bIdx}>{renderText(b)}</li>)}
                    </ul>
                  )}
                </div>
              );
            }
            return (
              <ul key={i} style={{ marginBottom: '4px' }}>
                <li>{renderText(item)}</li>
              </ul>
            );
          })}
        </>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
