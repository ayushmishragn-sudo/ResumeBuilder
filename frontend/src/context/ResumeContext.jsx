import { createContext, useContext, useState, useCallback } from 'react';

const ResumeContext = createContext();

const initialResumeData = {
  personal: {
    name: '',
    college: '',
    location: '',
    phone: '',
    email: '',
    linkedin: '',
    github: ''
  },
  skills: {
    programmingLanguages: [],
    webDevelopment: [],
    toolsPlatforms: []
  },
  projects: [],
  experience: [],
  education: [],
  certifications: [],
  achievements: [],
  leadership: []
};

export function ResumeProvider({ children }) {
  const [formData, setFormData] = useState(initialResumeData);
  const [template, setTemplate] = useState('classic');
  const [generatedResume, setGeneratedResume] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeScore, setResumeScore] = useState(null);

  const updateFormSection = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'function' ? data(prev[section]) : data
    }));
  }, []);

  const generateResume = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Attach auth user tracking dynamically so backend can see who's making this!
      const payload = { ...formData, template };
      let token = '';
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          token = u.token || '';
          payload.auth_token = true;
          if (u.email && !payload.personal.email) {
            payload.personal.email = u.email;
          }
        }
      } catch (e) {}

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/resume/generate-resume', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        setGeneratedResume(result.data);
      }
      return result;
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [formData, template]);

  const scoreResume = useCallback(async () => {
    if (!generatedResume) return;
    try {
      const response = await fetch('/api/resume/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedResume)
      });
      const result = await response.json();
      if (result.success) {
        setResumeScore(result.data);
      }
      return result;
    } catch (error) {
      console.error('Score error:', error);
    }
  }, [generatedResume]);

  const resetForm = useCallback(() => {
    setFormData(initialResumeData);
    setGeneratedResume(null);
    setCurrentStep(0);
    setResumeScore(null);
  }, []);

  return (
    <ResumeContext.Provider value={{
      formData,
      template,
      setTemplate,
      generatedResume,
      isGenerating,
      currentStep,
      resumeScore,
      setFormData,
      setGeneratedResume,
      setCurrentStep,
      updateFormSection,
      generateResume,
      scoreResume,
      resetForm
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
