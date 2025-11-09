// Test MongoDB Connection
// Run with: node test-connection.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://venom:123@cluster0.juhchz4.mongodb.net/hospital-management?retryWrites=true&w=majority';

console.log('🔍 Testing MongoDB connection...');
console.log('Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

const opts = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority',
};

mongoose.connect(MONGODB_URI, opts)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check your internet connection');
    console.error('2. Verify MongoDB Atlas cluster is running');
    console.error('3. Check Network Access whitelist in MongoDB Atlas');
    console.error('4. Try using a different connection string format');
    console.error('5. Check if you\'re behind a firewall/VPN');
    process.exit(1);
  });

