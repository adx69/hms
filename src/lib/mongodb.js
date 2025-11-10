import mongoose from 'mongoose';

// Local MongoDB connection - default database name: hospital-management
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds for local
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 5000, // 5 seconds for local
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        cached.promise = null;
        throw new Error(`MongoDB connection failed: ${error.message}. Please ensure MongoDB is running locally on port 27017.`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

