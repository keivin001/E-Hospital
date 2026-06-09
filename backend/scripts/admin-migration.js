import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import AuditLog from '../models/AuditLog.js';
import SystemSetting from '../models/SystemSetting.js';
import Announcement from '../models/Announcement.js';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/e-hospital';

const migrate = async () => {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for admin migration');

  await Promise.all([
    Role.syncIndexes(),
    Permission.syncIndexes(),
    AuditLog.syncIndexes(),
    SystemSetting.syncIndexes(),
    Announcement.syncIndexes(),
  ]);

  console.log('Admin indexes synced.');
  await mongoose.disconnect();
};

migrate().catch((error) => {
  console.error('Admin migration failed:', error);
  process.exit(1);
});
