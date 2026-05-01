const express = require('express');
const router = express.Router();
const { handleGenerateResume, handleGetSuggestions, handleScoreResume, getAllResumes, getMyResumes, saveResume, deleteResume } = require('../controllers/resumeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect resume generation route so only logged in users can build
router.post('/generate-resume', protect, handleGenerateResume);
router.post('/save', protect, saveResume);
router.post('/suggestions', protect, handleGetSuggestions);
router.post('/score', protect, handleScoreResume);
router.delete('/:id', protect, deleteResume);

// Admin-only can see all resumes
router.get('/all', protect, adminOnly, getAllResumes);

// Fetch user's own resumes
router.get('/my-resumes', protect, getMyResumes);

module.exports = router;
