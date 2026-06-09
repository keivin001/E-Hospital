import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Announcement from '../models/Announcement.js';
import Appointment from '../models/Appointment.js';
import AuditLog from '../models/AuditLog.js';
import Chat from '../models/Chat.js';
import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Notification from '../models/Notification.js';
import Patient from '../models/Patient.js';
import Prescription from '../models/Prescription.js';
import User from '../models/User.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import SystemSetting from '../models/SystemSetting.js';

dotenv.config();

const purgeRuntimeData = async ({ keepUsers = true, keepSystem = true } = {}) => {
  await connectDB();

  const deleteTasks = [
    Announcement.deleteMany({}),
    Appointment.deleteMany({}),
    AuditLog.deleteMany({}),
    Chat.deleteMany({}),
    Doctor.deleteMany({}),
    Hospital.deleteMany({}),
    MedicalRecord.deleteMany({}),
    Notification.deleteMany({}),
    Patient.deleteMany({}),
    Prescription.deleteMany({}),
  ];

  if (!keepUsers) {
    deleteTasks.push(User.deleteMany({}));
  }

  if (!keepSystem) {
    deleteTasks.push(Permission.deleteMany({}), Role.deleteMany({}), SystemSetting.deleteMany({}));
  }

  await Promise.all(deleteTasks);
};

const run = async () => {
  try {
    const keepUsers = process.env.PURGE_KEEP_USERS !== 'false';
    const keepSystem = process.env.PURGE_KEEP_SYSTEM !== 'false';
    const purgeAll = process.env.PURGE_ALL === 'true';

    console.log('Starting purge...');
    console.log(`keepUsers=${keepUsers}, keepSystem=${keepSystem}, purgeAll=${purgeAll}`);

    if (purgeAll) {
      await purgeRuntimeData({ keepUsers: false, keepSystem: false });
    } else {
      await purgeRuntimeData({ keepUsers, keepSystem });
    }

    console.log('Purge complete.');
    process.exit(0);
  } catch (error) {
    console.error('Purge failed:', error);
    process.exit(1);
  }
};

run();
