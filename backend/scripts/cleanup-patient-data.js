import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';
import Chat from '../models/Chat.js';

dotenv.config();

const cleanup = async () => {
  await connectDB();
  const patients = await Patient.find({}, '_id userId');
  const patientIds = patients.map((patient) => patient._id);
  const userIds = patients.map((patient) => patient.userId);

  await Promise.all([
    Appointment.deleteMany({ patientId: { $nin: patientIds } }),
    Prescription.deleteMany({ patientId: { $nin: patientIds } }),
    Notification.deleteMany({ $and: [{ recipientId: { $nin: userIds } }, { senderId: { $nin: userIds } }] }),
    Chat.deleteMany({ participants: { $nin: userIds } }),
  ]);

  console.log('Patient cleanup complete');
  process.exit(0);
};

cleanup().catch((error) => {
  console.error('Patient cleanup failed:', error);
  process.exit(1);
});
