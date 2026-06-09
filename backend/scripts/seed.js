import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Hospital from '../models/Hospital.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';
import Chat from '../models/Chat.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    // Clear collections
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Hospital.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Notification.deleteMany({});
    await Chat.deleteMany({});

    const permissions = [
      'view_users', 'view_user', 'view_user_full', 'create_users', 'update_user', 'delete_user',
      'view_doctors', 'view_doctor', 'view_doctor_dashboard', 'view_doctor_patients', 'view_doctor_appointments', 'view_doctor_prescriptions', 'view_doctor_profile', 'create_doctors', 'update_doctors', 'delete_doctors',
      'view_patients', 'view_patient', 'view_patient_full', 'view_self_patient', 'create_patients', 'update_patient', 'delete_patients', 'clear_patient_data',
      'view_medical_records', 'view_medical_record', 'create_medical_records', 'update_medical_records', 'delete_medical_records',
      'view_roles', 'create_roles', 'update_roles', 'delete_roles',
      'view_permissions', 'create_permissions', 'delete_permissions',
      'view_settings', 'update_settings',
      'view_audits',
      'view_announcements', 'create_announcements', 'update_announcements', 'delete_announcements', 'send_announcements',
    ];

    await Permission.insertMany(permissions.map((name) => ({ name, description: `Permission to ${name.replace(/_/g, ' ')}` })));

    const allPermissions = await Permission.find({}).lean();
    const allPermissionNames = allPermissions.map((permission) => permission.name);

    const adminRole = await Role.create({
      name: 'admin',
      description: 'Full system administrator with all permissions',
      permissions: allPermissionNames,
    });

    const doctorRole = await Role.create({
      name: 'doctor',
      description: 'Medical provider with access to patient records and appointments',
      permissions: [
        'view_doctors', 'view_doctor', 'view_doctor_dashboard', 'view_doctor_patients', 'view_doctor_appointments', 'view_doctor_prescriptions', 'view_doctor_profile',
        'view_patients', 'view_patient', 'view_patient_full',
        'view_medical_records', 'view_medical_record', 'create_medical_records', 'update_medical_records',
        'view_announcements',
      ],
    });

    const patientRole = await Role.create({
      name: 'patient',
      description: 'Patient account with access to their own health information',
      permissions: [
        'view_self_patient', 'view_patient', 'view_patient_full',
        'view_medical_records', 'view_medical_record',
        'view_announcements',
      ],
    });

    const hashedPwd = await bcrypt.hash('password123', 10);

    const admin = await User.create({ name: 'Alice Admin', email: 'alice@example.com', passwordHash: hashedPwd, role: 'admin', permissions: adminRole.permissions, phone: '+1234567890' });
    const hospital = await Hospital.create({ name: 'Central Hospital', address: '123 Main Street', phone: '+1234567890', email: 'contact@centralhospital.com', adminId: admin._id });

    // Create doctor user and doctor profile
    const drBobUser = await User.create({
      name: 'Dr. Bob',
      email: 'bob@example.com',
      passwordHash: hashedPwd,
      role: 'doctor',
      permissions: doctorRole.permissions,
      phone: '+1987654321',
    });
    const drBob = await Doctor.create({
      userId: drBobUser._id,
      hospitalId: hospital._id,
      specialty: 'General Medicine',
      experience: 10,
      rating: 4.8,
      about: 'Experienced general practitioner',
    });

    // Create patient user and profile
    const patientUser = await User.create({
      name: 'Patient Paul',
      email: 'paul@example.com',
      passwordHash: hashedPwd,
      role: 'patient',
      permissions: patientRole.permissions,
      phone: '+1098765432',
    });
    const patient = await Patient.create({
      userId: patientUser._id,
      primaryDoctorId: drBob._id,
      age: 30,
      gender: 'male',
      bloodType: 'O+',
      medicalHistory: ['asthma'],
      allergies: ['penicillin'],
      chronicConditions: ['hypertension'],
    });

    // Create appointment and set admin approval
    const appt = await Appointment.create({
      patientId: patient._id,
      doctorId: drBob._id,
      adminId: admin._id,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'confirmed',
      reason: 'Annual checkup',
      notes: 'Please arrive 10 minutes early.',
    });

    // Create prescription pending approval
    const prescription = await Prescription.create({
      appointmentId: appt._id,
      doctorId: drBob._id,
      patientId: patient._id,
      issuedBy: drBobUser._id,
      status: 'pending',
      items: [
        { name: 'Medicine A', dosage: '1 pill', frequency: 'daily', duration: '7 days', notes: 'Take after breakfast' },
        { name: 'Medicine B', dosage: '2 pills', frequency: 'twice daily', duration: '5 days', notes: 'Take with water' },
      ],
    });

    // Create notifications for patient and admin
    await Notification.create({
      recipientId: patientUser._id,
      senderId: drBobUser._id,
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Bob is confirmed for next week.',
      relatedType: 'Appointment',
      relatedId: appt._id,
    });

    await Notification.create({
      recipientId: admin._id,
      senderId: drBobUser._id,
      type: 'prescription',
      title: 'Prescription Pending Approval',
      message: 'Dr. Bob submitted a prescription for Patient Paul.',
      relatedType: 'Prescription',
      relatedId: prescription._id,
    });

    // Create a chat between doctor and patient
    await Chat.create({
      participants: [drBobUser._id, patientUser._id],
      subject: 'Follow-up instructions',
      messages: [
        { senderId: drBobUser._id, text: 'Hi Paul, please remember to take your medication.' },
        { senderId: patientUser._id, text: 'Thank you, Doctor!' },
      ],
    });

    console.log('Seeding complete');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
