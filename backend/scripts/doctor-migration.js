import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Doctor from '../models/Doctor.js';
import MedicalRecord from '../models/MedicalRecord.js';

dotenv.config();

const migrate = async () => {
  await connectDB();
  await Doctor.init();
  await MedicalRecord.init();
  await Doctor.collection.createIndex({ userId: 1 }, { unique: true });
  await Doctor.collection.createIndex({ hospitalId: 1, active: 1 });
  await Doctor.collection.createIndex({ specialty: 'text', about: 'text' });
  await MedicalRecord.collection.createIndex({ patientId: 1, doctorId: 1 });
  await MedicalRecord.collection.createIndex({ diagnosis: 'text', treatmentPlan: 'text', notes: 'text' });
  console.log('Doctor and medical record migration complete');
  process.exit(0);
};

migrate().catch((error) => {
  console.error('Doctor migration failed:', error);
  process.exit(1);
});
