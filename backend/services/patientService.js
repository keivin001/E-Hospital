import bcrypt from 'bcryptjs';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';
import Chat from '../models/Chat.js';
import mongoose from 'mongoose';

const buildMatchQuery = ({ gender, bloodType, active }) => {
  const match = {};
  if (gender) match.gender = gender;
  if (bloodType) match.bloodType = bloodType;
  if (active !== undefined) {
    match.active = active === true || active === 'true';
  }
  return match;
};

export const getPatientById = (id) => {
  return Patient.findById(id).populate('userId primaryDoctorId');
};

export const getPatientByUserId = (userId) => {
  return Patient.findOne({ userId }).populate('userId primaryDoctorId');
};

export const createPatient = (payload) => {
  return Patient.create(payload);
};

export const createPatientWithUser = async ({ userData, patientData, appointments = [], prescriptions = [], notifications = [], chats = [] }) => {
  if (!userData.password && !userData.passwordHash) {
    throw new Error('Password is required when creating a new patient account');
  }

  const passwordHash = userData.password
    ? await bcrypt.hash(userData.password, 10)
    : userData.passwordHash;

  const { password, ...userFields } = userData;
  const user = await User.create({ ...userFields, passwordHash, role: userData.role || 'patient' });
  const patient = await Patient.create({ ...patientData, userId: user._id });

  const createdAppointments = appointments.length
    ? await Appointment.insertMany(appointments.map((appointment) => ({ ...appointment, patientId: patient._id })))
    : [];

  const createdPrescriptions = prescriptions.length
    ? await Prescription.insertMany(prescriptions.map((prescription) => ({ ...prescription, patientId: patient._id })))
    : [];

  const createdNotifications = notifications.length
    ? await Notification.insertMany(notifications.map((notification) => ({ ...notification, recipientId: user._id })))
    : [];

  const createdChats = chats.length
    ? await Chat.insertMany(
        chats.map((chat) => ({
          ...chat,
          participants: Array.isArray(chat.participants)
            ? [...new Set([user._id.toString(), ...chat.participants.map((id) => id.toString())])]
            : [user._id],
        }))
      )
    : [];

  return { user, patient, createdAppointments, createdPrescriptions, createdNotifications, createdChats };
};

export const updatePatient = (id, payload) => {
  return Patient.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

export const deletePatient = (id) => {
  return Patient.findByIdAndDelete(id);
};

export const clearPatientRecords = async (patient, userId) => {
  const patientId = patient._id;
  await Promise.all([
    Appointment.deleteMany({ patientId }),
    Prescription.deleteMany({ patientId }),
    Notification.deleteMany({ $or: [{ recipientId: userId }, { senderId: userId }] }),
    Chat.deleteMany({ participants: userId }),
  ]);
};

export const getPatientProfile = async (patientId) => {
  const patient = await Patient.findById(patientId).populate('userId primaryDoctorId');
  if (!patient) return null;

  const doctor = patient.primaryDoctorId ? await Doctor.findById(patient.primaryDoctorId).populate('userId hospitalId') : null;
  const appointments = await Appointment.find({ patientId: patient._id }).populate('patientId doctorId adminId');
  const prescriptions = await Prescription.find({ patientId: patient._id }).populate('appointmentId patientId doctorId');
  const notifications = await Notification.find({ recipientId: patient.userId }).populate('senderId');
  const chats = await Chat.find({ participants: patient.userId }).populate('participants');

  return {
    patient,
    doctor,
    appointments,
    prescriptions,
    notifications,
    chats,
  };
};

export const searchPatients = async ({ search, gender, bloodType, active, page = 1, limit = 20 }) => {
  const match = buildMatchQuery({ gender, bloodType, active });
  const skip = Math.max(0, page - 1) * limit;

  if (search) {
    const regex = new RegExp(search, 'i');
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: {
          $or: [
            { 'user.name': regex },
            { 'user.email': regex },
            { medicalHistory: regex },
            { allergies: regex },
            { chronicConditions: regex },
          ],
        },
      },
    ];

    const countResult = await Patient.aggregate([...pipeline, { $count: 'total' }]);
    const total = countResult[0]?.total || 0;

    const results = await Patient.aggregate([
      ...pipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'doctors',
          localField: 'primaryDoctorId',
          foreignField: '_id',
          as: 'primaryDoctor',
        },
      },
      { $unwind: { path: '$primaryDoctor', preserveNullAndEmptyArrays: true } },
    ]);

    return { patients: results, total, page, limit };
  }

  const total = await Patient.countDocuments(match);
  const patients = await Patient.find(match)
    .populate('userId primaryDoctorId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { patients, total, page, limit };
};
