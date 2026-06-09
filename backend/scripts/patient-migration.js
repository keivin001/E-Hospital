import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Patient from '../models/Patient.js';

dotenv.config();

const migrate = async () => {
  await connectDB();
  await Patient.init();
  await Patient.collection.createIndex({ userId: 1 }, { unique: true });
  await Patient.collection.createIndex({ bloodType: 1, gender: 1, active: 1 });
  await Patient.collection.createIndex({ medicalHistory: 'text', allergies: 'text', chronicConditions: 'text' });
  console.log('Patient collection migration complete');
  process.exit(0);
};

migrate().catch((error) => {
  console.error('Patient migration failed:', error);
  process.exit(1);
});
