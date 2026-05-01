const express = require('express');
const { mockOAuthLogin, googleLogin, getAllUsers } = require('../controllers/authController');

const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/oauth/mock', mockOAuthLogin);
router.post('/oauth/google', googleLogin);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
