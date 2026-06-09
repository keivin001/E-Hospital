import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Hospital from '../models/Hospital.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';
import Chat from '../models/Chat.js';

dotenv.config();

const sampleEmails = ['alice@example.com', 'bob@example.com', 'paul@example.com'];
const sampleHospitalNames = ['Central Hospital'];

const removeSampleData = async () => {
  await connectDB();

  const sampleUsers = await User.find({ email: { $in: sampleEmails } }).select('_id');
  const sampleUserIds = sampleUsers.map((user) => user._id);

  const sampleDoctors = await Doctor.find({ userId: { $in: sampleUserIds } }).select('_id');
  const sampleDoctorIds = sampleDoctors.map((doctor) => doctor._id);

  const samplePatients = await Patient.find({ userId: { $in: sampleUserIds } }).select('_id');
  const samplePatientIds = samplePatients.map((patient) => patient._id);

  await Promise.all([
    Appointment.deleteMany({
      $or: [
        { doctorId: { $in: sampleDoctorIds } },
        { patientId: { $in: samplePatientIds } },
        { adminId: { $in: sampleUserIds } },
      ],
    }),
    Prescription.deleteMany({
      $or: [
        { doctorId: { $in: sampleDoctorIds } },
        { patientId: { $in: samplePatientIds } },
        { issuedBy: { $in: sampleUserIds } },
      ],
    }),
    Notification.deleteMany({
      $or: [
        { recipientId: { $in: sampleUserIds } },
        { senderId: { $in: sampleUserIds } },
      ],
    }),
    Chat.deleteMany({ participants: { $in: sampleUserIds } }),
    Hospital.deleteMany({ name: { $in: sampleHospitalNames } }),
    Doctor.deleteMany({ userId: { $in: sampleUserIds } }),
    Patient.deleteMany({ userId: { $in: sampleUserIds } }),
    User.deleteMany({ email: { $in: sampleEmails } }),
  ]);

  console.log('Sample seed data removed successfully.');
  process.exit(0);
};

removeSampleData().catch((error) => {
  console.error('Failed to remove sample data:', error);
  process.exit(1);
});
