import Patient from '../models/Patient.js';
import * as patientService from '../services/patientService.js';
import { validatePatientCreate, validatePatientUpdate } from '../validators/patientValidator.js';

const patientOwnedByUser = (patient, user) => {
  if (!patient || !user) return false;
  return patient.userId?.toString() === user._id.toString();
};

export const listPatients = async (req, res, next) => {
  try {
    const { search, gender, bloodType, active, page = 1, limit = 20 } = req.query;
    const data = await patientService.searchPatients({ search, gender, bloodType, active, page: Number(page), limit: Number(limit) });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (req.user.role === 'patient' && !patientOwnedByUser(patient, req.user)) {
      return res.status(403).json({ message: 'Access forbidden: cannot view another patient record' });
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
};

export const getPatientByUserId = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientByUserId(req.params.userId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const isSelf = req.user.role === 'patient' && patientOwnedByUser(patient, req.user);
    const isAdminOrDoctor = ['admin', 'doctor'].includes(req.user.role);
    if (!isAdminOrDoctor && !isSelf) {
      return res.status(403).json({ message: 'Access forbidden: cannot view another patient record' });
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientByUserId(req.user._id);
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

export const getPatientProfile = async (req, res, next) => {
  try {
    const profile = await patientService.getPatientProfile(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Patient profile not found' });

    if (req.user.role === 'patient' && !patientOwnedByUser(profile.patient, req.user)) {
      return res.status(403).json({ message: 'Access forbidden: cannot view another patient profile' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const createPatient = async (req, res, next) => {
  try {
    const validationErrors = validatePatientCreate(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    const existing = await Patient.findOne({ userId: req.body.userId });
    if (existing) {
      return res.status(409).json({ message: 'A patient profile already exists for this user' });
    }

    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

export const createPatientFull = async (req, res, next) => {
  try {
    const { userData, patientData, appointments, prescriptions, notifications, chats } = req.body;
    if (!userData || !patientData) {
      return res.status(400).json({ message: 'userData and patientData are required to create a full patient record' });
    }

    const created = await patientService.createPatientWithUser({ userData, patientData, appointments, prescriptions, notifications, chats });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const validationErrors = validatePatientUpdate(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (req.user.role === 'patient' && !patientOwnedByUser(patient, req.user)) {
      return res.status(403).json({ message: 'Access forbidden: cannot update another patient profile' });
    }

    const updatedPatient = await patientService.updatePatient(req.params.id, req.body);
    res.json(updatedPatient);
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patientService.deletePatient(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const clearPatientData = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (req.user.role === 'patient' && !patientOwnedByUser(patient, req.user)) {
      return res.status(403).json({ message: 'Access forbidden: cannot clear another patient record' });
    }

    await patientService.clearPatientRecords(patient, patient.userId);
    res.json({ message: 'Patient-related records cleared successfully' });
  } catch (error) {
    next(error);
  }
};
