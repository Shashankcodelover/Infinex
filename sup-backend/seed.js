require('dotenv').config();
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

const User = require('./user/models/userModel');
const Hackathon = require('./hackathon/models/hackathonModel');
const Team = require('./team/models/teamModel');
const Conversation = require('./chat/models/conversationModel');
const Message = require('./chat/models/messageModel');

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data (use carefully)
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Team.deleteMany({});
    await Hackathon.deleteMany({});
    await User.deleteMany({});

    const password = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      { name: 'Alice Johnson', email: 'alice@example.com', password, state: 'CA', bio: 'Fullstack dev', skills: ['JavaScript','React'], languages: ['JavaScript','Python'], domains: ['Web'], experience: 'Intermediate' },
      { name: 'Bob Smith', email: 'bob@example.com', password, state: 'NY', bio: 'ML enthusiast', skills: ['Python','TensorFlow'], languages: ['Python'], domains: ['AI'], experience: 'Advanced' },
      { name: 'Carol Lee', email: 'carol@example.com', password, state: 'TX', bio: 'Mobile dev', skills: ['Kotlin','Flutter'], languages: ['Dart','Kotlin'], domains: ['Mobile'], experience: 'Intermediate' },
      // Academies / entities as users for quick testing
      { name: 'Academy One', email: 'academy1@example.com', password, state: 'CA', bio: 'Training academy', skills: [], languages: [], domains: ['Education'], experience: 'Advanced' },
      { name: 'Academy Two', email: 'academy2@example.com', password, state: 'WA', bio: 'Bootcamp', skills: [], languages: [], domains: ['Education'], experience: 'Advanced' }
    ]);

    const [alice, bob, carol] = users;

    const hackathons = await Hackathon.insertMany([
      { name: 'Infinex Hack 2026', description: 'Build stuff', date: new Date(Date.now() + 7*24*3600*1000), location: 'Online', hostingLink: 'https://infinex.example.com/register' },
      { name: 'Open AI Challenge', description: 'AI challenges', date: new Date(Date.now() + 30*24*3600*1000), location: 'NYC', hostingLink: 'https://openai.example.com/register' }
    ]);

    const team = await Team.create({ teamName: 'Team Alpha', description: 'Seed team', leader: alice._id, members: [ { userId: bob._id, status: 'accepted', joinedAt: new Date() }, { userId: carol._id, status: 'accepted', joinedAt: new Date() } ], domains: ['Web'], maxMembers: 5, hackathons: [hackathons[0]._id] });

    const conv = await Conversation.create({ name: 'Team Alpha Chat', isGroup: true, members: [alice._id, bob._id, carol._id] });

    await Message.insertMany([
      { conversation: conv._id, sender: alice._id, text: 'Welcome to Team Alpha!' },
      { conversation: conv._id, sender: bob._id, text: 'Excited to collaborate.' },
      { conversation: conv._id, sender: carol._id, text: 'Let\'s set up a meeting.' }
    ]);

    console.log('\nSeed completed. Test accounts:');
    console.log('Email: alice@example.com  Password: password123');
    console.log('Email: bob@example.com    Password: password123');
    console.log('Email: carol@example.com  Password: password123');
    console.log('\nAcademies: academy1@example.com / academy2@example.com (password123)');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed', error);
    process.exit(1);
  }
};

seed();
