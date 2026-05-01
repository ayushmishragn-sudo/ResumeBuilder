import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../context/ResumeContext';
import { HiPlus, HiTrash } from 'react-icons/hi';

function FloatingInput({ label, value, onChange, type = 'text', placeholder = ' ', error = false, errorMessage = '' }) {
  return (
    <div className="floating-label-group" style={{ marginBottom: '16px' }}>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        style={error ? { borderColor: '#ef4444', boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.2)' } : {}}
      />
      <label className="floating-label" style={error ? { color: '#ef4444' } : {}}>{label}</label>
      {error && errorMessage && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginLeft: '4px', fontWeight: '500' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}

function TagInput({ label, tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--color-primary-400)',
        marginBottom: '8px',
      }}>{label}</label>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '8px',
      }}>
        <AnimatePresence>
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '12px',
                color: '#a5b4fc',
                fontWeight: '500',
              }}
            >
              {tag}
              <button
                onClick={() => removeTag(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(165, 180, 252, 0.5)',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '14px',
                  lineHeight: 1,
                }}
              >×</button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="input-field"
          style={{ flex: 1 }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTag}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#818cf8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
          }}
        >
          <HiPlus />
        </motion.button>
      </div>
    </div>
  );
}

// Step 0: Personal Info
function PersonalInfoStep() {
  const { formData, updateFormSection } = useResume();
  const personal = formData.personal;

  const update = (field) => (e) => {
    updateFormSection('personal', { ...personal, [field]: e.target.value });
  };

  const phoneVal = personal.phone || '';
  const isPhoneError = phoneVal.length > 0 && phoneVal.length !== 10;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '6px',
      }}>Personal Information</h2>
      <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>
        Let's start with your basics.
      </p>
      <FloatingInput label="Full Name" value={personal.name} onChange={update('name')} />
      <FloatingInput label="College / University" value={personal.college} onChange={update('college')} />
      <FloatingInput label="Location" value={personal.location} onChange={update('location')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <FloatingInput 
          label="Phone" 
          value={personal.phone} 
          onChange={update('phone')} 
          type="tel" 
          error={isPhoneError}
          errorMessage={isPhoneError ? "Must be exactly 10 characters" : ""}
        />
        <FloatingInput label="Email" value={personal.email} onChange={update('email')} type="email" />
      </div>
      <FloatingInput label="LinkedIn URL" value={personal.linkedin} onChange={update('linkedin')} />
      <FloatingInput label="GitHub URL" value={personal.github} onChange={update('github')} />
    </motion.div>
  );
}

// Step 1: Skills
function SkillsStep() {
  const { formData, updateFormSection } = useResume();
  const skills = formData.skills;

  const updateSkills = (category) => (newTags) => {
    updateFormSection('skills', { ...skills, [category]: newTags });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '6px',
      }}>Technical Skills</h2>
      <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>
        Add your skills by category.
      </p>
      <TagInput label="Programming Languages" tags={skills.programmingLanguages || []} onChange={updateSkills('programmingLanguages')} />
      <TagInput label="Web Development" tags={skills.webDevelopment || []} onChange={updateSkills('webDevelopment')} />
      <TagInput label="Tools & Platforms" tags={skills.toolsPlatforms || []} onChange={updateSkills('toolsPlatforms')} />
    </motion.div>
  );
}

// Step 2: Projects
function ProjectsStep() {
  const { formData, updateFormSection } = useResume();
  const projects = formData.projects;

  const addProject = () => {
    updateFormSection('projects', [...projects, {
      title: '', description: '', isGroup: false, techStack: [], bullets: ['']
    }]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    updateFormSection('projects', updated);
  };

  const removeProject = (index) => {
    updateFormSection('projects', projects.filter((_, i) => i !== index));
  };

  const addBullet = (projIdx) => {
    const updated = [...projects];
    updated[projIdx].bullets = [...(updated[projIdx].bullets || []), ''];
    updateFormSection('projects', updated);
  };

  const updateBullet = (projIdx, bulletIdx, value) => {
    const updated = [...projects];
    updated[projIdx].bullets[bulletIdx] = value;
    updateFormSection('projects', updated);
  };

  const removeBullet = (projIdx, bulletIdx) => {
    const updated = [...projects];
    updated[projIdx].bullets = updated[projIdx].bullets.filter((_, i) => i !== bulletIdx);
    updateFormSection('projects', updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '6px',
      }}>Projects</h2>
      <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>
        Showcase your best work.
      </p>

      <AnimatePresence>
        {projects.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card"
            style={{ padding: '20px', marginBottom: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>Project {i + 1}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeProject(i)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  color: '#f87171',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HiTrash />
              </motion.button>
            </div>

            <FloatingInput label="Project Title" value={proj.title} onChange={(e) => updateProject(i, 'title', e.target.value)} />
            <FloatingInput label="Brief Description" value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} />

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={proj.isGroup || false}
                  onChange={(e) => updateProject(i, 'isGroup', e.target.checked)}
                  style={{ accentColor: '#6366f1' }}
                />
                Group Project
              </label>
            </div>

            <TagInput
              label="Tech Stack"
              tags={proj.techStack || []}
              onChange={(tags) => updateProject(i, 'techStack', tags)}
            />

            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-primary-400)',
                marginBottom: '8px',
              }}>Bullet Points</label>
              {(proj.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    value={bullet}
                    onChange={(e) => updateBullet(i, bIdx, e.target.value)}
                    placeholder="Describe an achievement..."
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeBullet(i, bIdx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(248, 113, 113, 0.6)',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '0 8px',
                    }}
                  >×</motion.button>
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addBullet(i)}
                style={{
                  background: 'none',
                  border: '1px dashed rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  color: '#818cf8',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  fontSize: '12px',
                  width: '100%',
                }}
              >
                + Add Bullet
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addProject}
        className="btn-secondary"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <HiPlus /> Add Project
      </motion.button>
    </motion.div>
  );
}

