const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // Profile Information
  state: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String], // Array of skills (e.g., ['JavaScript', 'React', 'Node.js'])
    default: []
  },
  languages: {
    type: [String], // Programming languages (e.g., ['Python', 'Java', 'C++'])
    default: []
  },
  domains: {
    type: [String], // Domains of interest (e.g., ['AI', 'Web Dev', 'Mobile'])
    default: []
  },
  experience: {
    type: String, // 'Beginner', 'Intermediate', 'Advanced'
    default: 'Beginner'
  },
  profilePicture: {
    type: String, // URL to profile picture
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);