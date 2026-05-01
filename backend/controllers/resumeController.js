const { generateResume, getSuggestions, scoreResume } = require('../services/aiService');
const Resume = require('../models/Resume');

// Generate resume from user input
async function handleGenerateResume(req, res) {
  try {
    const userData = req.body;
    
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ error: 'No user data provided' });
    }

    const resume = await generateResume(userData);

    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ error: 'Failed to generate resume', message: error.message });
  }
}

// Admin only: Get all generated resumes
async function getAllResumes(req, res) {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 }).limit(100);
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
}

// Get logged-in user's own resumes
async function getMyResumes(req, res) {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your resumes' });
  }
}

// Get AI suggestions for a section
async function handleGetSuggestions(req, res) {
  try {
    const { section, content } = req.body;
    
    if (!section || !content) {
      return res.status(400).json({ error: 'Section and content are required' });
    }

    const suggestions = await getSuggestions(section, content);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ error: 'Failed to get suggestions', message: error.message });
  }
}

// Score a resume
async function handleScoreResume(req, res) {
  try {
    const resumeData = req.body;
    
    if (!resumeData || Object.keys(resumeData).length === 0) {
      return res.status(400).json({ error: 'No resume data provided' });
    }

    const score = await scoreResume(resumeData);
    res.json({ success: true, data: score });
  } catch (error) {
    console.error('Score error:', error);
    res.status(500).json({ error: 'Failed to score resume', message: error.message });
  }
}

// Explicitly save a resume to DB (triggered on download)
async function saveResume(req, res) {
  try {
    const { content, template } = req.body;
    const finalContent = { ...content, template: template || 'classic' };
    
    const uEmail = content?.header?.email || req.user.email;
    const saved = await Resume.create({
      user: req.user._id,
      userEmail: uEmail,
      content: finalContent
    });
    
    res.json({ success: true, data: saved });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to explicitly save resume', message: error.message });
  }
}

// Delete a resume
async function deleteResume(req, res) {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    
    if (resume.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this resume' });
    }
    
    await Resume.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete resume', message: error.message });
  }
}

module.exports = { handleGenerateResume, handleGetSuggestions, handleScoreResume, getAllResumes, getMyResumes, saveResume, deleteResume };
