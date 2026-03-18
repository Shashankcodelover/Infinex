const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status: {
          type: String,
          enum: ['invited', 'accepted', 'rejected'],
          default: 'invited'
        },
        joinedAt: {
          type: Date,
          default: null
        }
      }
    ],
    domains: {
      type: [String], // Team domains (e.g., ['AI', 'Web Dev'])
      default: []
    },
    maxMembers: {
      type: Number,
      default: 5
    },
    hackathons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon'
      }
    ],
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
