const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  provider: { type: String, required: true, enum: ['google', 'github', 'linkedin'] },
  providerId: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
