import * as medicalRecordService from '../services/medicalRecordService.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { validateMedicalRecordCreate, validateMedicalRecordUpdate } from '../validators/medicalRecordValidator.js';

const isSelfPatient = (user, record) => {
  return user.role === 'patient' && record.patientId?.toString() === user._id.toString();
};

const isSelfDoctor = (user, record) => {
  return user.role === 'doctor' && record.doctorId?.toString() === user._id.toString();
};

const canViewRecord = async (req, record) => {
  if (!record) return false;
  if (req.user.role === 'admin') return true;
  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    return doctor && doctor._id.toString() === record.doctorId.toString();
  }
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user._id });
    return patient && patient._id.toString() === record.patientId.toString();
  }
  return false;
};

export const listMedicalRecords = async (req, res, next) => {
  try {
    const { doctorId, patientId, status, page = 1, limit = 20 } = req.query;
    if (req.user.role === 'patient' && patientId && patientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    const data = await medicalRecordService.searchMedicalRecords({ doctorId, patientId, status, page: Number(page), limit: Number(limit) });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getMedicalRecordById = async (req, res, next) => {
  try {
    const record = await medicalRecordService.getMedicalRecordById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Medical record not found' });
    const authorized = await canViewRecord(req, record);
    if (!authorized) return res.status(403).json({ message: 'Access forbidden: cannot view this medical record' });
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const createMedicalRecord = async (req, res, next) => {
  try {
    const validationErrors = validateMedicalRecordCreate(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: only doctors and admins can create medical records' });
    }

    const record = await medicalRecordService.createMedicalRecord({ ...req.body, createdBy: req.user._id, updatedBy: req.user._id });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const updateMedicalRecord = async (req, res, next) => {
  try {
    const validationErrors = validateMedicalRecordUpdate(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    const record = await medicalRecordService.getMedicalRecordById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Medical record not found' });

    const authorized = await canViewRecord(req, record);
    if (!authorized) return res.status(403).json({ message: 'Access forbidden: cannot update this medical record' });

    const updatedRecord = await medicalRecordService.updateMedicalRecord(req.params.id, { ...req.body, updatedBy: req.user._id });
    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
};

export const deleteMedicalRecord = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: only admins can delete medical records' });
    }
    await medicalRecordService.deleteMedicalRecord(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getRecordsByPatient = async (req, res, next) => {
  try {
    if (req.user.role === 'patient' && req.user._id.toString() !== req.params.patientId) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    const records = await medicalRecordService.getRecordsByPatient(req.params.patientId);
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const getRecordsByDoctor = async (req, res, next) => {
  try {
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || doctor._id.toString() !== req.params.doctorId) {
        return res.status(403).json({ message: 'Access forbidden' });
      }
    }
    const records = await medicalRecordService.getRecordsByDoctor(req.params.doctorId);
    res.json(records);
  } catch (error) {
    next(error);
  }
};
