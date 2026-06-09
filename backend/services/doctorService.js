import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';
import MedicalRecord from '../models/MedicalRecord.js';

const buildMatchQuery = ({ specialty, active, availability, hospitalId, search }) => {
  const match = {};
  if (specialty) match.specialty = specialty;
  if (active !== undefined) match.active = active === true || active === 'true';
  if (availability !== undefined) match.availability = availability === true || availability === 'true';
  if (hospitalId) match.hospitalId = hospitalId;
  if (search) {
    match.$text = { $search: search };
  }
  return match;
};

export const getDoctorById = (id) => {
  return Doctor.findById(id).populate('userId hospitalId');
};

export const getDoctorByUserId = (userId) => {
  return Doctor.findOne({ userId }).populate('userId hospitalId');
};

export const searchDoctors = async ({ specialty, active, availability, hospitalId, search, page = 1, limit = 20 }) => {
  const match = buildMatchQuery({ specialty, active, availability, hospitalId, search });
  const skip = Math.max(0, page - 1) * limit;

  const total = await Doctor.countDocuments(match);
  const doctors = await Doctor.find(match)
    .populate('userId hospitalId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { doctors, total, page, limit };
};

export const createDoctor = (payload) => {
  return Doctor.create(payload);
};

export const updateDoctor = (id, payload) => {
  return Doctor.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

export const deleteDoctor = (id) => {
  return Doctor.findByIdAndDelete(id);
};

export const getDoctorProfile = async (doctorId) => {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) return null;

  const patients = await Patient.find({ primaryDoctorId: doctor._id }).populate('userId');
  const appointments = await Appointment.find({ doctorId: doctor._id }).populate('patientId doctorId adminId');
  const prescriptions = await Prescription.find({ doctorId: doctor._id }).populate('appointmentId patientId doctorId');
  const medicalRecords = await MedicalRecord.find({ doctorId: doctor._id }).populate('patientId doctorId');
  const notifications = await Notification.find({ recipientId: doctor.userId }).populate('senderId');

  return { doctor, patients, appointments, prescriptions, medicalRecords, notifications };
};

export const getDoctorDashboard = async (doctorId) => {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) return null;

  const [patientCount, appointmentCount, upcomingAppointments, prescriptionCount, recordCount, unreadNotifications] = await Promise.all([
    Patient.countDocuments({ primaryDoctorId: doctor._id }),
    Appointment.countDocuments({ doctorId: doctor._id }),
    Appointment.countDocuments({ doctorId: doctor._id, date: { $gte: new Date() }, status: { $in: ['pending', 'confirmed'] } }),
    Prescription.countDocuments({ doctorId: doctor._id }),
    MedicalRecord.countDocuments({ doctorId: doctor._id }),
    Notification.countDocuments({ recipientId: doctor.userId, read: false }),
  ]);

  return {
    doctor,
    patientCount,
    appointmentCount,
    upcomingAppointments,
    prescriptionCount,
    medicalRecordCount: recordCount,
    unreadNotifications,
  };
};

export const getDoctorPatients = (doctorId) => {
  return Patient.find({ primaryDoctorId: doctorId }).populate('userId');
};

export const getDoctorAppointments = (doctorId) => {
  return Appointment.find({ doctorId }).populate('patientId doctorId adminId');
};

export const getDoctorPrescriptions = (doctorId) => {
  return Prescription.find({ doctorId }).populate('appointmentId patientId doctorId');
};