// Step 3: Experience
function ExperienceStep() {
  const { formData, updateFormSection } = useResume();
  const experience = formData.experience;

  const addExperience = () => {
    updateFormSection('experience', [...experience, { role: '', organization: '', year: '', description: '' }]);
  };

  const updateExp = (index, field, value) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    updateFormSection('experience', updated);
  };

  const removeExp = (index) => {
    updateFormSection('experience', experience.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '6px',
      }}>Experience & Internships</h2>
      <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>
        Add your work experience.
      </p>

      <AnimatePresence>
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card"
            style={{ padding: '20px', marginBottom: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>Experience {i + 1}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeExp(i)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  color: '#f87171',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HiTrash />
              </motion.button>
            </div>
            <FloatingInput label="Role / Title" value={exp.role} onChange={(e) => updateExp(i, 'role', e.target.value)} />
            <FloatingInput label="Organization" value={exp.organization} onChange={(e) => updateExp(i, 'organization', e.target.value)} />
            <FloatingInput label="Duration" value={exp.year} onChange={(e) => updateExp(i, 'year', e.target.value)} />
            <FloatingInput label="Description" value={exp.description} onChange={(e) => updateExp(i, 'description', e.target.value)} />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addExperience}
        className="btn-secondary"
        style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <HiPlus /> Add Experience
      </motion.button>
    </motion.div>
  );
}

// Step 4: Education
function EducationStep() {
  const { formData, updateFormSection } = useResume();
  const education = formData.education;

  const addEducation = () => {
    updateFormSection('education', [...education, {
      institution: '', degree: '', year: '', details: '', location: ''
    }]);
  };

  const updateEdu = (index, field, value) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    updateFormSection('education', updated);
  };

  const removeEdu = (index) => {
    updateFormSection('education', education.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '6px',
      }}>Education</h2>
      <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>
        Add your educational background.
      </p>

      <AnimatePresence>
        {education.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card"
            style={{ padding: '20px', marginBottom: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>Education {i + 1}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeEdu(i)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  color: '#f87171',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HiTrash />
              </motion.button>
            </div>
            <FloatingInput label="Degree / Class" value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)} />
            <FloatingInput label="Institution / School" value={edu.institution} onChange={(e) => updateEdu(i, 'institution', e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FloatingInput label="Year" value={edu.year} onChange={(e) => updateEdu(i, 'year', e.target.value)} />
              <FloatingInput label="City, State" value={edu.location} onChange={(e) => updateEdu(i, 'location', e.target.value)} />
            </div>
            <FloatingInput label="Details (GPA, etc.)" value={edu.details} onChange={(e) => updateEdu(i, 'details', e.target.value)} />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addEducation}
        className="btn-secondary"
        style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <HiPlus /> Add Education
      </motion.button>
    </motion.div>
  );
}

// Step 5: Extras (Certifications, Achievements, Leadership)
function ExtrasStep() {
  const { formData, updateFormSection } = useResume();

  const addToList = (section) => {
    updateFormSection(section, [...(formData[section] || []), '']);
  };

  const updateListItem = (section, index, value) => {
    const updated = [...formData[section]];
    updated[index] = value;
    updateFormSection(section, updated);
  };

  const removeFromList = (section, index) => {
    updateFormSection(section, formData[section].filter((_, i) => i !== index));
  };

  const ListSection = ({ title, section }) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#a5b4fc',
        marginBottom: '10px',
      }}>{title}</label>
      {(formData[section] || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            value={item}
            onChange={(e) => updateListItem(section, i, e.target.value)}
            placeholder={`Add ${title.toLowerCase()}...`}
            className="input-field"
            style={{ flex: 1 }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => removeFromList(section, i)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(248, 113, 113, 0.6)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0 8px',
            }}
          >×</motion.button>
        </div>
      ))}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => addToList(section)}
        style={{
          background: 'none',
          border: '1px dashed rgba(99, 102, 241, 0.2)',
          borderRadius: '8px',
          color: '#818cf8',
          cursor: 'pointer',
          padding: '8px 16px',
          fontSize: '12px',
          width: '100%',
        }}
      >
        + Add {title}
      </motion.button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '6px',
      }}>Additional Sections</h2>
      <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '24px' }}>
        Certifications, achievements, and more.
      </p>
      <ListSection title="Certifications" section="certifications" />
      <ListSection title="Achievements" section="achievements" />
      <ListSection title="Leadership / Extracurricular" section="leadership" />
    </motion.div>
  );
}

export { PersonalInfoStep, SkillsStep, ProjectsStep, ExperienceStep, EducationStep, ExtrasStep };
