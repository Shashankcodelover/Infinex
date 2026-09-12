const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // DNS override fallback
}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/infinexDB';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("MongoDB Connection Warning ⚠️", error.message);
  }
};

module.exports = connectDB;
