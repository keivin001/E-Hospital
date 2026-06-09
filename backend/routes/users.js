import express from 'express';
import mongoose from 'mongoose';
import { verifyToken, authorize, authorizeSelfOr } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Hospital from '../models/Hospital.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/', verifyToken, authorize('admin', 'perm:view_users'), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

router.get('/:id', verifyToken, authorizeSelfOr('id', 'admin', 'perm:view_user'), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.get('/:id/full', verifyToken, authorizeSelfOr('id', 'admin', 'perm:view_user_full'), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: user._id }).populate('userId hospitalId');
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const appointments = await Appointment.find({ doctorId: doctor._id }).populate('patientId doctorId adminId');
    const prescriptions = await Prescription.find({ doctorId: doctor._id }).populate('appointmentId patientId doctorId');
    const notifications = await Notification.find({ recipientId: user._id }).populate('senderId');
    const patients = await Patient.find({ primaryDoctorId: doctor._id }).populate('userId');

    return res.json({ user, doctor, appointments, prescriptions, notifications, patients });
  }

  if (user.role === 'patient') {
    const patient = await Patient.findOne({ userId: user._id }).populate('userId primaryDoctorId');
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const appointments = await Appointment.find({ patientId: patient._id }).populate('patientId doctorId adminId');
    const prescriptions = await Prescription.find({ patientId: patient._id }).populate('appointmentId patientId doctorId');
    const notifications = await Notification.find({ recipientId: user._id }).populate('senderId');
    const doctor = patient.primaryDoctorId ? await Doctor.findById(patient.primaryDoctorId).populate('userId hospitalId') : null;

    return res.json({ user, patient, doctor, appointments, prescriptions, notifications });
  }

  const notifications = await Notification.find({ recipientId: user._id }).populate('senderId');
  res.json({ user, notifications });
});

router.post('/register', async (req, res) => {
  const {
    name,
    email,
    passwordHash,
    role,
    phone,
    avatarUrl,
    specialty,
    hospitalId,
    experience,
    rating,
    about,
    age,
    gender,
    bloodType,
    medicalHistory,
    allergies,
    chronicConditions,
    primaryDoctorId,
  } = req.body;

  const user = new User({ name, email, passwordHash, role, phone, avatarUrl });
  await user.save();

  let profile = null;
  if (role === 'doctor') {
    let resolvedHospitalId = hospitalId;
    if (hospitalId && !mongoose.Types.ObjectId.isValid(hospitalId)) {
      const found = await Hospital.findOne({ name: hospitalId });
      if (found) resolvedHospitalId = found._id;
    }
    profile = await Doctor.create({
      userId: user._id,
      specialty: specialty || 'General',
      hospitalId: resolvedHospitalId,
      experience: experience || 0,
      rating: rating || 0,
      about: about || '',
    });
  } else if (role === 'patient') {
    profile = await Patient.create({
      userId: user._id,
      primaryDoctorId,
      age: age || 0,
      gender: gender || 'unknown',
      bloodType,
      medicalHistory: medicalHistory || [],
      allergies: allergies || [],
      chronicConditions: chronicConditions || [],
    });
  }

  res.status(201).json({ user, profile });
});

router.post('/', verifyToken, authorize('admin', 'perm:create_users'), async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

router.put('/:id', verifyToken, authorizeSelfOr('id', 'admin', 'perm:update_user'), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.delete('/:id', verifyToken, authorize('admin', 'perm:delete_user'), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await User.findByIdAndDelete(req.params.id);
  if (user.role === 'doctor') await Doctor.deleteOne({ userId: user._id });
  if (user.role === 'patient') await Patient.deleteOne({ userId: user._id });

  res.status(204).end();
});

export default router;
