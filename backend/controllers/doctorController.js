import * as doctorService from '../services/doctorService.js';
import { validateDoctorCreate, validateDoctorUpdate } from '../validators/doctorValidator.js';

export const listDoctors = async (req, res, next) => {
  try {
    const { specialty, active, availability, hospitalId, search, page = 1, limit = 20 } = req.query;
    const data = await doctorService.searchDoctors({ specialty, active, availability, hospitalId, search, page: Number(page), limit: Number(limit) });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

export const getDoctorProfile = async (req, res, next) => {
  try {
    const profile = await doctorService.getDoctorProfile(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const getDoctorDashboard = async (req, res, next) => {
  try {
    const dashboard = await doctorService.getDoctorDashboard(req.params.id);
    if (!dashboard) return res.status(404).json({ message: 'Doctor dashboard not found' });
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const validationErrors = validateDoctorCreate(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    const existing = await doctorService.getDoctorByUserId(req.body.userId);
    if (existing) {
      return res.status(409).json({ message: 'Doctor profile already exists for this user' });
    }

    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const validationErrors = validateDoctorUpdate(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (req.user.role === 'doctor' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access forbidden: cannot update another doctor profile' });
    }

    const updatedDoctor = await doctorService.updateDoctor(req.params.id, req.body);
    res.json(updatedDoctor);
  } catch (error) {
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await doctorService.deleteDoctor(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getDoctorPatients = async (req, res, next) => {
  try {
    const patients = await doctorService.getDoctorPatients(req.params.id);
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await doctorService.getDoctorAppointments(req.params.id);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getDoctorPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await doctorService.getDoctorPrescriptions(req.params.id);
    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};
