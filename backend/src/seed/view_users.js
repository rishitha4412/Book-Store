import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const viewUsers = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookstore';
  console.log(`Connecting to MongoDB at: ${mongoUri}...`);
  await mongoose.connect(mongoUri);

  const users = await User.find({}, 'name email role isVerified createdAt');
  
  console.log("\n=== REGISTERED DATABASE USERS ===");
  console.table(users.map(u => ({
    ID: u._id.toString(),
    Name: u.name,
    Email: u.email,
    Role: u.role,
    Verified: u.isVerified,
    Joined: u.createdAt.toLocaleString()
  })));

  await mongoose.disconnect();
};

viewUsers().catch(err => {
  console.error("Failed to query database:", err);
  process.exit(1);
});
