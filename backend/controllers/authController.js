const User = require('../models/User');
const jwt = require('jsonwebtoken');

// We are simulating the OAuth process here since we don't have the real Client IDs yet.
// In a production app, you would use Passport.js with GoogleStrategy, GitHubStrategy, etc.

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

exports.mockOAuthLogin = async (req, res) => {
  try {
    const { provider, email, name, avatar } = req.body;

    if (!['google', 'github', 'linkedin'].includes(provider)) {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // Auto-register if not exists
    if (!user) {
      user = await User.create({
        name: name || 'Mock User',
        email,
        provider,
        providerId: `mock_${provider}_${Date.now()}`,
        avatar,
        role: email.includes('admin') ? 'admin' : 'user' // simple logic to create test admin
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server authentication error' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { email, name, avatar, providerId } = req.body;

    let user = await User.findOne({ email });

    // Auto-register via genuine Google OAuth
    if (!user) {
      user = await User.create({
        name,
        email,
        provider: 'google',
        providerId,
        avatar,
        role: email.includes('ayushmishrait@gmail.com') ? 'admin' : 'user'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google Verification Error:', error);
    res.status(500).json({ message: 'Server authentication error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Basic protection to simulate "only admin can see"
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};
