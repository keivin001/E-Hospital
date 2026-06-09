import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Hospital from '../models/Hospital.js';
import { signToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'patient', phone, avatarUrl, specialty, hospitalId, experience, rating, about, age, gender, bloodType, medicalHistory, allergies, chronicConditions, primaryDoctorId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const safeRole = ['patient', 'doctor'].includes(role) ? role : 'patient';
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: safeRole, phone, avatarUrl });
    let profile = null;

    if (safeRole === 'doctor') {
      let resolvedHospitalId = hospitalId;
      if (hospitalId && !mongoose.Types.ObjectId.isValid(hospitalId)) {
        const found = await Hospital.findOne({ name: hospitalId });
        if (found) resolvedHospitalId = found._id;
      }
      profile = await Doctor.create({ userId: user._id, specialty, hospitalId: resolvedHospitalId, experience: experience || 0, rating: rating || 0, about });
    } else if (safeRole === 'patient') {
      profile = await Patient.create({ userId: user._id, primaryDoctorId, age: age || 0, gender: gender || 'unknown', bloodType, medicalHistory: medicalHistory || [], allergies: allergies || [], chronicConditions: chronicConditions || [] });
    }

    const token = signToken(user);
    const userData = user.toObject();
    delete userData.passwordHash;
    res.status(201).json({ user: userData, profile, token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    const userData = user.toObject();
    delete userData.passwordHash;
    res.json({ user: userData, token });
  } catch (error) {
    next(error);
  }
});

export default router;
