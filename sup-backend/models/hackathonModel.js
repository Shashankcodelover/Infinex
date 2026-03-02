const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    logo: {
      type: String // this will store image path later
    },
    hostingLink: {
      type: String,
      required: true, // Must have hosting link to register
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hackathon', hackathonSchema);